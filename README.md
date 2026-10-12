# 🚢 ClusterMind: AI-Powered Smart Port Digital Twin & Infrastructure Intelligence Platform

> **An AI-driven Decision Intelligence Platform that predicts infrastructure failures, explains AI decisions, automates self-healing actions, and visualizes smart port operations in real time.**

![Python](https://img.shields.io/badge/Python-3.11+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![React](https://img.shields.io/badge/React-Frontend-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6)
![LightGBM](https://img.shields.io/badge/LightGBM-ML-orange)
![SHAP](https://img.shields.io/badge/Explainable-AI-red)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

# 📌 Overview

Modern smart ports rely on distributed edge computing infrastructure to process operational data in real time. Unexpected failures in edge nodes can cause:

- Port congestion
- Cargo delays
- Increased operational cost
- Equipment downtime
- Financial loss

**ClusterMind** is an AI-powered platform that continuously monitors infrastructure health, predicts failures before they occur, explains every prediction using Explainable AI, recommends self-healing actions, and provides a Digital Twin for intelligent decision-making.

---

# ✨ Key Features

## 🤖 AI Failure Prediction

- Predicts node failures before they occur
- ML-powered infrastructure health analysis
- Failure probability estimation
- Risk classification

---

## 🔍 Explainable AI (SHAP)

- Explains every AI prediction
- Identifies the most influential features
- Improves transparency and trust

---

## ⚙️ Self-Healing Engine

- Automated recovery recommendations
- Workload migration suggestions
- Cooling recommendations
- Maintenance planning

---

## 🌍 Smart Port Digital Twin

Interactive visualization of:

- Ships
- Containers
- Cranes
- Yard Operations
- Infrastructure Status

---

## 📦 Cargo Tracking

- Track cargo information
- Shipment status
- Estimated arrival
- Route monitoring

---

## 📦 Container Lifecycle

Monitor container movement across:

- Arrival
- Inspection
- Storage
- Loading
- Departure

---

## 📈 Infrastructure Monitoring

Real-time monitoring of:

- CPU Usage
- GPU Usage
- RAM Usage
- Temperature
- Network Usage
- Power Consumption
- Fan Speed

---

## 🧠 AI Copilot Assistant

Natural language assistant capable of:

- Infrastructure analysis
- Operational insights
- Failure explanation
- AI recommendations

---

## 📊 Business Impact Dashboard

Business metrics including:

- Financial Loss Estimation
- Downtime Analysis
- Recovery Time
- ROI Estimation

---

## 🎯 Scenario Simulator

Simulate infrastructure failures before deployment.

Example scenarios:

- GPU Failure
- Network Failure
- High Temperature
- CPU Overload

---

# 🖥️ Dashboard Modules

- 📊 Dashboard
- ❤️ Cluster Health
- 📡 Infrastructure Monitoring
- 🤖 AI Predictions
- 🔍 Explainable AI (SHAP)
- ⚙️ Self-Healing Engine
- 🌍 Smart Port Digital Twin
- 📦 Cargo Tracking
- 📦 Container Lifecycle
- 🎯 Scenario Simulator
- 💬 AI Copilot Assistant
- 📈 Business Impact & ROI
- 📄 Reports & Audits
- 🚨 System Alerts
- ⚙️ Platform Settings

---

# 🏗️ System Architecture

```
                Telemetry Data
                       │
                       ▼
              Data Collection Layer
                       │
                       ▼
             Data Preprocessing Layer
                       │
                       ▼
        LightGBM Failure Prediction Model
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
       SHAP Explainability   Risk Score
             │                   │
             └─────────┬─────────┘
                       ▼
             Self-Healing Engine
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
     AI Copilot   Digital Twin   Dashboard
```

---

# 🛠️ Technology Stack

## Frontend

- React
- TypeScript
- Tailwind CSS
- Vite

## Backend

- FastAPI
- Python

## Machine Learning

- LightGBM
- Scikit-Learn
- Pandas
- NumPy
- SHAP

## AI

- Google Gemini API

---

# 📂 Project Structure

```
ClusterMind/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── ml_api/
│   ├── models/
│   ├── app.py
│   ├── requirements.txt
│   └── cargo_dataset.csv
│
├── README.md
└── LICENSE
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/nafis-ak/ClusterMind-Smart-Port.git
```

```bash
cd ClusterMind-Smart-Port
```

---

## Backend

```bash
cd ml_api

pip install -r requirements.txt

uvicorn app:app --reload
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 📊 Machine Learning Workflow

```
Telemetry Data

↓

Data Cleaning

↓

Feature Engineering

↓

Feature Scaling

↓

LightGBM Prediction

↓

Failure Probability

↓

SHAP Explainability

↓

Self-Healing Recommendation

↓

Dashboard Visualization
```

---

# 🎯 Use Cases

- Smart Ports
- Logistics
- Edge Computing
- AI Infrastructure Monitoring
- Industrial IoT
- Data Centers
- Container Terminals

---

# 📸 Screenshots

> Add project screenshots here.

Example:

```
docs/dashboard.png
docs/digital_twin.png
docs/shap.png
docs/prediction.png
```

---

# 📈 Future Improvements

- Kubernetes Integration
- IoT Sensor Integration
- Live Edge Devices
- Drone Monitoring
- Reinforcement Learning Scheduler
- Mobile Application
- Cloud Deployment

---

# 👨‍💻 Developer

**Md. Asif Khandoker**

Computer Science & Engineering

Daffodil International University

Bangladesh

GitHub:
https://github.com/nafis-ak

LinkedIn:
(Add your LinkedIn URL)

---

# 📜 License

This project is licensed under the MIT License.

---

# ⭐ Support

If you like this project, please consider giving it a ⭐ on GitHub!
