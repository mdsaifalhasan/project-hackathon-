import express from 'express';
import path from 'path';
import axios from "axios";
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  runInference,
  computeShapValues,
  generateSelfHealingActions,
  calculateBusinessImpact,
  BASELINE_TELEMETRY
} from './src/lib/mlEngine';
import {
  INITIAL_NODES,
  PORT_LOCATIONS,
  MOCK_CONTAINERS,
  SIMULATION_SCENARIOS,
  WHAT_IF_SCENARIOS,
  INITIAL_ALERTS
} from './src/lib/mockData';
import { TelemetryData, NodeInfo, AlertMessage } from './src/types';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  
  // In-memory state for nodes, alerts, and live metrics
  let nodes: NodeInfo[] = JSON.parse(JSON.stringify(INITIAL_NODES));
  let alerts: AlertMessage[] = JSON.parse(JSON.stringify(INITIAL_ALERTS));
  let globalTelemetry: TelemetryData = { ...nodes[1].telemetry }; // Default active focus Node-02 Beta

  // ==========================================
  // EXISTING APIs
  // ==========================================

  // API Route: AI Prediction (Real LightGBM Model)
  app.post('/api/predict', async (req, res) => {
    try {
      const telemetry: TelemetryData = req.body.telemetry || globalTelemetry;

      const response = await axios.post(
        'http://127.0.0.1:8000/predict',
        { data: telemetry }
      );

      res.json(response.data);
    } catch (err: any) {
      console.error("ML API Error:", err.message);
      res.status(500).json({ success: false, error: err.message || 'Prediction error' });
    }
  });

  // API Route: Self-Healing Recommendations
  app.post('/api/recommendation', (req, res) => {
    try {
      const telemetry: TelemetryData = req.body.telemetry || globalTelemetry;
      const prediction = runInference(telemetry);
      res.json({
        alertLevel: prediction.riskLevel,
        recommendations: prediction.recommendations,
        nodeHealth: prediction.nodeHealth
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Recommendation error' });
    }
  });

  // API Route: SHAP Explainability
  app.post('/api/shap', (req, res) => {
    try {
      const telemetry: TelemetryData = req.body.telemetry || globalTelemetry;
      const prediction = runInference(telemetry);
      res.json({
        baseline: prediction.shapBaseline,
        features: prediction.shapFeatures,
        riskScore: prediction.riskScore
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'SHAP error' });
    }
  });

  // API Route: Dashboard Overview KPI
  app.get('/api/dashboard', (req, res) => {
    const unhealthyNodes = nodes.filter(n => n.riskLevel !== 'HEALTHY');
    const prediction = runInference(globalTelemetry);
    const businessImpact = calculateBusinessImpact(prediction.riskScore, nodes.length);

    res.json({
      kpis: {
        clusterHealth: Math.round(nodes.reduce((acc, n) => acc + n.healthPercentage, 0) / nodes.length),
        predictedFailures: unhealthyNodes.length,
        runningServices: 34,
        gpuUtilization: globalTelemetry.gpu_usage,
        cpuUtilization: globalTelemetry.cpu_usage,
        portCongestionIndex: Math.round(72 + (prediction.riskScore / 100) * 22),
        delayedContainers: businessImpact.delayedContainersCount,
        financialLoss: businessImpact.estimatedFinancialLoss,
        systemStatus: unhealthyNodes.length > 0 ? 'ATTENTION_REQUIRED' : 'ALL_SYSTEMS_OPTIMAL'
      },
      recentAlerts: alerts.slice(0, 5),
      nodes,
      activeTelemetry: globalTelemetry
    });
  });

  // API Route: Nodes List
  app.get('/api/nodes', (req, res) => {
    res.json(nodes);
  });

  // API Route: Telemetry Stream Data
  app.get('/api/telemetry', (req, res) => {
    res.json({
      current: globalTelemetry,
      baseline: BASELINE_TELEMETRY
    });
  });

  // API Route: Business Impact Analysis
  app.get('/api/business-impact', (req, res) => {
    const prediction = runInference(globalTelemetry);
    const impact = calculateBusinessImpact(prediction.riskScore, nodes.length);
    res.json(impact);
  });

  // API Route: AI Copilot Chat (using Gemini API)
  app.post('/api/copilot', async (req, res) => {
    try {
      const { message } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      const prediction = runInference(globalTelemetry);

      const systemContext = `
You are CLUSTERMIND AI Copilot, an expert AI engineer and Smart Port infrastructure specialist.
Current Smart Port Telemetry & State:
- Node Health: ${prediction.nodeHealth}%
- Failure Risk Score: ${prediction.riskScore}% (${prediction.riskLevel})
- Top Unhealthy Node: Node-02 Beta (Temp: ${globalTelemetry.temperature}°C, GPU: ${globalTelemetry.gpu_usage}%, Fan: ${globalTelemetry.fan_speed} RPM)
- Port Congestion: Yard B capacity is at 92%.
- Financial Loss per hour: $${calculateBusinessImpact(prediction.riskScore).estimatedFinancialLoss}
- Active Self-Healing Recommendations: ${prediction.recommendations?.join(', ') || 'No recommendations'}

Respond concisely, accurately, and authoritatively as an enterprise Smart Port Digital Twin Copilot. Use bullet points where appropriate.
      `;

      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        let fallbackReply = `Analyzing port telemetry for "${message}"...\n\n`;

        if (message.toLowerCase().includes('yard b') || message.toLowerCase().includes('congested')) {
          fallbackReply += `**Yard B Congestion Analysis:**\n- Yard B is currently operating at **92% capacity** with 3,850 active containers.\n- Primary Root Cause: Node-02 Beta (Stacking Crane Cluster) is experiencing thermal throttling (**${globalTelemetry.temperature}°C**), causing an 18-minute stacking delay.\n- **Recommended Action**: Trigger workload rebalancing to route gantry jobs to Node-04 Delta.`;
        } else if (message.toLowerCase().includes('unhealthy') || message.toLowerCase().includes('node')) {
          fallbackReply += `**Cluster Node Status:**\n- **Node-02 Beta** (Yard B Stacking Crane) is **DEGRADED** (Health: **48%**).\n- **Key Metrics**: Junction Temp = ${globalTelemetry.temperature}°C, GPU Usage = ${globalTelemetry.gpu_usage}%, Fan Speed = ${globalTelemetry.fan_speed} RPM.\n- All other 7 nodes (Node-01, 03-08) are operating in HEALTHY status (>85% health).`;
        } else if (message.toLowerCase().includes('predict') || message.toLowerCase().includes('failure') || message.toLowerCase().includes('why')) {
          fallbackReply += `**AI Model Prediction Insight (LightGBM):**\n- **Predicted Status**: ${prediction.prediction}\n- **Confidence**: ${prediction.confidence}%\n- **SHAP Explanation**: ${prediction.shapFeatures[0]?.displayName} is contributing +${(Math.abs(prediction.shapFeatures[0]?.shapValue || 0) * 100).toFixed(1)}% to failure risk due to a ${globalTelemetry.temperature}°C thermal spike.`;
        } else {
          fallbackReply += `**Smart Port Assistant Response:**\n- Currently monitoring 8 edge compute clusters and 4 vessel berths.\n- Total Failure Risk Index: **${prediction.riskScore}%** (${prediction.riskLevel}).\n- Recommended immediate step: **${prediction.recommendations?.[0] || "System operating optimally"}**.`;
        }

        return res.json({ text: fallbackReply });
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemContext}\n\nUser Question: ${message}` }] }
        ]
      });

      res.json({ text: response.text || 'Copilot generated an empty response.' });
    } catch (err: any) {
      console.error('Copilot Error:', err);
      res.status(500).json({ error: err.message || 'Copilot AI error' });
    }
  });

  // API Route: What-if Analysis
  app.post('/api/what-if', (req, res) => {
    const { scenarioId } = req.body;
    const item = WHAT_IF_SCENARIOS.find(w => w.id === scenarioId) || WHAT_IF_SCENARIOS[0];
    res.json(item);
  });

  // API Route: Scenario Simulator
  app.post('/api/scenarios', (req, res) => {
    const { scenarioId } = req.body;
    const scenario = SIMULATION_SCENARIOS.find(s => s.id === scenarioId) || SIMULATION_SCENARIOS[0];

    globalTelemetry = {
      ...globalTelemetry,
      ...scenario.telemetryModifiers
    };

    nodes = nodes.map(node => {
      if (node.id === 'node-02') {
        const pred = runInference(globalTelemetry);
        return {
          ...node,
          telemetry: { ...globalTelemetry },
          healthPercentage: pred.nodeHealth,
          riskLevel: pred.riskLevel,
          status: pred.riskLevel === 'CRITICAL' ? 'DEGRADED' : node.status
        };
      }
      return node;
    });

    const prediction = runInference(globalTelemetry);

    res.json({
      scenario,
      prediction,
      businessImpact: calculateBusinessImpact(prediction.riskScore)
    });
  });

  // API Route: Random Cargo Data
  app.get('/api/cargo/random', async (req, res) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/cargo/random');
      res.json(response.data);
    } catch (err: any) {
      console.error("Cargo API Error:", err.message);
      res.status(500).json({ error: err.message || 'Cargo data error' });
    }
  });

  // ==========================================
  // 🆕 ADDITIONAL CHALLENGE: Protected Healing APIs
  // ==========================================

  app.post('/api/rank-services', async (req, res) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/rank-services', req.body);
      res.json(response.data);
    } catch (err: any) {
      console.error("Rank Services API Error:", err.message);
      res.status(500).json({ error: err.message || 'Ranking error' });
    }
  });

  app.post('/api/impact-analysis', async (req, res) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/impact-analysis', req.body);
      res.json(response.data);
    } catch (err: any) {
      console.error("Impact Analysis API Error:", err.message);
      res.status(500).json({ error: err.message || 'Impact analysis error' });
    }
  });

  app.post('/api/check-capacity', async (req, res) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/check-capacity', req.body);
      res.json(response.data);
    } catch (err: any) {
      console.error("Check Capacity API Error:", err.message);
      res.status(500).json({ error: err.message || 'Capacity check error' });
    }
  });

  app.post('/api/migration-plan', async (req, res) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/migration-plan', req.body);
      res.json(response.data);
    } catch (err: any) {
      console.error("Migration Plan API Error:", err.message);
      res.status(500).json({ error: err.message || 'Migration plan error' });
    }
  });

  app.post('/api/protected-healing', async (req, res) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/protected-healing', req.body);
      res.json(response.data);
    } catch (err: any) {
      console.error("Protected Healing API Error:", err.message);
      res.status(500).json({ error: err.message || 'Protected healing error' });
    }
  });

  // ==========================================
  // VITE MIDDLEWARE & SERVER STARTUP
  // ==========================================

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 CLUSTERMIND Smart Port Digital Twin running at http://0.0.0.0:${PORT}`);
    console.log(`🔗 FastAPI Backend expected at: http://127.0.0.1:8000`);
  });
}

startServer();