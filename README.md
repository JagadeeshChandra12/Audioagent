# AudioAgent: Multi-Tenant AI Voice Outbound Calling System

AudioAgent is a full-stack, multi-tenant web application that allows you to manage companies, upload sales protocols, import bulk CSV leads, and launch autonomous AI voice outbound campaigns using Vapi and Twilio. 

## 🏗️ Architecture
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui
- **Backend**: FastAPI (Python)
- **Database**: MongoDB (Containerized)
- **Voice Infrastructure**: Vapi.ai (11labs voices + OpenAI logic)

---

## 🚀 Getting Started

To run the full stack locally on your machine, you must run **three separate processes** at the same time in three different terminal windows.

### 1. Start the Backend & Database (Docker)
The backend is powered by FastAPI and requires a MongoDB instance. We have containerized the entire backend infrastructure using Docker Compose.

1. Open a terminal in the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create a `.env` file in the `backend/` directory (you can copy `.env.example`) and fill in your Vapi credentials:
   ```env
   VAPI_PRIVATE_KEY=your_vapi_private_key
   VAPI_PUBLIC_KEY=your_vapi_public_key
   VAPI_PHONE_NUMBER_ID=your_vapi_phone_id
   VAPI_SERVER_URL=your_localtunnel_url_here
   MONGO_URI=mongodb://mongo:27017/audioagent
   ```
3. Build and spin up the containers:
   ```bash
   docker-compose up --build
   ```
*The backend API will now be running on `http://localhost:8000`.*

---

### 2. Start the Vapi Webhook Tunnel (Localtunnel)
Vapi needs to send webhook events to your local backend whenever a call connects, finishes, or updates its transcript. Since Vapi is on the public internet, it cannot talk directly to your `localhost`.

We use `localtunnel` to safely expose your local port 8000 to the public internet without the strict anti-bot blocking screens that ngrok uses.

1. Open a **new, separate terminal** in the root directory.
2. Run the localtunnel command to expose port 8000 with a custom subdomain:
   ```bash
   npx localtunnel --port 8000 --subdomain navya
   ```
3. The terminal will print your permanent URL: `https://navya.loca.lt`.
4. **Important Step**: Copy this exact URL, go into your `backend/.env` file, and update `VAPI_SERVER_URL`:
   ```env
   VAPI_SERVER_URL=https://navya.loca.lt
   ```
   *(If you change this, you must restart your docker-compose containers for the new URL to take effect).*

---

### 3. Start the Frontend Application
The frontend is the visual dashboard built with React and Vite.

1. Open a **third terminal window** in the `audioagent/` directory:
   ```bash
   cd audioagent
   ```
2. Make sure you install the dependencies if you haven't already:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
*The web application is now live at `http://localhost:5173`. Open it in your browser!*

---

## 🛠️ Usage Guide

1. **Companies & Protocols**: Start by going to the Companies tab. Add your company, and upload your PDF/Document protocol. The AI will automatically extract your Key Selling Points.
2. **Campaign Center (CSV Bulk Import)**: Go to the Campaign Center. Click "Create Campaign", assign it to your company, and upload a simple `.csv` file with a `name` and `phone` column. This instantly bulk-creates all your leads.
3. **Launch Campaigns**: Click "Launch Campaign" to trigger the Voice Agents to dial your leads simultaneously.
4. **Live Transcripts & Outcomes**: As the AI speaks, view the transcripts in the Live Monitor. Once the call finishes, the webhook will automatically categorize the lead status as `QUALIFIED`, `NOT_INTERESTED`, `NEEDS_REVIEW`, or `FAILED` in both the Leads Management page and the Analytics pie chart.
