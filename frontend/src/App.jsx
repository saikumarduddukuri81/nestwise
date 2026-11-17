import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Prediction from './pages/Prediction';
import Recommendations from './pages/Recommendations';
import Comparison from './pages/Comparison';
import MLAnalytics from './pages/MLAnalytics';
import About from './pages/About';
import { checkHealth } from './services/api';
import { Columns3, X, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [compareList, setCompareList] = useState([]);
  const [isBackendOnline, setIsBackendOnline] = useState(true);
  const [preFilledRecParams, setPreFilledRecParams] = useState(null);
  const [predictionInitialSpecs, setPredictionInitialSpecs] = useState(null);

  // Check backend health on initial load
  useEffect(() => {
    async function verifyBackend() {
      const res = await checkHealth();
      setIsBackendOnline(res?.model_loaded || false);
    }
    verifyBackend();
  }, []);

  const handleCompareToggle = (property) => {
    setCompareList(prev => {
      const exists = prev.some(p => p.Property_ID === property.Property_ID);
      if (exists) {
        return prev.filter(p => p.Property_ID !== property.Property_ID);
      }
      if (prev.length >= 3) {
        alert("You can compare up to 3 properties at once. Please remove one first.");
        return prev;
      }
      return [...prev, property];
    });
  };

  const handleRemoveFromCompare = (propertyId) => {
    setCompareList(prev => prev.filter(p => p.Property_ID !== propertyId));
  };

  const handleClearCompare = () => {
    setCompareList([]);
  };

  const handleQuickSearch = ({ city, bhk, budget }) => {
    setPreFilledRecParams({ city, bhk, budget });
    setActiveTab('recommendations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreFillRecommendation = (params) => {
    setPreFilledRecParams(params);
    setActiveTab('recommendations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUseForPrediction = (property) => {
    setPredictionInitialSpecs(property);
    setActiveTab('prediction');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        compareList={compareList} 
        isBackendOnline={isBackendOnline} 
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <Home 
            setActiveTab={setActiveTab} 
            onQuickSearch={handleQuickSearch} 
          />
        )}

        {activeTab === 'prediction' && (
          <Prediction 
            setActiveTab={setActiveTab}
            onPreFillRecommendation={handlePreFillRecommendation}
            initialSpecs={predictionInitialSpecs}
          />
        )}

        {activeTab === 'recommendations' && (
          <Recommendations 
            setActiveTab={setActiveTab}
            compareList={compareList}
            onCompareToggle={handleCompareToggle}
            onUseForPrediction={handleUseForPrediction}
            preFilledParams={preFilledRecParams}
          />
        )}

        {activeTab === 'comparison' && (
          <Comparison 
            compareList={compareList}
            onRemoveFromCompare={handleRemoveFromCompare}
            onClearCompare={handleClearCompare}
            onAddProperty={handleCompareToggle}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'analytics' && (
          <MLAnalytics />
        )}

        {activeTab === 'about' && (
          <About setActiveTab={setActiveTab} />
        )}
      </main>

      {/* Floating Compare Tray Notification if items exist and user is on another page */}
      {compareList.length > 0 && activeTab !== 'comparison' && (
        <aside aria-label="Comparison Tray" className="fixed bottom-6 right-6 z-40 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-4 animate-bounce-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-black">
              {compareList.length}
            </div>
            <div className="text-xs">
              <span className="font-bold block text-slate-100">Properties in Comparison</span>
              <span className="text-[10px] text-slate-400">Max 3 properties</span>
            </div>
          </div>
          <button
            onClick={() => { setActiveTab('comparison'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

    </div>
  );
}
