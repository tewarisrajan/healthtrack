# HealthTrack

**HealthTrack** is a modern, full-stack health monitoring platform designed to empower users with tracking vital health metrics, managing medical records, and ensuring secure communication with healthcare providers. Built with a focus on privacy, security, and user experience.

---

## 🚀 Key Features

### 🔐 Secure Role-Based Access
-   **Patients**: Manage personal health records, upload documents, and track vitals.
-   **Doctors**: Search for patients and request access to their medical history.
-   **Providers**: (Coming Soon) Manage health facilities and resources.

### 🛡️ Privacy-First Consent System
-   **Strict Access Control**: Doctors cannot view patient records without explicit permission.
-   **Request & Approve Flow**: Doctors send access requests; Patients must approve them via a dedicated Consent Dashboard.
-   **Audit Trails**: All record access is logged for transparency.

### 📂 Medical Record Vault
-   **Upload & Organize**: Store prescriptions, lab reports, and scans securely.
-   **Smart Categorization**: Automatically tag records by type (Prescription, Lab Report, etc.).

### 🚑 Emergency Profile
-   **Public Access Link**: A dedicated public URL for first responders to view critical info (Allergies, Blood Group) without login.
-   **Context-Aware**: Critical data available when it matters most.

---

## 🛠️ Technology Stack

### Frontend
-   **Framework**: [React 19](https://react.dev/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **State Management**: Jotai
-   **Animations**: Framer Motion
-   **Routing**: React Router v7

### Backend
-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: NeDB (Embedded, persistent JSON store)
-   **Authentication**: JSON Web Tokens (JWT)
-   **Validation**: Zod + Express Validator

---

## ⚡ Getting Started

### Prerequisites
-   Node.js (v18 or higher)
-   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/healthtrack.git
    cd healthtrack
    ```

2.  **Install Dependencies**
    ```bash
    # Install backend deps
    cd healthtrack-backend
    npm install

    # Install frontend deps
    cd ../healthtrack-frontend
    npm install
    ```

3.  **Environment Setup**
    -   Create a `.env` file in `healthtrack-backend` with:
        ```env
        PORT=4000
        JWT_SECRET=your_super_secret_key_here
        ```

### Running the App

1.  **Start the Backend**
    ```bash
    cd healthtrack-backend
    npm run dev
    # Server runs on http://localhost:4000
    ```

2.  **Start the Frontend**
    ```bash
    cd healthtrack-frontend
    npm run dev
    # Client runs on http://localhost:5173
    ```

---

## 🧪 Usage Guide

### Logging In
-   **Patient**: Use registered credentials.
-   **Doctor**: Log in with doctor credentials to access the Consultation Desk.

### Doctor-Patient Workflow
1.  **Doctor**: Go to Dashboard > Search Patient > Click "Request Access".
2.  **Patient**: Log in > Go to "Consent" page > Click "Approve".
3.  **Doctor**: Refresh Dashboard > Click "View Records" to access file history.

---

## 🔮 Future Roadmap
-   [ ] Migration to MongoDB for scalability.
-   [ ] Integration with wearable APIs (Fitbit, Apple Health).
-   [ ] Telemedicine video consultation integration.

---

**HealthTrack** — Your Health, Your Control.
