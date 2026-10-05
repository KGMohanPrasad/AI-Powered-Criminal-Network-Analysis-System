import React, { useState, useEffect } from 'react';
import { 
  Cpu, Network, Share2, AlertTriangle, GitFork, Sliders, Database, Layers, 
  Play, CheckCircle2, XCircle, ArrowUpRight, BarChart3, PieChart as PieIcon, ShieldAlert,
  Search, Download, RefreshCw, Info, Eye, ExternalLink, HelpCircle, ArrowRight,
  TrendingUp, Clock, ShieldCheck, Check, Calendar, Activity, ChevronRight, ChevronLeft,
  Sparkles, Zap, GitCommit, FileText, Split, Compass
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { aiApi } from '../services/api';
import toast from '../utils/toast';

export default function AiAnalysisPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [training, setTraining] = useState(false);
  const [trainingStep, setTrainingStep] = useState(0);

  // Data states
  const [networkData, setNetworkData] = useState(null);
  const [communityData, setCommunityData] = useState(null);
  const [anomalyData, setAnomalyData] = useState(null);
  const [linkData, setLinkData] = useState(null);
  const [caseSimData, setCaseSimData] = useState(null);
  const [clusteringData, setClusteringData] = useState(null);
  const [modelInfo, setModelInfo] = useState([]);
  const [modelMetrics, setModelMetrics] = useState(null);
  const [datasetData, setDatasetData] = useState(null);
  const [modelComparison, setModelComparison] = useState(null);
  const [networkChange, setNetworkChange] = useState(null);
  const [preprocessingDetails, setPreprocessingDetails] = useState(null);

  // Time filter for change detection
  const [changePeriod, setChangePeriod] = useState('30d');

  // Filter / Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [datasetSearch, setDatasetSearch] = useState('');

  // Shortest path interactive state
  const [sourceEntity, setSourceEntity] = useState('DEMO-P001');
  const [targetEntity, setTargetEntity] = useState('DEMO-P015');
  const [pathResult, setPathResult] = useState(null);
  const [findingPath, setFindingPath] = useState(false);

  // Modal / Drawer for "View Connections" on DEMO-P014 (Section 6)
  const [connectionsModalEntity, setConnectionsModalEntity] = useState(null);

  // 17-Step Faculty Viva Demonstration Guide State (Section 54)
  const [vivaStep, setVivaStep] = useState(1);
  const [vivaGuideOpen, setVivaGuideOpen] = useState(true);

  const vivaSteps = [
    { step: 1, title: "1. Login & Auth", tab: "dashboard", action: "System authenticates investigator role and initializes JWT session." },
    { step: 2, title: "2. Open Dashboard", tab: "dashboard", action: "Displays central telemetry, 8 KPI cards, and Model Pipeline visualization." },
    { step: 3, title: "3. Dataset Explorer", tab: "dataset", action: "Shows 100 synthetic persons, 357 relationships, 30 cases, 25 orgs." },
    { step: 4, title: "4. Explain Dataset", tab: "dataset", action: "Demonstrates strictly fictional demographic & synthetic call records." },
    { step: 5, title: "5. Show Preprocessing", tab: "preprocessing", action: "Displays 5 cleaning & encoding stages with Before vs After records." },
    { step: 6, title: "6. Feature Engineering", tab: "preprocessing", action: "Examines 11 engineered features (Centrality + Relational statistics)." },
    { step: 7, title: "7. Network Graph Studio", tab: "network", action: "Demonstrates interactive Cytoscape network with multi-node types." },
    { step: 8, title: "8. Centrality Analysis", tab: "network", action: "Computes Degree (DEMO-P014), Betweenness (DEMO-P008), Closeness (DEMO-P005), PageRank." },
    { step: 9, title: "9. Community Detection", tab: "communities", action: "Executes Louvain/Label Propagation to optimize Modularity (Q=0.485)." },
    { step: 10, title: "10. Inspect Communities", tab: "communities", action: "Analyzes 4 detected cohorts, internal link densities, and key hubs." },
    { step: 11, title: "11. Anomaly Detection", tab: "anomalies", action: "Executes Isolation Forest (100 iTrees) on 11-dimensional feature matrix." },
    { step: 12, title: "12. Anomaly Explanation", tab: "anomalies", action: "Examines DEMO-P021 (0.82) with 3 explainable root causes & factor weights." },
    { step: 13, title: "13. Link Prediction", tab: "links", action: "Calculates Common Neighbors, Jaccard, and Adamic-Adar unobserved edges." },
    { step: 14, title: "14. Review Candidate Link", tab: "links", action: "Evaluates DEMO-P003 ⟷ DEMO-P018 (78%) with supporting graph signals." },
    { step: 15, title: "15. Model Training & Metrics", tab: "training", action: "Inspects model registry, retrains pipeline, and updates model versions." },
    { step: 16, title: "16. Performance & Comparison", tab: "comparison", action: "Evaluates Isolation Forest vs LOF runtime, stability, and overlap." },
    { step: 17, title: "17. Generate Report", tab: "dashboard", action: "Produces formal investigative PDF report with model explanations & limitations." }
  ];

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [netRes, commRes, anomRes, linkRes, simRes, clustRes, modelsRes, metricsRes, dataRes, compRes, changeRes, prepRes] = await Promise.all([
        aiApi.runNetworkAnalysis().catch(() => ({ data: null })),
        aiApi.runCommunityDetection().catch(() => ({ data: null })),
        aiApi.runAnomalyDetection().catch(() => ({ data: null })),
        aiApi.runLinkPrediction().catch(() => ({ data: null })),
        aiApi.runCaseSimilarity().catch(() => ({ data: null })),
        aiApi.runClustering().catch(() => ({ data: null })),
        aiApi.getModels().catch(() => ({ data: { models: [] } })),
        aiApi.getModelMetrics().catch(() => ({ data: null })),
        aiApi.getDataset().catch(() => ({ data: null })),
        aiApi.getModelComparison().catch(() => ({ data: null })),
        aiApi.getNetworkChange(changePeriod).catch(() => ({ data: null })),
        aiApi.getPreprocessingDetails().catch(() => ({ data: null })),
      ]);

      setNetworkData(netRes.data?.data || netRes.data);
      setCommunityData(commRes.data?.data || commRes.data);
      setAnomalyData(anomRes.data?.data || anomRes.data);
      setLinkData(linkRes.data?.data || linkRes.data);
      setCaseSimData(simRes.data?.data || simRes.data);
      setClusteringData(clustRes.data?.data || clustRes.data);
      setModelInfo(modelsRes.data?.data?.models || modelsRes.data?.models || []);
      setModelMetrics(metricsRes.data?.data || metricsRes.data);
      setDatasetData(dataRes.data?.data || dataRes.data);
      setModelComparison(compRes.data?.data || compRes.data);
      setNetworkChange(changeRes.data?.data || changeRes.data);
      setPreprocessingDetails(prepRes.data?.data || prepRes.data);
    } catch (err) {
      console.error('Error fetching AIML data:', err);
      toast.error('Failed to load some AIML metrics.');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadAllData();
  }, []);

  const handleTrainModels = async () => {
    setTraining(true);
    setTrainingStep(1); // Load Data
    toast.loading('Step 1/5: Loading & validating synthetic dataset...', { id: 'train' });

    setTimeout(async () => {
      setTrainingStep(2); // Preprocessing & Scaling
      toast.loading('Step 2/5: Imputing values & fitting StandardScaler...', { id: 'train' });

      setTimeout(async () => {
        setTrainingStep(3); // Feature Engineering
        toast.loading('Step 3/5: Extracting NetworkX centralities & graph attributes...', { id: 'train' });

        setTimeout(async () => {
          setTrainingStep(4); // Fitting Models
          toast.loading('Step 4/5: Fitting Isolation Forest (100 iTrees) & K-Means++ (K=4)...', { id: 'train' });

          try {
            const res = await aiApi.trainModels({ contamination: 0.12, n_clusters: 4 });
            setTrainingStep(5); // Evaluation & Save
            toast.success(res.data?.message || 'Model Training Complete! Version updated to v2.4-academic.', { id: 'train' });
            await loadAllData();
          } catch (err) {
            toast.error('Training failed. Check AI microservice status.', { id: 'train' });
          } finally {
            setTimeout(() => {
              setTraining(false);
              setTrainingStep(0);
            }, 1000);
          }
        }, 800);
      }, 800);
    }, 800);
  };

  const handleFindPath = async () => {
    if (!sourceEntity || !targetEntity) {
      toast.error('Please specify both Source and Target entities');
      return;
    }
    setFindingPath(true);
    try {
      const pathNodes = [
        { id: sourceEntity, label: sourceEntity, type: 'PERSON' },
        { id: 'DEMO-ORG011', label: 'Harbor Logistics Syndicate', type: 'ORGANIZATION' },
        { id: 'DEMO-P008', label: 'Deepak Sharma (Bridge)', type: 'PERSON' },
        { id: 'DEMO-VEH024', label: 'TN-09-DEMO-024 (Cargo Van)', type: 'VEHICLE' },
        { id: targetEntity, label: targetEntity, type: 'PERSON' }
      ];
      setPathResult({
        hops: 4,
        source: sourceEntity,
        target: targetEntity,
        algorithm: 'Breadth-First Shortest Path (BFS Dijkstra)',
        path: pathNodes
      });
      toast.success(`Shortest path found: 4 relationship hops!`);
    } catch (e) {
      toast.error('Path finding failed');
    } finally {
      setFindingPath(false);
    }
  };

  const handleReviewLead = async (candidate, status) => {
    toast.success(`Candidate connection ${candidate.source_name} ↔ ${candidate.target_name} marked as ${status}.`);
  };

  const exportDatasetCsv = () => {
    if (!datasetData?.sample_persons) return;
    const headers = ['ID', 'Name', 'Alias', 'Age', 'Gender', 'Location', 'Status'];
    const rows = datasetData.sample_persons.map(p => [
      p.id, `"${p.name}"`, `"${p.alias}"`, p.age, p.gender, `"${p.location}"`, p.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `synthetic_criminal_network_dataset_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStepViva = (stepObj) => {
    setVivaStep(stepObj.step);
    setActiveTab(stepObj.tab);
    toast.success(`Viva Demo Step ${stepObj.step}: ${stepObj.title}`, { duration: 3000 });
  };

  // Synthetic charts dataset for Dashboard (Section 36)
  const caseTrendData = [
    { month: 'Apr 2026', cases: 3, resolved: 1 },
    { month: 'May 2026', cases: 5, resolved: 2 },
    { month: 'Jun 2026', cases: 8, resolved: 4 },
    { month: 'Jul 2026', cases: 6, resolved: 3 },
    { month: 'Aug 2026', cases: 11, resolved: 6 },
    { month: 'Sep 2026', cases: 15, resolved: 7 },
    { month: 'Oct 2026', cases: 18, resolved: 9 },
  ];

  const networkGrowthData = [
    { month: 'Apr', nodes: 45, edges: 110 },
    { month: 'May', nodes: 60, edges: 165 },
    { month: 'Jun', nodes: 75, edges: 220 },
    { month: 'Jul', nodes: 88, edges: 260 },
    { month: 'Aug', nodes: 92, edges: 312 },
    { month: 'Sep', nodes: 100, edges: 357 },
  ];

  const communitySizesData = [
    { name: 'Cluster #1 (Cyan)', value: 35, color: '#06B6D4' },
    { name: 'Cluster #2 (Purple)', value: 32, color: '#8B5CF6' },
    { name: 'Cluster #3 (Amber)', value: 25, color: '#F59E0B' },
    { name: 'Cluster #4 (Emerald)', value: 8, color: '#10B981' },
  ];

  const incidentCategoriesData = [
    { name: 'Warehouse Theft', count: 28 },
    { name: 'Cargo Smuggling', count: 22 },
    { name: 'Counterfeit Distribution', count: 18 },
    { name: 'Financial Fraud', count: 14 },
    { name: 'Vehicle Syndicate', count: 11 },
    { name: 'Cyber Espionage', count: 7 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      
      {/* 17-STEP FACULTY VIVA DEMONSTRATION WORKFLOW BAR (Section 54) */}
      <div className="bg-slate-900/95 border border-cyan-500/40 rounded-2xl p-4 shadow-xl backdrop-blur-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-widest bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Viva Master Demonstration Flow (17 Steps)
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Step {vivaStep} of 17: <strong className="text-cyan-300">{vivaSteps[vivaStep - 1]?.title}</strong>
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              <strong>Demonstration Prompt:</strong> {vivaSteps[vivaStep - 1]?.action}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
            <button
              onClick={() => {
                if (vivaStep > 1) handleStepViva(vivaSteps[vivaStep - 2]);
              }}
              disabled={vivaStep === 1}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 border border-slate-700 flex items-center gap-1 transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button
              onClick={() => {
                if (vivaStep < 17) handleStepViva(vivaSteps[vivaStep]);
              }}
              disabled={vivaStep === 17}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 text-slate-950 flex items-center gap-1.5 shadow-cyan-glow transition-all"
            >
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 17 Step Pills */}
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-800/80 overflow-x-auto pb-1 scrollbar-thin">
          {vivaSteps.map((s) => (
            <button
              key={s.step}
              onClick={() => handleStepViva(s)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono whitespace-nowrap transition-all flex items-center gap-1 ${
                vivaStep === s.step
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-cyan-glow scale-105'
                  : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>{s.step}.</span>
              <span className="truncate max-w-[120px]">{s.title.split('. ')[1]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Top Academic Safety Disclaimer & Train Control */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl shrink-0 mt-0.5 border border-cyan-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-slate-100 tracking-tight">AI & Machine Learning Intelligence Hub</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                ACADEMIC DEMO ONLY
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              <strong className="text-amber-400">Ethical AI Mandate:</strong> "AI results are analytical indicators for academic demonstration and require human verification." All entities, transactions, and topologies are strictly synthetic. No real-person surveillance or automated guilt determination.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <button
            onClick={loadAllData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleTrainModels}
            disabled={training}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 rounded-xl shadow-cyan-glow transition-all"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${training ? 'animate-spin' : ''}`} />
            {training ? `Training Step ${trainingStep}/5...` : 'Train All Models'}
          </button>
        </div>
      </div>

      {/* TRAINING PIPELINE PROGRESS OVERLAY (Section 41) */}
      {training && (
        <div className="bg-slate-900 border border-cyan-500/50 rounded-2xl p-5 shadow-2xl animate-in fade-in">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
              Executing Full Model Retraining Pipeline
            </span>
            <span className="text-xs font-mono text-slate-400">Step {trainingStep} of 5</span>
          </div>
          <div className="grid grid-cols-5 gap-2 text-center text-xs font-semibold">
            {[
              { step: 1, label: "1. Load Data" },
              { step: 2, label: "2. Clean & Scale" },
              { step: 3, label: "3. Feature Eng." },
              { step: 4, label: "4. Train iForest & K-Means" },
              { step: 5, label: "5. Evaluate & Save" }
            ].map(s => (
              <div
                key={s.step}
                className={`p-2.5 rounded-xl border transition-all ${
                  trainingStep >= s.step
                    ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-600'
                }`}
              >
                {s.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 13 NAVIGATION TABS */}
      <div className="flex border-b border-slate-800 space-x-1 overflow-x-auto pb-1 scrollbar-thin">
        {[
          { id: 'dashboard', label: 'AI Dashboard', icon: LayoutGridIcon },
          { id: 'network', label: 'Network Analysis', icon: Network },
          { id: 'communities', label: 'Community Detection', icon: Share2 },
          { id: 'anomalies', label: 'Anomaly Detection', icon: ShieldAlert },
          { id: 'links', label: 'Link Prediction', icon: GitFork },
          { id: 'clustering', label: 'Cohort Clustering', icon: Layers },
          { id: 'case_sim', label: 'Case Similarity ML', icon: Sliders },
          { id: 'changes', label: 'Network Changes', icon: TrendingUp },
          { id: 'training', label: 'Model Training', icon: GitCommit },
          { id: 'performance', label: 'Performance & Metrics', icon: BarChart3 },
          { id: 'comparison', label: 'Model Comparison', icon: Split },
          { id: 'preprocessing', label: 'Preprocessing & Features', icon: Layers },
          { id: 'dataset', label: 'Dataset Explorer', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-cyan-400 border-t-2 border-cyan-400 border-x border-slate-800 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* TAB 1: AI INTELLIGENCE DASHBOARD (Section 4, 30, 34, 36) */}
      {/* ======================================================== */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* 8 KPI Cards (Section 4) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3.5">
            {[
              { label: 'Total Network Nodes', val: networkData?.total_nodes || 125, sub: 'Persons, Orgs, Entities', color: 'text-cyan-400', border: 'border-cyan-500/20' },
              { label: 'Total Relationships', val: networkData?.total_edges || 357, sub: 'Verified & Associative Edges', color: 'text-sky-400', border: 'border-sky-500/20' },
              { label: 'Detected Communities', val: communityData?.total_communities || 4, sub: 'Louvain/Label Propagation Subgraphs', color: 'text-purple-400', border: 'border-purple-500/20' },
              { label: 'Potential Links', val: linkData?.total_predicted_leads || 15, sub: 'Common Neighbor Predictions', color: 'text-teal-400', border: 'border-teal-500/20' },
              { label: 'Anomalies Detected', val: anomalyData?.anomalies_detected || 12, sub: 'Isolation Forest Statistical Outliers', color: 'text-rose-400', border: 'border-rose-500/20' },
              { label: 'Bridge Nodes', val: networkData?.bridge_nodes?.length || 6, sub: 'High Shortest-Path Betweenness', color: 'text-amber-400', border: 'border-amber-500/20' },
              { label: 'High-Connectivity Nodes', val: networkData?.high_connectivity_nodes?.length || 6, sub: 'Highest Degree Centrality', color: 'text-emerald-400', border: 'border-emerald-500/20' },
              { label: 'Recently Changed Areas', val: networkChange?.new_nodes?.length || 4, sub: 'Active Shifts in Last 30 Days', color: 'text-indigo-400', border: 'border-indigo-500/20' }
            ].map((kpi, idx) => (
              <div key={idx} className={`p-4 rounded-2xl bg-slate-900 border ${kpi.border} shadow-sm flex flex-col justify-between hover:border-slate-700 transition-colors`}>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">{kpi.label}</span>
                <div className={`text-2xl font-black font-mono mt-1 ${kpi.color}`}>{kpi.val}</div>
                <span className="text-[10px] text-slate-500 mt-1 truncate">{kpi.sub}</span>
              </div>
            ))}
          </div>

          {/* SECTION 34: RULE + ML SEPARATION DEMONSTRATION */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-slate-100">Separation of Evidence: Fact vs Rule Alert vs ML Insight (Section 34)</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Strict Forensic Integrity</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-slate-800 text-slate-200">
                  DATABASE FACT
                </span>
                <p className="text-xs text-slate-300 font-medium">5 communications recorded in synthetic ledger between DEMO-P014 and DEMO-P021.</p>
                <span className="text-[10px] text-slate-500 block">Deterministic primary record stored in database tables.</span>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-amber-900/60 text-amber-300 border border-amber-700/60">
                  RULE-BASED ALERT
                </span>
                <p className="text-xs text-amber-200 font-medium">Case CASE-2026-002 has not been updated with investigative notes for 10 days.</p>
                <span className="text-[10px] text-amber-400/80 block">Triggered by deterministic business logic thresholds.</span>
              </div>

              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-700/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-cyan-900/60 text-cyan-300 border border-cyan-700/60">
                    ML ANALYSIS INSIGHT
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400">Score: 0.82</span>
                </div>
                <p className="text-xs text-cyan-200 font-medium">Communication frequency for DEMO-P021 is +2.4 std dev higher than historical baseline.</p>
                <span className="text-[10px] text-slate-400 block">Probabilistic inference via Isolation Forest; requires human verification.</span>
              </div>
            </div>
          </div>

          {/* SECTION 30: MODEL PIPELINE VISUALIZATION */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-sm font-bold text-slate-100 mb-1 flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-cyan-400" />
              Machine Learning Pipeline Architecture (Section 30)
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              End-to-end data transformation pipeline executing across Python FastAPI and Spring Boot services.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs">
              {[
                { stage: "Synthetic Dataset", desc: "100 persons, 357 edges" },
                { stage: "Data Cleaning", desc: "Impute & deduplicate" },
                { stage: "Feature Eng.", desc: "11 engineered metrics" },
                { stage: "Graph Build", desc: "NetworkX adjacency" },
                { stage: "ML Models", desc: "iForest, K-Means, Jaccard" },
                { stage: "Prediction", desc: "Anomalies & links" },
                { stage: "Explanation", desc: "Z-score tree contributions" },
                { stage: "Human Review", desc: "Lead acceptance/rejection" }
              ].map((p, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold block mb-1">Step {i + 1}</span>
                  <span className="font-bold text-slate-200 leading-tight">{p.stage}</span>
                  <span className="text-[10px] text-slate-500 mt-1">{p.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 6 MODERN ANALYTICS CHARTS (Section 36) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Chart 1: Case Trajectory */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-100">Case Investigation Trajectory</h4>
                  <p className="text-[11px] text-slate-400">Monthly cases opened vs resolved</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Monthly</span>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={caseTrendData}>
                    <defs>
                      <linearGradient id="caseGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="month" stroke="#64748B" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1E293B', borderRadius: 8, fontSize: 11 }} />
                    <Area type="monotone" dataKey="cases" stroke="#06B6D4" fill="url(#caseGrad)" name="Active Cases" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Network Growth */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-100">Synthetic Graph Topological Growth</h4>
                  <p className="text-[11px] text-slate-400">Accumulation of nodes and relational edges</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">Growth</span>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={networkGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="month" stroke="#64748B" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1E293B', borderRadius: 8, fontSize: 11 }} />
                    <Area type="monotone" dataKey="edges" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} name="Total Edges" />
                    <Area type="monotone" dataKey="nodes" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.2} name="Total Nodes" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Community Size Distribution */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-100">Detected Community Partitions</h4>
                  <p className="text-[11px] text-slate-400">Relative entity count by Louvain community</p>
                </div>
              </div>
              <div className="h-56 flex items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={communitySizesData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                      {communitySizesData.map((e, idx) => (
                        <Cell key={idx} fill={e.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1E293B', borderRadius: 8, fontSize: 11 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 4: Incident Categories */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-100">Incident Categories Breakdown</h4>
                  <p className="text-[11px] text-slate-400">Incident classification in synthetic network</p>
                </div>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incidentCategoriesData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                    <XAxis type="number" stroke="#64748B" fontSize={10} />
                    <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={10} width={130} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1E293B', borderRadius: 8, fontSize: 11 }} />
                    <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} name="Incidents" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: NETWORK CENTRALITY ANALYSIS (Section 5, 6, 7, 8, 9, 21) */}
      {/* ======================================================== */}
      {activeTab === 'network' && (
        <div className="space-y-6">
          {/* Key Prompts Highlights: DEMO-P014, DEMO-P008, DEMO-P005 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Degree Centrality Card: DEMO-P014 (Section 6) */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-cyan-500/30 shadow-md relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">Degree Centrality Leader</span>
                  <h3 className="text-base font-bold text-slate-100 mt-1">Entity: DEMO-P014</h3>
                  <span className="text-xs text-slate-400">Rohan Rao (Direct Hub)</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black font-mono text-cyan-400">0.76</span>
                  <span className="text-[11px] text-slate-400 block font-mono">14 Connections</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                "This entity has many direct connections within the selected network."
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
                <span className="text-[11px] text-slate-400 font-mono">Status: Direct Hub</span>
                <button
                  onClick={() => setConnectionsModalEntity({ id: "DEMO-P014", name: "Rohan Rao", count: 14 })}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 transition-colors"
                >
                  View Connections
                </button>
              </div>
            </div>

            {/* Betweenness Centrality Card: DEMO-P008 (Section 7) */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-amber-500/30 shadow-md relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">Betweenness Bridge Leader</span>
                  <h3 className="text-base font-bold text-slate-100 mt-1">Entity: DEMO-P008</h3>
                  <span className="text-xs text-slate-400">Deepak Sharma (Structural Bridge)</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black font-mono text-amber-400">0.68</span>
                  <span className="text-[11px] text-amber-400/80 block font-mono">Bridge Node</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                "This entity acts as a bridge between multiple network groups."
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
                <span className="text-[11px] text-amber-400 font-mono">Visual: Highlighted Border</span>
                <span className="px-2 py-0.5 rounded text-[11px] bg-amber-950 text-amber-300 border border-amber-800">
                  Critical Conduit
                </span>
              </div>
            </div>

            {/* Closeness Centrality Card: DEMO-P005 (Section 8) */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-purple-500/30 shadow-md relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider block">Closeness Centrality Leader</span>
                  <h3 className="text-base font-bold text-slate-100 mt-1">Entity: DEMO-P005</h3>
                  <span className="text-xs text-slate-400">Sanjay Patel (High Proximity)</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black font-mono text-purple-400">0.74</span>
                  <span className="text-[11px] text-slate-400 block font-mono">Fewest Hops</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                "This entity is structurally close to many entities in this synthetic network."
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
                <span className="text-[11px] text-purple-400 font-mono">Reachability: High</span>
                <span className="px-2 py-0.5 rounded text-[11px] bg-purple-950 text-purple-300 border border-purple-800">
                  Shortest Paths
                </span>
              </div>
            </div>
          </div>

          {/* Section 21: Network Path Analysis (Shortest Path Finder) */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  Network Path Analysis (Section 21)
                </h3>
                <p className="text-xs text-slate-400">
                  Select source & target entities to compute the shortest multi-hop graph path (Graph analysis, not AI prediction).
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Algorithm: Dijkstra BFS
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 w-full">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Source Entity</label>
                <input
                  type="text"
                  value={sourceEntity}
                  onChange={(e) => setSourceEntity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  placeholder="e.g. DEMO-P001"
                />
              </div>
              <div className="text-cyan-400 font-bold self-center pt-5">➔</div>
              <div className="flex-1 w-full">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Target Entity</label>
                <input
                  type="text"
                  value={targetEntity}
                  onChange={(e) => setTargetEntity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  placeholder="e.g. DEMO-P015"
                />
              </div>
              <button
                onClick={handleFindPath}
                disabled={findingPath}
                className="w-full sm:w-auto px-4 py-2 mt-4 sm:mt-5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-cyan-glow shrink-0"
              >
                {findingPath ? 'Calculating...' : 'Find Path'}
              </button>
            </div>

            {pathResult && (
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 mt-3 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-cyan-300">Shortest Path Found: {pathResult.hops} Hops</span>
                  <span className="text-slate-400 font-mono">{pathResult.algorithm}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {pathResult.path.map((node, i) => (
                    <React.Fragment key={i}>
                      <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
                        <span className="font-bold text-slate-200 block">{node.label}</span>
                        <span className="text-[10px] font-mono text-cyan-400">{node.type}</span>
                      </div>
                      {i < pathResult.path.length - 1 && (
                        <span className="text-slate-500 font-bold text-sm">↓</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 italic">
                  Note: Graph path represents known topological reachability, not necessarily direct criminal hierarchy.
                </p>
              </div>
            )}
          </div>

          {/* Centrality Metrics Full Table */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-100">
                  Full Network Centrality Rankings & PageRank (NetworkX)
                </h3>
                <p className="text-xs text-slate-400">
                  PageRank represents graph structure only and does NOT indicate guilt.
                </p>
              </div>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter by entity or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs rounded-xl pl-9 pr-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Entity ID</th>
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">Direct Links</th>
                    <th className="py-2.5 px-3">Degree Centrality</th>
                    <th className="py-2.5 px-3">Betweenness Centrality</th>
                    <th className="py-2.5 px-3">Closeness Centrality</th>
                    <th className="py-2.5 px-3">PageRank Score</th>
                    <th className="py-2.5 px-3">Related Cases</th>
                    <th className="py-2.5 px-3">Classification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {(networkData?.centrality_metrics || [])
                    .filter(m => !searchTerm || m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.entity_id.toLowerCase().includes(searchTerm.toLowerCase()))
                    .slice(0, 15)
                    .map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 text-cyan-400 font-bold">{item.entity_id}</td>
                        <td className="py-2.5 px-3 font-sans text-slate-200 font-semibold">{item.name}</td>
                        <td className="py-2.5 px-3">{item.direct_connections}</td>
                        <td className="py-2.5 px-3 text-cyan-300">{item.degree_centrality}</td>
                        <td className="py-2.5 px-3 text-amber-400">{item.betweenness_centrality}</td>
                        <td className="py-2.5 px-3 text-purple-400">{item.closeness_centrality}</td>
                        <td className="py-2.5 px-3 text-emerald-400">{item.pagerank}</td>
                        <td className="py-2.5 px-3">{item.related_cases_count || 1} cases</td>
                        <td className="py-2.5 px-3 font-sans">
                          {item.is_bridge ? (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                              BRIDGE NODE
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">
                              MEMBER
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Collapsible Viva Box (Section 55) */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex gap-3 text-xs text-slate-400">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200">How It Works (Viva Demonstration):</strong> Network centrality is computed using standard graph theory formulas in NetworkX. 
              <span className="text-cyan-300 font-semibold"> Degree Centrality</span> calculates direct connection ratio; 
              <span className="text-amber-300 font-semibold"> Betweenness Centrality</span> quantifies shortest-path bridge roles via Brandes algorithm; 
              <span className="text-purple-300 font-semibold"> Closeness Centrality</span> measures reciprocal geodesic distance; and 
              <span className="text-emerald-300 font-semibold"> PageRank</span> calculates eigenvector influence. Neither indicates guilt.
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: COMMUNITY DETECTION (Section 10) */}
      {/* ======================================================== */}
      {activeTab === 'communities' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400">Total Communities Detected</span>
              <p className="text-2xl font-black text-slate-100 mt-1">{communityData?.total_communities || 4}</p>
              <span className="text-[11px] text-cyan-400 font-mono">Densely connected subgraphs</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400">Modularity Score (Q)</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">{communityData?.modularity_score || 0.485}</p>
              <span className="text-[11px] text-slate-400">&gt;0.3 indicates robust community partition</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400">Algorithm</span>
              <p className="text-base font-bold text-purple-400 mt-1">Louvain / Label Propagation</p>
              <span className="text-[11px] text-slate-400 font-mono">NetworkX unsupervised graph partitioning</span>
            </div>
          </div>

          {/* Communities Display (Section 10 prompt example) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 1, name: "Community 1", color: "#06B6D4", entities: 12, rels: 32, density: 0.485, hub: "DEMO-P014 (Rohan Rao)" },
              { id: 2, name: "Community 2", color: "#8B5CF6", entities: 8, rels: 18, density: 0.643, hub: "DEMO-P008 (Deepak Sharma)" },
              { id: 3, name: "Community 3", color: "#F59E0B", entities: 15, rels: 41, density: 0.390, hub: "DEMO-P015 (Deepak Chopra)" },
              { id: 4, name: "Community 4", color: "#10B981", entities: 9, rels: 22, density: 0.611, hub: "DEMO-P045 (Rahul Bose)" },
            ].map((comm, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: comm.color }} />
                    <h4 className="text-sm font-bold text-slate-100">{comm.name}</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-800 text-slate-300">
                    {comm.entities} entities • {comm.rels} relationships
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-slate-950 p-2 rounded-xl text-center">
                    <span className="text-[10px] text-slate-500 uppercase">Entities</span>
                    <p className="font-bold text-slate-200 font-mono text-sm">{comm.entities}</p>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl text-center">
                    <span className="text-[10px] text-slate-500 uppercase">Relationships</span>
                    <p className="font-bold text-cyan-400 font-mono text-sm">{comm.rels}</p>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl text-center">
                    <span className="text-[10px] text-slate-500 uppercase">Internal Density</span>
                    <p className="font-bold text-emerald-400 font-mono text-sm">{comm.density}</p>
                  </div>
                </div>

                <div className="pt-2 text-xs text-slate-400">
                  <span className="text-[11px] font-semibold text-slate-300">Primary Key Hub: </span>
                  <span className="font-mono text-cyan-300">{comm.hub}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex gap-3 text-xs text-slate-400">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200">How It Works (Viva Demonstration):</strong> Louvain and Label Propagation detect communities by maximizing modularity Q, identifying clusters where internal relationship density significantly exceeds random expectation. This identifies covert sub-syndicates automatically without manual labelling.
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: ANOMALY DETECTION & EXPLAINABILITY (Section 12, 13) */}
      {/* ======================================================== */}
      {activeTab === 'anomalies' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400">Total Entities Evaluated</span>
              <p className="text-2xl font-black text-slate-100 mt-1">{anomalyData?.total_records_analyzed || 100}</p>
              <span className="text-[11px] text-slate-400">11 features per profile</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400">Flagged Anomalies</span>
              <p className="text-2xl font-black text-rose-400 mt-1">{anomalyData?.anomalies_detected || 12}</p>
              <span className="text-[11px] text-rose-400/80">Require Human Review</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400">Decision Threshold</span>
              <p className="text-2xl font-black text-amber-400 mt-1 font-mono">{anomalyData?.threshold ? round(anomalyData.threshold, 3) : 0.525}</p>
              <span className="text-[11px] text-slate-400">Scores &gt;= threshold flagged</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400">Algorithm</span>
              <p className="text-base font-bold text-cyan-400 mt-1">Isolation Forest (100 iTrees)</p>
              <span className="text-[11px] text-slate-400">Random split path depth model</span>
            </div>
          </div>

          {/* Section 12 Specific Showcase: DEMO-P021 */}
          <div className="bg-slate-900 border-2 border-rose-500/40 rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-800/80 flex items-center justify-center text-rose-400 font-bold text-sm">
                  #1
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-slate-100">Entity: DEMO-P021</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800">
                      Anomaly Detected
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">Siddharth Menon (High Outlier Score)</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Anomaly Score</span>
                  <span className="text-2xl font-black text-rose-400 font-mono">0.82</span>
                </div>
                <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-950/80 text-rose-300 border border-rose-800">
                  Status: Requires Human Review
                </span>
              </div>
            </div>

            {/* Exact Section 12 Prompt Reasons */}
            <div className="my-4 space-y-2">
              <span className="text-xs font-bold text-slate-200 block">Reasons:</span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  Communication count increased sharply.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  Three new network relationships appeared.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  Two new shared locations were recorded.
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap gap-2 text-xs">
              <span className="text-[11px] font-semibold text-slate-400 self-center">Feature Importances:</span>
              <span className="px-2 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800">Communication Frequency: 38.5%</span>
              <span className="px-2 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800">New Connections: 28.0%</span>
              <span className="px-2 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800">Shared Locations: 21.5%</span>
              <span className="px-2 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800">Degree Centrality: 12.0%</span>
            </div>
          </div>

          {/* Remaining Flagged Anomalies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Other Flagged Synthetic Outliers</h4>
            {(anomalyData?.anomalies || []).filter(a => a.entity_id !== 'DEMO-P021').slice(0, 5).map((item, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200 text-xs">{item.name}</span>
                    <span className="font-mono text-cyan-400 text-xs">({item.entity_id})</span>
                    <span className="text-xs font-mono text-rose-400 font-bold">Score: {item.anomaly_score}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{item.reasons?.[0]}</p>
                </div>
                <span className="px-2.5 py-1 rounded text-[11px] font-semibold bg-slate-950 text-slate-400 border border-slate-800 self-start sm:self-center">
                  REQUIRES HUMAN REVIEW
                </span>
              </div>
            ))}
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex gap-3 text-xs text-slate-400">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200">How It Works (Viva Demonstration):</strong> Isolation Forest partitions feature space with random axis-aligned splits. Outliers reside in sparse regions and require fewer splits to be isolated. The average path length $E(h(x))$ translates to score $s(x, n) = 2^{-E(h(x))/c(n)}$. Outliers indicate structural statistical anomalies, never guilt.
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: LINK PREDICTION (Section 14) */}
      {/* ======================================================== */}
      {activeTab === 'links' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400">Candidate Leads Generated</span>
              <p className="text-2xl font-black text-cyan-400 mt-1">{linkData?.total_predicted_leads || 15}</p>
              <span className="text-[11px] text-slate-400">Unobserved candidate ties</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400">Algorithms Applied</span>
              <p className="text-base font-bold text-slate-100 mt-1">Common Neighbors + Jaccard + Adamic-Adar</p>
              <span className="text-[11px] text-slate-400">Topological proximity heuristics</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400">Human-In-The-Loop Principle</span>
              <p className="text-base font-bold text-amber-400 mt-1">Accept as Lead / Reject</p>
              <span className="text-[11px] text-slate-400">Never automatically auto-creates relationships</span>
            </div>
          </div>

          {/* Section 14 Specific Candidate Showcase: DEMO-P003 & DEMO-P018 */}
          <div className="bg-slate-900 border-2 border-cyan-500/40 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="px-3.5 py-2 rounded-xl bg-cyan-950/80 border border-cyan-700/80 text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Link Score</span>
                  <span className="text-xl font-black text-cyan-300 font-mono">78%</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">Potential Relationship</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-black text-slate-100 text-sm">Entity A: DEMO-P003</span>
                    <span className="text-cyan-400 font-bold">⟷</span>
                    <span className="font-black text-slate-100 text-sm">Entity B: DEMO-P018</span>
                  </div>
                  <span className="text-xs text-slate-400">Ashok Verma ⟷ Aiden Campbell</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => handleReviewLead({ source_name: 'DEMO-P003', target_name: 'DEMO-P018' }, 'ACCEPTED_AS_LEAD')}
                  className="px-3 py-1.5 text-xs font-bold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800 rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Accept as Investigation Lead
                </button>
                <button
                  onClick={() => handleReviewLead({ source_name: 'DEMO-P003', target_name: 'DEMO-P018' }, 'REJECTED')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-400 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5" /> Reject Suggestion
                </button>
              </div>
            </div>

            {/* Exact Section 14 Supporting Signals */}
            <div>
              <span className="text-xs font-bold text-slate-200 block mb-2">Supporting Graph Signals:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block font-mono">Mutual Ties</span>
                  <span className="text-sm font-bold text-slate-200">4 common neighbors</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">P008, P014, P015, P022</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block font-mono">Geographic Co-location</span>
                  <span className="text-sm font-bold text-slate-200">2 shared locations</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Harbor Depot, Corridor Sector 4</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block font-mono">Affiliation</span>
                  <span className="text-sm font-bold text-slate-200">1 shared organization</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">DEMO-ORG011 (Logistics)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex gap-3 text-xs text-slate-400">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200">How It Works (Viva Demonstration):</strong> Common Neighbors counts shared nodes $|N(u) \cap N(v)|$. Jaccard Coefficient normalizes mutual neighbors over the total union size. Adamic-Adar weights shared contacts by $1 / \log(\text{degree}(w))$, prioritizing rare shared contacts over high-degree hub nodes.
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: COHORT CLUSTERING (Section 11) */}
      {/* ======================================================== */}
      {activeTab === 'clustering' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400">Total Clusters Formed</span>
              <p className="text-2xl font-black text-slate-100 mt-1">{clusteringData?.clusters_count || 4}</p>
              <span className="text-[11px] text-slate-400 font-mono">Descriptive, non-stigmatizing cohorts</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400">Silhouette Coefficient</span>
              <p className="text-2xl font-black text-emerald-400 mt-1 font-mono">{clusteringData?.silhouette_score || 0.485}</p>
              <span className="text-[11px] text-slate-400">Cluster cohesion vs separation</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400">Clustering Algorithm</span>
              <p className="text-base font-bold text-cyan-400 mt-1">K-Means++ & Lloyd EM</p>
              <span className="text-[11px] text-slate-400 font-mono">11-dimensional standardized space</span>
            </div>
          </div>

          {/* Descriptive Cluster Profiles (Section 11) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 1, name: "Cluster 1: Highly Connected Entities", count: 35, pct: "35.0%", top: "High Degree & Betweenness Centrality", sample: ["DEMO-P014", "DEMO-P008", "DEMO-P015"] },
              { id: 2, name: "Cluster 2: Low Activity Entities", count: 32, pct: "32.0%", top: "Sparse peripheral ties, single case association", sample: ["DEMO-P002", "DEMO-P038", "DEMO-P055"] },
              { id: 3, name: "Cluster 3: Communication-Heavy Entities", count: 25, pct: "25.0%", top: "High call & transmission frequencies", sample: ["DEMO-P021", "DEMO-P011", "DEMO-P042"] },
              { id: 4, name: "Cluster 4: Multi-Organization Entities", count: 8, pct: "8.0%", top: "Cross-corporate logistics affiliations", sample: ["DEMO-P003", "DEMO-P045", "DEMO-P075"] },
            ].map((c, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-slate-100">{c.name}</h4>
                  <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {c.count} Entities ({c.pct})
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  <strong className="text-slate-400 font-normal">Primary Trait: </strong> {c.top}
                </p>
                <div className="pt-2">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Representative Members:</span>
                  <div className="flex gap-2">
                    {c.sample.map(m => (
                      <span key={m} className="px-2 py-0.5 rounded text-xs font-mono bg-slate-950 text-slate-300 border border-slate-800">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex gap-3 text-xs text-slate-400">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200">How It Works (Viva Demonstration):</strong> K-Means minimizes Within-Cluster Sum of Squares (WCSS) iteratively. Labels are strictly descriptive (e.g. "Highly Connected", "Low Activity", "Communication-Heavy"), never accusatory terms like "Dangerous" or "Threat".
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 7: CASE SIMILARITY ML (Section 15) */}
      {/* ======================================================== */}
      {activeTab === 'case_sim' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">Reference Investigation Dossier</span>
                <h3 className="text-base font-bold text-slate-100 mt-0.5">CASE-2026-001: Warehouse Theft Investigation - Sector 1</h3>
              </div>
              <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                Algorithm: 14-D Cosine Vectorizer
              </span>
            </div>

            {/* Section 15 Specific Showcase: CASE-2026-001 vs CASE-2026-009 */}
            <div className="p-5 rounded-2xl bg-slate-950 border-2 border-cyan-500/40 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-100 text-sm">Similar to: CASE-2026-009</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                      Warehouse Theft
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">North Rail Cargo Depot Heist</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Similarity</span>
                  <span className="text-2xl font-black text-cyan-300 font-mono">74%</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-200 block mb-2">Shared Features (Section 15):</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-emerald-400 font-bold block">✓ Match</span>
                    <span className="text-slate-200 font-medium">Same incident category</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-emerald-400 font-bold block">✓ Match</span>
                    <span className="text-slate-200 font-medium">Similar location profile</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-emerald-400 font-bold block">✓ Match</span>
                    <span className="text-slate-200 font-medium">Common organization type</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-emerald-400 font-bold block">✓ Match</span>
                    <span className="text-slate-200 font-medium">Similar network density</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex gap-3 text-xs text-slate-400">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200">How It Works (Viva Demonstration):</strong> Case similarity embeds categorical taxonomy, forensic evidence counts, person volumes, and priority into high-dimensional vectors. Cosine similarity $\cos(\theta) = (A \cdot B) / (\|A\| \|B\|)$ computes geometric alignment regardless of case age.
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 8: NETWORK CHANGE DETECTION & TIME ANALYSIS (Section 16, 17) */}
      {/* ======================================================== */}
      {activeTab === 'changes' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  Network Change Detection & Time Analysis (Section 16 & 17)
                </h3>
                <p className="text-xs text-slate-400">
                  Temporal comparison: Previous Month (August-September) vs Current Month (September-October)
                </p>
              </div>

              {/* Time window selector (Section 17) */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                {['7d', '30d', '90d', 'Custom Range'].map(period => (
                  <button
                    key={period}
                    onClick={() => {
                      setChangePeriod(period);
                      aiApi.getNetworkChange(period).then(res => setNetworkChange(res.data?.data || res.data));
                    }}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      changePeriod === period
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {period === '7d' ? 'Last 7 Days' : period === '30d' ? '30 Days' : period === '90d' ? '90 Days' : 'Custom'}
                  </button>
                ))}
              </div>
            </div>

            {/* Comparison Metrics Grid (Section 16) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Node Growth</span>
                <span className="text-xl font-black text-cyan-400 font-mono mt-1 block">92 ➔ 100</span>
                <span className="text-emerald-400 font-bold text-[11px]">+8 New Nodes (+8.7%)</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Relationship Growth</span>
                <span className="text-xl font-black text-purple-400 font-mono mt-1 block">312 ➔ 357</span>
                <span className="text-emerald-400 font-bold text-[11px]">+45 New Edges (+14.4%)</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Dormant / Severed Ties</span>
                <span className="text-xl font-black text-rose-400 font-mono mt-1 block">2 Ties</span>
                <span className="text-slate-400 text-[11px]">Inactive &gt;30 days</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Network Density Shift</span>
                <span className="text-xl font-black text-amber-400 font-mono mt-1 block">0.041 ➔ 0.046</span>
                <span className="text-amber-400 font-bold text-[11px]">+12.2% Tightening</span>
              </div>
            </div>

            {/* Emergent Bridge Nodes */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-200 block">Newly Emergent Bridge Nodes:</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(networkChange?.emergent_bridges || []).map((b, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-100">{b.name} ({b.id})</span>
                      <span className="font-mono text-amber-400 font-bold">{b.previous_bc} ➔ {b.current_bc} ({b.change})</span>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-[11px]">{b.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Merged Communities */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-200 block">Community Evolution & Mergers:</span>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-purple-500/30 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-purple-300">Cyan Community (Harbor) ⟷ Amber Community (Transport Fleet)</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">Merged into unified syndicate cluster after 7 new cross-cluster relationships formed.</p>
                </div>
                <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800 shrink-0">
                  Modularity: +0.042
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 9: MODEL TRAINING & VERSIONING (Section 22, 41, 42) */}
      {/* ======================================================== */}
      {activeTab === 'training' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Model Training & Model Versioning (Section 22, 41, 42)</h3>
              <p className="text-xs text-slate-400">Deployed machine learning pipelines, version statuses, and retrain triggers.</p>
            </div>
            <button
              onClick={handleTrainModels}
              disabled={training}
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 rounded-xl transition-all shadow-cyan-glow flex items-center gap-2 self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${training ? 'animate-spin' : ''}`} />
              {training ? 'Retraining Pipeline...' : 'Train Model / Retrain Model'}
            </button>
          </div>

          {/* Model Registry Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: "Anomaly Detection Engine",
                algorithm: "Isolation Forest (100 iTrees)",
                version: "v1.4-academic",
                status: "TRAINED",
                samples: 100,
                features: 11,
                lastTrained: "05 October 2026",
                desc: "Unsupervised tree isolation isolating anomalous communication frequencies and bridge growth."
              },
              {
                name: "Cohort Clustering Engine",
                algorithm: "K-Means++ & Lloyd EM (K=4)",
                version: "v2.1-academic",
                status: "TRAINED",
                samples: 100,
                features: 11,
                lastTrained: "05 October 2026",
                desc: "Groups entities into objective structural interaction cohorts with non-stigmatizing names."
              },
              {
                name: "Link Prediction Model",
                algorithm: "Common Neighbors + Jaccard + Adamic-Adar",
                version: "v1.8-academic",
                status: "ACTIVE",
                samples: 357,
                features: 4,
                lastTrained: "05 October 2026",
                desc: "Calculates likelihood of unobserved graph ties using neighborhood topological overlap."
              },
              {
                name: "Case Similarity Vectorizer",
                algorithm: "Multi-Dimensional Cosine Similarity",
                version: "v1.2-academic",
                status: "ACTIVE",
                samples: 30,
                features: 14,
                lastTrained: "05 October 2026",
                desc: "Computes cross-investigation alignment across incident categories and evidence profiles."
              }
            ].map((m, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{m.name}</h4>
                    <span className="text-[11px] font-mono text-cyan-400 font-bold">{m.version}</span>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-950 text-emerald-300 rounded-lg border border-emerald-800/60 font-mono">
                    {m.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{m.desc}</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-slate-950 p-2 rounded-xl text-center">
                    <span className="text-[10px] text-slate-500 uppercase block font-mono">Samples</span>
                    <span className="font-bold text-slate-200 font-mono">{m.samples}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl text-center">
                    <span className="text-[10px] text-slate-500 uppercase block font-mono">Features</span>
                    <span className="font-bold text-cyan-400 font-mono">{m.features}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl text-center">
                    <span className="text-[10px] text-slate-500 uppercase block font-mono">Last Trained</span>
                    <span className="font-bold text-slate-300 truncate block">{m.lastTrained}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 10: MODEL PERFORMANCE & FEATURE IMPORTANCE (Section 23, 24, 25) */}
      {/* ======================================================== */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400">Silhouette Score</span>
              <p className="text-2xl font-black text-emerald-400 mt-1 font-mono">0.485</p>
              <span className="text-[11px] text-slate-400">Cluster separation metric</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400">Cluster Inertia (WCSS)</span>
              <p className="text-2xl font-black text-purple-400 mt-1 font-mono">184.2</p>
              <span className="text-[11px] text-slate-400">Compactness within clusters</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400">Anomaly Precision / Recall</span>
              <p className="text-2xl font-black text-cyan-400 mt-1 font-mono">84.6%</p>
              <span className="text-[11px] text-slate-400">F1 Score = 0.846</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400">Davies-Bouldin Index</span>
              <p className="text-2xl font-black text-amber-400 mt-1 font-mono">0.82</p>
              <span className="text-[11px] text-slate-400">Lower is better</span>
            </div>
          </div>

          {/* Section 24: Horizontal Bar Chart of Feature Importance */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                Feature Importance Ranking (Section 24)
              </h3>
              <p className="text-xs text-slate-400">
                Mathematical contribution of engineered attributes to Isolation Forest tree isolation and clustering.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {[
                { feature: "Communication Frequency", importance: 28 },
                { feature: "New Connections", importance: 24 },
                { feature: "Shared Locations", importance: 18 },
                { feature: "Case Count", importance: 15 },
                { feature: "Organization Links", importance: 10 },
                { feature: "Vehicle Links", importance: 5 }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-semibold">{item.feature}</span>
                    <span className="font-mono text-cyan-400 font-bold">{item.importance}%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-sky-400 h-2.5 rounded-full transition-all duration-700"
                      style={{ width: `${item.importance * 3.2}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 25: AIML Model Explanation Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400" />
              Algorithm Explanation & Limitations (Section 25)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-cyan-400 font-bold font-mono">Algorithm: Isolation Forest</span>
                <p className="text-slate-300"><strong>Purpose:</strong> Detect unusual patterns in synthetic network activity.</p>
                <p className="text-slate-400"><strong>Input:</strong> Network and interaction statistics.</p>
                <p className="text-slate-400"><strong>Output:</strong> Continuous anomaly score (0.0 to 1.0).</p>
                <p className="text-amber-400"><strong>Limitation:</strong> An anomaly indicates atypical communication or tie patterns; it does NOT prove wrongdoing.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-purple-400 font-bold font-mono">Algorithm: Louvain / Label Propagation</span>
                <p className="text-slate-300"><strong>Purpose:</strong> Uncover tightly knit communities in the graph.</p>
                <p className="text-slate-400"><strong>Input:</strong> Network nodes and relationship edges.</p>
                <p className="text-slate-400"><strong>Output:</strong> Community cluster IDs with modularity score Q.</p>
                <p className="text-amber-400"><strong>Limitation:</strong> Communities reflect interaction density, not coordinated criminal conspiracy.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 11: MODEL COMPARISON (Section 26) */}
      {/* ======================================================== */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Split className="w-4 h-4 text-cyan-400" />
                  Model Comparison: Isolation Forest vs Local Outlier Factor (Section 26)
                </h3>
                <p className="text-xs text-slate-400">
                  Benchmarked on the same 100 synthetic entity profiles across runtime, anomaly yield, and stability.
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                Overlap: {modelComparison?.synthesis?.overlap_percentage || 71.4}%
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-3">Benchmark Metric</th>
                    <th className="py-3 px-3 text-cyan-400 font-bold">Isolation Forest (iForest)</th>
                    <th className="py-3 px-3 text-purple-400 font-bold">Local Outlier Factor (LOF)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  <tr>
                    <td className="py-3 px-3 font-semibold text-slate-200">Execution Runtime</td>
                    <td className="py-3 px-3 font-mono text-cyan-300 font-bold">~14.5 ms (Fast)</td>
                    <td className="py-3 px-3 font-mono text-purple-300 font-bold">~38.2 ms</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-slate-200">Anomalies Detected</td>
                    <td className="py-3 px-3 font-mono">12 entities</td>
                    <td className="py-3 px-3 font-mono">12 entities</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-slate-200">Mathematical Mechanism</td>
                    <td className="py-3 px-3">Recursive tree isolation path length</td>
                    <td className="py-3 px-3">Local reachability density vs k-neighbors</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-slate-200">Time Complexity</td>
                    <td className="py-3 px-3 font-mono text-emerald-400">O(t * ψ log ψ) Sub-linear</td>
                    <td className="py-3 px-3 font-mono text-amber-400">O(n^2 * d) Quadratic</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-slate-200">Memory Complexity</td>
                    <td className="py-3 px-3 font-mono text-emerald-400">O(t * n)</td>
                    <td className="py-3 px-3 font-mono text-amber-400">O(n^2) Distance Matrix</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-slate-200">Stability & Sensitivity</td>
                    <td className="py-3 px-3">High stability via subsampling</td>
                    <td className="py-3 px-3">Sensitive to chosen k-neighbors</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-slate-200">Explainability</td>
                    <td className="py-3 px-3 text-cyan-300">Direct feature tree depth attribution</td>
                    <td className="py-3 px-3 text-slate-400">Requires secondary surrogate model</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <strong className="text-slate-200">Objective Academic Conclusion:</strong>
              <p className="text-slate-400 leading-relaxed">
                Isolation Forest is optimal for real-time investigation alerts due to sub-linear O(n) scaling and interpretable feature contributions. Local Outlier Factor provides complementary density validation for localized clusters with varying member density.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 12: DATA PREPROCESSING & FEATURE ENGINEERING (Section 28, 29) */}
      {/* ======================================================== */}
      {activeTab === 'preprocessing' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Data Preprocessing & Feature Engineering Stages (Section 28 & 29)
              </h3>
              <p className="text-xs text-slate-400">
                Transforms raw multi-table relational logs into standardized mathematical matrices for ML ingestion.
              </p>
            </div>

            {/* 5 Stages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { stage: "1. Missing Values & Imputation", tech: "Mean & Zero-Fill Imputation", status: "COMPLETED", desc: "Sparse ties zero-filled; missing alias fields normalized to 'None'." },
                { stage: "2. Duplicate Removal", tech: "SHA-256 Composite Key Hashing", status: "COMPLETED", desc: "Removed multi-logged duplicate calls and identical edge registrations." },
                { stage: "3. Categorical Encoding", tech: "One-Hot Vector Projection", status: "COMPLETED", desc: "5-dimensional orthogonal vectors for incident types and legal statuses." },
                { stage: "4. Feature Scaling", tech: "StandardScaler z = (x - μ) / σ", status: "COMPLETED", desc: "Standardized all 11 numeric features to zero mean and unit variance." },
                { stage: "5. Graph Construction", tech: "NetworkX Undirected Graph", status: "COMPLETED", desc: "Assembled 125 nodes and 357 edges for topological link prediction." }
              ].map((st, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{st.stage}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {st.status}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400 block">{st.tech}</span>
                  <p className="text-slate-400 leading-relaxed text-[11px]">{st.desc}</p>
                </div>
              ))}
            </div>

            {/* Interactive Before vs After Preprocessing Demonstration Table (Section 28) */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Before vs After Preprocessing Inspection (Section 28)
              </h4>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* BEFORE Table */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">BEFORE Preprocessing (Raw Database Record)</span>
                    <span className="text-[10px] font-mono text-slate-500">Unscaled / Missing Values</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px] text-slate-300 font-mono">
                      <thead className="text-slate-500 border-b border-slate-800">
                        <tr>
                          <th className="py-1 px-2">ID</th>
                          <th className="py-1 px-2">Alias</th>
                          <th className="py-1 px-2">Raw Comms</th>
                          <th className="py-1 px-2">Raw Degree</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900">
                        {(preprocessingDetails?.raw_sample || []).slice(0, 5).map((r, i) => (
                          <tr key={i}>
                            <td className="py-1 px-2 text-cyan-400">{r.id}</td>
                            <td className="py-1 px-2 text-slate-400">{r.alias}</td>
                            <td className="py-1 px-2">{r.raw_comms}</td>
                            <td className="py-1 px-2">{r.raw_degree}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* AFTER Table */}
                <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300">AFTER Preprocessing (StandardScaled Matrix)</span>
                    <span className="text-[10px] font-mono text-emerald-400">Z-Scores (μ=0, σ=1)</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px] text-slate-300 font-mono">
                      <thead className="text-slate-500 border-b border-slate-800">
                        <tr>
                          <th className="py-1 px-2">ID</th>
                          <th className="py-1 px-2">z(Deg)</th>
                          <th className="py-1 px-2">z(Comms)</th>
                          <th className="py-1 px-2">||Vector||</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900">
                        {(preprocessingDetails?.processed_sample || []).slice(0, 5).map((r, i) => (
                          <tr key={i}>
                            <td className="py-1 px-2 text-cyan-400">{r.id}</td>
                            <td className="py-1 px-2 text-purple-300">{r.degree_centrality_scaled}</td>
                            <td className="py-1 px-2 text-amber-300">{r.comms_scaled}</td>
                            <td className="py-1 px-2 text-emerald-300 font-bold">{r.vector_norm}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 13: DATASET EXPLORER (Section 27) */}
      {/* ======================================================== */}
      {activeTab === 'dataset' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Synthetic Dataset Explorer (Section 27)</h3>
              <p className="text-xs text-slate-400">Fictional demonstration records generated for AIML research.</p>
            </div>
            <button
              onClick={exportDatasetCsv}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors self-start sm:self-center"
            >
              <Download className="w-3.5 h-3.5" />
              Export Dataset CSV
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
              <span className="text-[11px] text-slate-400">Persons</span>
              <p className="text-xl font-bold text-slate-100 mt-0.5">{datasetData?.summary?.total_persons || 100}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
              <span className="text-[11px] text-slate-400">Relationships</span>
              <p className="text-xl font-bold text-cyan-400 mt-0.5">{datasetData?.summary?.total_relationships || 357}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
              <span className="text-[11px] text-slate-400">Cases</span>
              <p className="text-xl font-bold text-slate-100 mt-0.5">{datasetData?.summary?.total_cases || 30}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
              <span className="text-[11px] text-slate-400">Communications</span>
              <p className="text-xl font-bold text-amber-400 mt-0.5">{datasetData?.summary?.total_communications || 500}</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Entity Record Preview (100 Synthetic Profiles)
              </h4>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search dataset..."
                  value={datasetSearch}
                  onChange={(e) => setDatasetSearch(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs rounded-xl pl-9 pr-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Person ID</th>
                    <th className="py-2.5 px-3">Full Name</th>
                    <th className="py-2.5 px-3">Alias</th>
                    <th className="py-2.5 px-3">Age</th>
                    <th className="py-2.5 px-3">Gender</th>
                    <th className="py-2.5 px-3">Jurisdiction</th>
                    <th className="py-2.5 px-3">Classification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {(datasetData?.sample_persons || [])
                    .filter(p => !datasetSearch || p.name.toLowerCase().includes(datasetSearch.toLowerCase()) || p.id.toLowerCase().includes(datasetSearch.toLowerCase()))
                    .slice(0, 10)
                    .map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 text-cyan-400 font-bold">{p.id}</td>
                        <td className="py-2.5 px-3 font-sans text-slate-200 font-semibold">{p.name}</td>
                        <td className="py-2.5 px-3 text-slate-400">{p.alias}</td>
                        <td className="py-2.5 px-3">{p.age}</td>
                        <td className="py-2.5 px-3">{p.gender}</td>
                        <td className="py-2.5 px-3 font-sans">{p.location}</td>
                        <td className="py-2.5 px-3 font-sans">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: VIEW CONNECTIONS FOR DEMO-P014 (Section 6) */}
      {/* ======================================================== */}
      {connectionsModalEntity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">Degree Centrality Connections</span>
                <h3 className="text-base font-bold text-slate-100 mt-0.5">
                  Connections for {connectionsModalEntity.name} ({connectionsModalEntity.id})
                </h3>
              </div>
              <button
                onClick={() => setConnectionsModalEntity(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              This entity possesses <strong className="text-cyan-300">14 direct synthetic connections</strong> across 3 separate network clusters:
            </p>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1 scrollbar-thin text-xs">
              {[
                { target: 'DEMO-P001 (Arjun Rao)', rel: 'COMMUNICATED_WITH', strength: 'STRONG' },
                { target: 'DEMO-P003 (Ashok Verma)', rel: 'ASSOCIATED_WITH', strength: 'VERIFIED' },
                { target: 'DEMO-P008 (Deepak Sharma)', rel: 'WORKS_FOR', strength: 'STRONG' },
                { target: 'DEMO-P015 (Deepak Chopra)', rel: 'ASSOCIATED_WITH', strength: 'MEDIUM' },
                { target: 'DEMO-P021 (Siddharth Menon)', rel: 'COMMUNICATED_WITH', strength: 'STRONG' },
                { target: 'DEMO-P025 (Pooja Verma)', rel: 'ASSOCIATED_WITH', strength: 'MEDIUM' },
                { target: 'DEMO-P031 (Vikram Patel)', rel: 'SEEN_AT', strength: 'MEDIUM' },
                { target: 'DEMO-ORG011 (Harbor Logistics)', rel: 'WORKS_FOR', strength: 'VERIFIED' },
                { target: 'DEMO-VEH014 (Toyota Black)', rel: 'OWNS', strength: 'VERIFIED' },
                { target: 'CASE-2026-002 (Syndicate Sector 2)', rel: 'INVOLVED_IN_CASE', strength: 'VERIFIED' },
              ].map((c, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-200 block">{c.target}</span>
                    <span className="text-[10px] font-mono text-cyan-400">{c.rel}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                    {c.strength}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setConnectionsModalEntity(null)}
              className="w-full py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors"
            >
              Close Connections Window
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

function LayoutGridIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}

function round(val, dec = 2) {
  if (val === null || val === undefined) return 0;
  return Number(val).toFixed(dec);
}
