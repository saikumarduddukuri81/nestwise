import os
import json
import time
import numpy as np
import pandas as pd
import joblib
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split, KFold, cross_val_score
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor, HistGradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.inspection import permutation_importance
import xgboost as xgb

def train_and_evaluate():
    data_path = 'c:/Users/SAI KUMAR/Downloads/placement-portal/nestwise/data/train.csv'
    models_dir = 'c:/Users/SAI KUMAR/Downloads/placement-portal/nestwise/ml/models'
    os.makedirs(models_dir, exist_ok=True)

    print("Loading dataset from:", data_path)
    df = pd.read_csv(data_path)
    print(f"Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")

    target_col = 'Price_INR_Lakhs'
    drop_cols = ['Property_ID', target_col]
    feature_cols = [c for c in df.columns if c not in drop_cols]
    
    categorical_cols = ['City', 'Locality_Type', 'Property_Type', 'Furnishing_Status']
    numerical_cols = [c for c in feature_cols if c not in categorical_cols]
    
    print(f"Categorical features ({len(categorical_cols)}):", categorical_cols)
    print(f"Numerical features ({len(numerical_cols)}):", numerical_cols)

    X = df[feature_cols]
    y = df[target_col]

    # 80/20 train/val split
    X_train, X_val, y_train, y_val = train_test_split(
        X, y, test_size=0.20, random_state=42
    )
    print(f"Training set: {X_train.shape[0]} samples | Validation set: {X_val.shape[0]} samples")

    # Column transformer
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_cols),
            ('cat', OneHotEncoder(drop='first', handle_unknown='ignore', sparse_output=False), categorical_cols)
        ]
    )

    # Models dictionary
    models = {
        'Linear Regression': LinearRegression(),
        'Decision Tree': DecisionTreeRegressor(max_depth=12, min_samples_split=10, random_state=42),
        'Random Forest': RandomForestRegressor(n_estimators=100, max_depth=16, min_samples_split=8, n_jobs=-1, random_state=42),
        'Gradient Boosting': HistGradientBoostingRegressor(max_iter=180, max_depth=10, learning_rate=0.07, random_state=42),
        'XGBoost': xgb.XGBRegressor(n_estimators=180, max_depth=6, learning_rate=0.07, n_jobs=-1, random_state=42)
    }

    results = {}
    fitted_pipelines = {}

    for name, model in models.items():
        print(f"\nTraining {name}...")
        start_time = time.time()
        
        pipeline = Pipeline(steps=[
            ('preprocessor', preprocessor),
            ('regressor', model)
        ])
        
        pipeline.fit(X_train, y_train)
        train_time = round(time.time() - start_time, 2)
        
        y_val_pred = pipeline.predict(X_val)
        y_train_pred = pipeline.predict(X_train)
        
        val_mae = mean_absolute_error(y_val, y_val_pred)
        val_rmse = np.sqrt(mean_squared_error(y_val, y_val_pred))
        val_r2 = r2_score(y_val, y_val_pred)
        
        train_mae = mean_absolute_error(y_train, y_train_pred)
        train_rmse = np.sqrt(mean_squared_error(y_train, y_train_pred))
        train_r2 = r2_score(y_train, y_train_pred)

        results[name] = {
            'train_mae': round(float(train_mae), 2),
            'train_rmse': round(float(train_rmse), 2),
            'train_r2': round(float(train_r2), 4),
            'val_mae': round(float(val_mae), 2),
            'val_rmse': round(float(val_rmse), 2),
            'val_r2': round(float(val_r2), 4),
            'train_time_sec': train_time
        }
        fitted_pipelines[name] = pipeline
        
        print(f"{name} -> Val MAE: {val_mae:.2f} | Val RMSE: {val_rmse:.2f} | Val R²: {val_r2:.4f} (Time: {train_time}s)")

    # 5-Fold Cross-Validation on Gradient Boosting (to verify stability and lack of overfitting)
    print("\nRunning 5-Fold Cross Validation on Gradient Boosting...")
    kf = KFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = cross_val_score(fitted_pipelines['Gradient Boosting'], X_train, y_train, cv=kf, scoring='r2', n_jobs=-1)
    print(f"5-Fold CV R² scores: {np.round(cv_scores, 4)}")
    print(f"Mean CV R²: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")

    # Select best model
    best_model_name = max(results, key=lambda k: results[k]['val_r2'])
    best_pipeline = fitted_pipelines[best_model_name]
    print(f"\n==========================================")
    print(f"BEST MODEL SELECTED: {best_model_name} (Val R² = {results[best_model_name]['val_r2']})")
    print(f"==========================================")

    # Save best model pipeline
    best_model_path = os.path.join(models_dir, 'best_model_pipeline.joblib')
    joblib.dump(best_pipeline, best_model_path)
    print(f"Saved complete pipeline to: {best_model_path}")

    # Compute Feature Importance using Permutation Importance on validation set
    print("\nComputing Permutation Feature Importances on validation data...")
    val_sample_idx = np.random.RandomState(42).choice(len(X_val), size=3000, replace=False)
    X_val_sample = X_val.iloc[val_sample_idx]
    y_val_sample = y_val.iloc[val_sample_idx]

    perm_importance = permutation_importance(
        best_pipeline, X_val_sample, y_val_sample, n_repeats=5, random_state=42, n_jobs=-1
    )

    raw_features = list(X.columns)
    importances = perm_importance.importances_mean
    # Normalize to percentages
    positive_sum = np.sum(np.maximum(importances, 0))
    feature_importances = []
    
    sorted_idx = np.argsort(importances)[::-1]
    for idx in sorted_idx:
        feat_name = raw_features[idx]
        imp_val = float(importances[idx])
        pct_val = round(float((max(imp_val, 0) / positive_sum) * 100), 2)
        feature_importances.append({
            'feature': feat_name,
            'importance_score': round(imp_val, 4),
            'importance_pct': pct_val
        })
        print(f"  {feat_name:<28}: {pct_val:>5.2f}%")

    with open(os.path.join(models_dir, 'feature_importance.json'), 'w') as f:
        json.dump(feature_importances, f, indent=2)

    # Plot Feature Importance
    plt.figure(figsize=(10, 6))
    top_features = feature_importances[:12]
    plt.barh([f['feature'].replace('_', ' ') for f in reversed(top_features)], 
             [f['importance_pct'] for f in reversed(top_features)], 
             color='#2563EB')
    plt.xlabel('Importance Percentage (%)', fontsize=12)
    plt.title(f'Feature Importance in Indian Real Estate Pricing ({best_model_name})', fontsize=14, fontweight='bold')
    plt.tight_layout()
    plt.savefig(os.path.join(models_dir, 'feature_importance.png'), dpi=200)
    plt.close()

    # Save metrics JSON
    metrics_path = os.path.join(models_dir, 'metrics.json')
    with open(metrics_path, 'w') as f:
        json.dump({
            'best_model': best_model_name,
            'cross_validation': {
                'folds': 5,
                'mean_r2': round(float(cv_scores.mean()), 4),
                'std_r2': round(float(cv_scores.std()), 4),
                'scores': [round(float(s), 4) for s in cv_scores]
            },
            'models_comparison': results,
            'feature_names': {
                'numerical': numerical_cols,
                'categorical': categorical_cols,
                'all': feature_cols
            }
        }, f, indent=2)
    print(f"Saved metrics comparison to: {metrics_path}")

    # Actual vs Predicted Plot
    y_val_pred_best = best_pipeline.predict(X_val)
    
    plt.figure(figsize=(8, 8))
    plt.scatter(y_val[:1200], y_val_pred_best[:1200], alpha=0.35, color='#2563EB', edgecolors='none', s=25)
    max_val = max(y_val[:1200].max(), y_val_pred_best[:1200].max())
    plt.plot([0, max_val], [0, max_val], 'r--', lw=2, label='Perfect Prediction (y = x)')
    plt.xlabel('Actual Price (₹ Lakhs)', fontsize=12)
    plt.ylabel('Predicted Price (₹ Lakhs)', fontsize=12)
    plt.title(f'Actual vs Predicted House Prices ({best_model_name})', fontsize=14, fontweight='bold')
    plt.legend()
    plt.tight_layout()
    plt.savefig(os.path.join(models_dir, 'actual_vs_predicted.png'), dpi=200)
    plt.close()

    # Save sample points for frontend Recharts scatter plot
    sample_indices = np.random.RandomState(42).choice(len(y_val), size=120, replace=False)
    actual_vs_pred_data = [
        {
            'actual': round(float(y_val.iloc[i]), 2),
            'predicted': round(float(y_val_pred_best[i]), 2),
            'error': round(float(abs(y_val.iloc[i] - y_val_pred_best[i])), 2)
        }
        for i in sample_indices
    ]
    with open(os.path.join(models_dir, 'actual_vs_predicted.json'), 'w') as f:
        json.dump(actual_vs_pred_data, f, indent=2)

    # Predict test.csv and create submission verify
    test_path = 'c:/Users/SAI KUMAR/Downloads/placement-portal/nestwise/data/test.csv'
    test_df = pd.read_csv(test_path)
    X_test = test_df[feature_cols]
    test_preds = best_pipeline.predict(X_test)
    test_preds = np.maximum(test_preds, 5.0) # Ensure non-negative/realistic floor
    
    submission_df = pd.DataFrame({
        'Property_ID': test_df['Property_ID'],
        'Price_INR_Lakhs': np.round(test_preds, 2)
    })
    submission_path = os.path.join(models_dir, 'test_predictions.csv')
    submission_df.to_csv(submission_path, index=False)
    print(f"Saved test set predictions ({submission_df.shape[0]} rows) to: {submission_path}")
    print("Sample test predictions:")
    print(submission_df.head())

    print("\nPhase 2 completed with excellence!")

if __name__ == '__main__':
    train_and_evaluate()
