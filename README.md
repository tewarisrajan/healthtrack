<div align="center">
  <h1>🧬 HealthTrack</h1>
  <p><strong>Your Health, Your Control. A modern, full-stack health monitoring platform empowering data sovereignty and secure interoperability.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js" alt="Node.js" />
    <img src="https://img.shields.io/badge/TypeScript-Enabled-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/AI-Google_GenAI-orange?style=for-the-badge&logo=google" alt="Google GenAI" />
  </p>
</div>

---

## 📖 Table of Contents
- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Core Workflows](#-core-workflows)
- [Future Roadmap](#-future-roadmap)
- [License](#-license)

---

## 🚀 About the Project

**HealthTrack** is designed to solve a critical issue in modern healthcare: **data fragmentation and patient privacy**. 

Our platform creates a centralized, highly secure environment where patients hold the keys to their medical history. Whether you are tracking daily vitals, storing sensitive lab reports, or granting a new doctor temporary access to your records, HealthTrack ensures that you remain in complete control.

---

## ✨ Key Features

### 🔐 Secure Role-Based Architecture
- **Patients**: Full sovereignty over health records, document uploads, and longitudinal vital tracking.
- **Doctors**: Search directory and a secure portal to request patient data access.
- **Providers (WIP)**: Administrative dashboards for hospital and clinic management.

### 🛡️ Privacy-First Consent System
- **Zero Default Access**: Doctors cannot view any patient data without explicit permission.
- **Consent Dashboard**: Patients review, approve, or deny access requests in real-time.
- **Immutable Audit Trails**: Every document access event is logged for complete transparency.

### 📂 Intelligent Medical Vault
- **Seamless Uploads**: Securely store prescriptions, X-rays, and lab reports.
- **Smart Categorization**: Automatically tags and organizes documents by type.
- **OCR Integration**: Extracts critical text and vitals from uploaded images using `tesseract.js`.

### 🚑 Emergency Profile (ICE)
- **Public Responder Link**: A securely generated, unauthenticated URL that provides first responders instant access to critical data like allergies, blood type, and emergency contacts.

---

## 🛠️ Technology Stack

We leverage a cutting-edge JavaScript/TypeScript ecosystem for high performance and rapid iteration.

| Domain | Technologies Used |
| :--- | :--- |
| **Frontend UI** | React 19, Vite, Tailwind CSS, Framer Motion |
| **State & Routing** | Jotai, React Router v7 |
| **Data Viz & Utils**| Recharts (Graphs), qrcode.react (Sharing) |
| **Backend API** | Node.js, Express.js (v5.2) |
| **Database** | NeDB (Embedded, persistent JSON store) |
| **Auth & Security**| JSON Web Tokens (JWT), Zod (Validation) |
| **AI & Processing** | `@google/genai`, `pdf-parse`, `tesseract.js` |

---

## ⚡ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/healthtrack.git
   cd healthtrack
   ```

2. **Install Backend Dependencies & Configure Env:**
   ```bash
   cd healthtrack-backend
   npm install
   ```
   *Create a `.env` file in `healthtrack-backend`:*
   ```env
   PORT=4000
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../healthtrack-frontend
   npm install
   ```

### Running the Application

Open two terminal windows/tabs:

**Terminal 1 (Backend Server):**
```bash
cd healthtrack-backend
npm run dev
# Server running at http://localhost:4000
```

**Terminal 2 (Frontend Client):**
```bash
cd healthtrack-frontend
npm run dev
# Client running at http://localhost:5173
```

---

## 🩺 Core Workflows

### The Doctor-Patient Consent Loop
1. **Request**: A Doctor logs in, searches for a patient, and clicks **"Request Access"**.
2. **Approval**: The Patient logs in, navigates to their **Consent Dashboard**, and clicks **"Approve"**.
3. **Access**: The Doctor refreshes their dashboard and can now view the patient's medical history and documents securely.

---

## 🔮 Future Roadmap

We are aggressively expanding HealthTrack's capabilities. Upcoming milestones include:

- **🧠 AI & Machine Learning**: 
  - NLP-powered AI Symptom Checker (Google GenAI) for intelligent triaging.
  - Automated extraction of dosages and vitals from parsed documents.
  - Predictive analytics for early health warnings.
- **📹 Telemedicine**: 
  - In-browser WebRTC secure video consultations.
  - Real-time WebSockets chat and automated scheduling.
- **⌚ Wearable Sync**: 
  - Native integrations with Apple Health, Google Fit, and Fitbit APIs.
- **🔐 Enterprise Infrastructure**: 
  - Migration to PostgreSQL/MongoDB.
  - Implementation of Blockchain-backed immutable audit logs and FHIR/HL7 interoperability.
  - Client-side End-to-End Encryption (E2EE) for sensitive documents.

---
<div align="center">
  <i>Built with ❤️ for a healthier future.</i>
</div>
