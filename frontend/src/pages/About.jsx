import React from 'react';
import { 
  Building2, 
  Database, 
  Cpu, 
  ShieldCheck, 
  BarChart3, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Layers, 
  Code,
  MapPin,
  TrendingUp,
  Award
} from 'lucide-react';

export default function About({ setActiveTab }) {
  const datasets = [
    {
      name: 'train.csv',
      records: '80,000 Rows',
      columns: '18 Columns',
      desc: 'Primary historical property transactions dataset with 0 missing values, complete with features and target Price_INR_Lakhs.'
    },
    {
      name: 'test.csv',
      records: '20,000 Rows',
      columns: '17 Columns',
      desc: 'Unseen evaluation callset with identical 16 feature columns, excluding target variable for independent model testing.'
    },
    {
      name: 'sample_submission.csv',
      records: '20,000 Rows',
      columns: '2 Columns',
      desc: 'Standard submission format mapping Property_ID to predicted Price_INR_Lakhs.'
    },
    {
      name: 'metaData.csv',
      records: '18 Attributes',
      columns: 'Metadata Schema',
      desc: 'Complete data dictionary documenting column names, data types, feature classifications, and target indicator.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md mb-2">
          <Building2 className="w-3.5 h-3.5 text-blue-600" />
          <span>System Documentation & Methodology</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          About NestWise
        </h1>
        <p className="text-slate-500 text-sm mt-1 max-w-3xl">
          An India-focused house price prediction and personalized property recommendation system engineered from scratch with full-stack machine learning rigor.
        </p>
      </div>

      {/* Vision & Context */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            India Real Estate Context
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Addressing Price Asymmetry in Indian Urban Housing
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Real estate in India is heavily localized. Factors such as metro proximity, gated community security, super built-up vs. carpet area loading ratios, and city tiers cause substantial valuation variations across micro-markets.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            <strong className="text-slate-900">NestWise</strong> solves this by training ensemble regression models on verified urban housing records across 10 major Indian metros (Mumbai, Delhi NCR, Bangalore, Pune, Hyderabad, Chennai, Kolkata, Ahmedabad, Jaipur, and Chandigarh). Rather than relying on speculative estimates, NestWise predicts realistic valuations in Indian Rupees (₹ Lakhs & Crores) and matches home-seekers with dataset-backed properties.
          </p>
          <div className="pt-2 flex flex-wrap gap-2 text-xs font-bold text-slate-700">
            <span className="bg-slate-100 px-3 py-1.5 rounded-lg">₹ INR Currency</span>
            <span className="bg-slate-100 px-3 py-1.5 rounded-lg">Square Feet Area</span>
            <span className="bg-slate-100 px-3 py-1.5 rounded-lg">10 Indian Metros</span>
            <span className="bg-slate-100 px-3 py-1.5 rounded-lg">No Hardcoded Pricing</span>
          </div>
        </div>

        <div className="bg-gradient-to-tr from-blue-600 to-sky-500 rounded-3xl p-8 text-white shadow-xl space-y-4">
          <Award className="w-10 h-10 text-sky-200" />
          <h3 className="text-xl font-bold">Key Project Achievements</h3>
          <ul className="space-y-2.5 text-xs text-blue-50">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-300 shrink-0" />
              <span><strong>0.7862 Validation R²</strong> achieved by Gradient Boosting Regressor</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-300 shrink-0" />
              <span><strong>80,000 Verified Training Records</strong> with 100% data completeness (0 nulls)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-300 shrink-0" />
              <span><strong>Joblib Pipeline</strong> encapsulating OneHotEncoder, StandardScaler, & Regressor</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-300 shrink-0" />
              <span><strong>Multi-Criteria Recommender</strong> with similarity scoring & explainable match reasons</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-300 shrink-0" />
              <span><strong>Interactive React + Tailwind + FastAPI</strong> responsive full-stack platform</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Dataset Overview */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Data Architecture
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-2">Dataset Specifications</h2>
          <p className="text-slate-500 text-sm">Four core datasets utilized in the development of NestWise.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {datasets.map((d, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{d.name}</span>
                  <Database className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-lg font-bold text-slate-900">{d.records}</div>
                <div className="text-xs font-semibold text-slate-400 mb-2">{d.columns}</div>
                <p className="text-xs text-slate-500 leading-relaxed">{d.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Machine Learning Pipeline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Machine Learning
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-2">ML Pipeline & Preprocessing Workflow</h2>
          <p className="text-slate-500 text-sm">
            Strict isolation of training and evaluation to prevent data leakage and ensure real-world generalization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="font-extrabold text-blue-700 block text-sm">1. Train-Val Split</span>
            <p className="text-slate-600 leading-relaxed">
              80% Training split (64,000 instances) and 20% Validation split (16,000 instances) partitioned with a fixed seed (`random_state=42`).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="font-extrabold text-blue-700 block text-sm">2. ColumnTransformer</span>
            <p className="text-slate-600 leading-relaxed">
              `StandardScaler` applied to 12 numerical features; `OneHotEncoder(drop='first', handle_unknown='ignore')` applied to 4 categorical features.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="font-extrabold text-blue-700 block text-sm">3. Multi-Model Benchmarking</span>
            <p className="text-slate-600 leading-relaxed">
              Comparative training of Linear Regression, Decision Tree, Random Forest, HistGradientBoosting, and XGBoost with evaluation on MAE, RMSE, and R².
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="font-extrabold text-blue-700 block text-sm">4. Pipeline Export</span>
            <p className="text-slate-600 leading-relaxed">
              The winning Gradient Boosting pipeline is saved to `best_model_pipeline.joblib`, loaded dynamically by FastAPI without manual re-encoding.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>5-Fold Cross Validation confirmed consistent 0.7837 R² with low variance (± 0.0158).</span>
          </div>
          <button
            onClick={() => setActiveTab('analytics')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 underline"
          >
            Inspect Detailed Analytics →
          </button>
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Full-Stack Technology Stack
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-2">Tools & Libraries Used</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-blue-600 font-bold text-sm">React 18</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Frontend Library</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-blue-600 font-bold text-sm">Tailwind CSS</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Styling System</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-blue-600 font-bold text-sm">FastAPI</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Python Backend</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-blue-600 font-bold text-sm">Scikit-Learn</div>
            <div className="text-[11px] text-slate-500 mt-0.5">ML Pipeline & Tuning</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-blue-600 font-bold text-sm">Recharts</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Interactive Charts</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-blue-600 font-bold text-sm">Joblib</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Model Serialization</div>
          </div>
        </div>
      </div>

    </div>
  );
}
