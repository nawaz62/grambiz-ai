# GRAMBIZ AI — GenAI Business & Financial Advisor for Rural Entrepreneurs

> **Tagline:** "Test Your Business Before You Invest."  
> **Secondary Tagline:** "From Business Idea to Business Reality."  
> **Problem Statement:** SIH 2026 Problem Statement **SIH26091**: *"GenAI Business/Financial Advisor for Rural Entrepreneurs"*

---

## 🌟 Executive Summary

**GRAMBIZ AI** is a complete, fully functional, demo-ready web application built for **Smart India Hackathon 2026**. It acts as an AI-powered business co-pilot for micro and small entrepreneurs in rural India.

Rather than being a simple chatbot, GRAMBIZ AI enables entrepreneurs to **digitally test and simulate a business before investing real money**. It integrates:
1. **GenAI Intent Extraction & Guidance**
2. **Deterministic Financial Math Engine in Python** (Revenue, EBITDA, Break-even, ROI, Cash Flows)
3. **What-If Sensitivity Sandbox** (Sales -20%, Cost +15%, Loan Added, etc.)
4. **Automated 5-Scenario Business Stress Tester** (Resilience Score 0–100)
5. **7-Axis Interactive Risk Radar**
6. **District Market Intelligence & Map**
7. **Curated Government Scheme Finder** (PMEGP, Mudra, NABARD, PMMSY)
8. **30-Day Business Action Plan & PDF Business Plan Generator**
9. **One-Click Demo Mode & Guided SIH Judge Demo Tour**

---

## 🏗️ System Architecture

```
                                 ┌──────────────────────────────────────────────┐
                                 │       React 18 + TypeScript + Vite           │
                                 │   Tailwind CSS + Recharts + Lucide Icons     │
                                 └──────────────────────┬───────────────────────┘
                                                        │ REST API Calls
                                                        ▼
                                 ┌──────────────────────────────────────────────┐
                                 │            FastAPI Backend Engine            │
                                 ├──────────────────────┬───────────────────────┤
                                 │   Financial Engine   │   Risk Scoring Model  │
                                 ├──────────────────────┼───────────────────────┤
                                 │  Stress Test Engine  │   What-If Simulator   │
                                 ├──────────────────────┼───────────────────────┤
                                 │  LLM Advisor Client  │ Rule Fallback Engine  │
                                 └──────────────────────┬───────────────────────┘
                                                        │
                                                        ▼
                                 ┌──────────────────────────────────────────────┐
                                 │         SQLite Database Engine (DB)          │
                                 └──────────────────────────────────────────────┘
```

---

## 🚀 Quick Setup & Installation

### Prerequisites
- **Python**: 3.10+
- **Node.js**: v18+ & npm

### 1. Run Backend Server
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --port 8000 --reload
```
*Backend runs on:* `http://127.0.0.1:8000`  
*API Documentation (Swagger UI):* `http://127.0.0.1:8000/docs`

### 2. Run Frontend Server
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on:* `http://localhost:3000`

### 3. One-Click Launcher (Windows)
Double-click `start.bat` in the root folder to launch both servers simultaneously!

---

## 🎯 3-Minute SIH Judge Demo Presentation Script

When presenting live to Smart India Hackathon judges:

1. **Click `[JUDGE DEMO (3-MIN TOUR)]`** in the top navigation bar.
2. **Step 1 (Profile)**: Show pre-loaded profile of **Rahul Kumar** from Lucknow, UP (₹1,00,000 capital, Farming experience).
3. **Step 2 & 3 (AI Matcher & Fit Score)**: Point out **Dairy Farming** matched with **91/100 Fit Score** based on weighted budget, skill, location, and demand metrics.
4. **Step 4 (Business Details)**: Highlight the explainability feature — **"Why Recommended"** vs **"Why Not"**.
5. **Step 5 (Financial Simulator)**: Move the **Capital** and **Sales Volume** sliders — show real-time Recharts financial updates.
6. **Step 6–8 (What-If Sandbox)**: Click **`[Sales -20%]`** — demonstrate instant side-by-side BEFORE vs AFTER diffs and AI risk commentary.
7. **Step 9 (Stress Tester)**: Show **"Can Your Business Survive?"** matrix running 5 automated shocks resulting in **74/100 Resilience Score**.
8. **Step 10 (Action Plan)**: Display the customized **30-Day Launch Roadmap**.
9. **Step 11 (PDF Export)**: Click **`[Download PDF Report]`** to show the formal bankable Business Plan.

---

## 🔒 Key Design Guarantees & Innovation
- **Financial Precision**: All math (ROI, payback period, net profit, break-even units/months, EMI, stress resilience) is executed in Python standard financial algorithms, **never** generated directly by the LLM.
- **Offline/Deterministic Fallback**: If no LLM API key is present, the system automatically falls back to an intelligent, rule-based recommendation engine without throwing any errors.
- **Curated Government Schemes**: Does NOT hallucinate government schemes. Uses verified datasets for PMEGP, MUDRA, NABARD, and PM-MSY with official portal links.
