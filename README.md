# Aegis Intel — AI-Powered Criminal Network Analysis System

[![Academic Demo](https://img.shields.io/badge/System-Academic%20Demo-cyan.svg)](https://github.com)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203.3.4%20(Java%2021)-brightgreen.svg)](https://spring.io)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite%20%2B%20Tailwind-blue.svg)](https://reactjs.org)
[![Graph](https://img.shields.io/badge/Graph%20Engine-Cytoscape.js-purple.svg)](https://js.cytoscape.org)
[![Security](https://img.shields.io/badge/Security-JWT%20%2B%20BCrypt%20%2B%20RBAC-amber.svg)](https://spring.io/projects/spring-security)

---

## 1. Project Introduction

**Aegis Intel** is an academic and investigative intelligence analysis platform designed to demonstrate modern graph network analysis, centrality metrics, forensic chain of custody tracking, and AI-assisted relationship discovery.

It helps authorized investigators explore synthetic relationships connecting persons of interest, cases, incidents, locations, communications, vehicles, organizations, and evidence.

> ### Mandatory Ethical & Statutory Notice
> **"AI-generated analytical indicators are decision-support information only. They are not proof of criminal activity and require human verification."**
>
> **Strict Operational Guardrails:**
> - Strictly utilizes fictional, synthetic demo datasets.
> - **NO** real criminal records or private personal data.
> - **NO** facial recognition or biometric identification.
> - **NO** covert surveillance or device tracking.
> - **NO** automated guilt determinations or predictive policing decisions.
> - Graph centrality reflects structural connectivity, not criminal culpability.

---

## 2. Key Features

### 🔍 Executive Intelligence Dashboard
- **10 Real-time KPI Cards**: Active Cases, Persons of Interest, Open Investigations, High-Connectivity Entities, Evidence Records, Network Connections, Recent Incidents, AI Alerts, Cases Closed This Month, Average Case Resolution Time.
- **Hero Network Visualization**: Interactive mini-topology canvas showcasing real-time clustering.
- **Interactive Recharts**: Incident trends velocity, crime category breakdown, case priority distribution.

### 🌐 Criminal Network Analysis Studio
- **Cytoscape.js Graph Engine**: Force-directed (COSE), circular, hierarchical (breadthfirst), concentric, and grid layouts.
- **Multi-Entity Types**: Distinct visual shapes and palettes for Persons (circular avatars), Organizations (buildings), Vehicles (cars), Cases (dossiers), Incidents (warning markers), and Locations (map pins).
- **Relational Strength Weighted Edges**: High (≥75% solid cyan), Medium (45–74% slate), Low (<45% dashed).
- **Shortest Path Finder**: Traces link paths between arbitrary network nodes.
- **High-Resolution Export**: PNG topology export with timestamps.

### 🔬 Investigation Workspace (Section 59)
- **Three-Column Investigative Layout**:
  - **Left**: Multi-entity filter browser (Persons, Organizations, Vehicles, Locations, Cases).
  - **Center**: Full-screen Cytoscape interactive graph.
  - **Right**: Deep Dossier Inspector displaying attributes, linked cases, associates, and action buttons.
  - **Bottom**: Synchronized chronological event timeline.

### 📁 Case Workspace (Section 16 & 60)
- **Case Progress Tracker**: `Case Created → Evidence Collected → Persons Linked → Network Analysis → Analyst Review → Investigation Decision → Closed`.
- **Integrated Tabs**: Case Network Graph, AI Centrality Insights, Evidence Registry, Chain of Custody, and Investigator Notes.

### 🤖 AI Intelligence Center (Sections 25–30)
- **Explainable Link Discovery**: Discovers hidden associations based on shared organizations, mutual communications, and co-presence. Supports investigator `Accept as Link` or `Reject` actions with audit logging.
- **Graph Centrality Engine**: Implements Brandes Betweenness Centrality, Degree Centrality, and Closeness Centrality.
- **Case Similarity Matrix**: Calculates Jaccard similarity across incident categories, locations, and involved entities.
- **Anomaly Detection**: Flags sudden frequency surges and unexpected bridge links between disconnected network clusters.

### 📦 Evidence & Chain of Custody (Sections 17 & 18)
- **Forensic Artifact Registry**: SHA-256 cryptographic integrity hashes, vault references, source tracking.
- **Immutable Custody Audit Trail**: Tracks evidence transfers with transferred by, received by, timestamp, reason, and location.

### 🗺️ Geographic Crime Map (Section 24)
- **Leaflet & OpenStreetMap**: Dark-mode CartoDB tiles.
- **Multi-Layer Plotting**: Synthetic incident markers, case incident spots, and corporate headquarters.

### 📊 Reporting & Dossier Export (Section 34)
- **Client-Side PDF Generation**: Uses `jsPDF` to compile formal intelligence dossiers with legal disclaimers, executive summaries, centrality tables, and custody audit logs.
- **CSV Data Export**: Export network links and case records for external analytical tools.

### 🛡️ Security & Role-Based Access Control (RBAC)
- **JWT Authentication**: Stateless token generation with 24-hour expiration.
- **Four Distinct Roles**:
  - `ADMIN`: User management, system settings, immutable audit logs.
  - `INVESTIGATOR`: Case creation, evidence registration, AI execution, dossier editing.
  - `ANALYST`: Graph analysis, link reviews, trend evaluation, intelligence reports.
  - `VIEWER`: Read-only authorized dossier viewer.
- **Centralized Audit Trail**: Captures sensitive actions (`LOGIN`, `RUN_AI_ANALYSIS`, `ACCEPT_AI_SUGGESTION`, `CREATE_CASE`, `ADD_EVIDENCE`, `EXPORT_REPORT`).

---

## 3. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite 8, Tailwind CSS, Cytoscape.js, Recharts, Leaflet, React-Leaflet, Framer Motion, Lucide React, Axios, jsPDF |
| **Backend** | Java 21, Spring Boot 3.3.4, Spring Security 6, Spring Data JPA, Hibernate, JJWT 0.12.6, Maven |
| **Database** | MySQL 8 dialect / H2 persistent MySQL-compatibility fallback (`MODE=MySQL`) |
| **Styling** | Cyber-intelligence dark palette (`#080C14`, `#0F1626`, `#06B6D4`) |

---

## 4. Architecture & Folder Structure

```
criminal-network-analysis/
├── database/
│   ├── schema.sql                 # Normalized MySQL 8 schema (16 tables, constraints, foreign keys)
│   └── sample-data.sql            # Seed dataset (40 persons, 15 cases, 70 relationships, 25 evidence...)
│
├── backend/                       # Spring Boot 3.3.4 Application
│   ├── pom.xml
│   └── src/main/java/com/intelligence/criminalnetwork/
│       ├── analytics/             # GraphAnalyticsEngine (Betweenness, Degree, Closeness, Clusters)
│       ├── config/                # SecurityConfig, CorsConfig, PasswordEncoderConfig
│       ├── controller/            # 15 REST Controllers (Auth, Cases, Persons, Network, AI, Evidence...)
│       ├── dto/                   # Request/Response payloads & ApiResponse wrapper
│       ├── entity/                # 15 JPA Entities (User, Case, Person, Relationship, Evidence...)
│       ├── exception/             # Centralized @RestControllerAdvice GlobalExceptionHandler
│       ├── repository/            # 15 Spring Data JPA Repositories
│       ├── security/              # JwtTokenProvider, JwtAuthenticationFilter, UserPrincipal
│       ├── service/               # Service interfaces & ServiceImpl business logic
│       └── util/                  # DataInitializerService (automatic demo data seeder)
│
└── frontend/                      # React + Vite Application
    ├── package.json
    ├── vite.config.js             # Development proxy to backend (/api -> localhost:8080)
    ├── tailwind.config.js         # Intelligence color design tokens
    └── src/
        ├── components/            # NetworkGraph, Navbar, Sidebar, EntityDetailPanel, CommandPalette...
        ├── context/               # AuthContext (JWT session management & RBAC)
        ├── pages/                 # 17 Feature Pages (Dashboard, Workspace, Network, AI, Map...)
        └── services/              # api.js (Axios REST client with interceptors)
```

---

## 5. Seeded Demo Accounts (RBAC)

All demo accounts are pre-seeded with the password: `Password@123`

| Role | Username | Email | Key Capabilities |
|---|---|---|---|
| **ADMIN** | `admin` | `admin@demo.local` | Audit logs, settings, system management, permissions |
| **INVESTIGATOR** | `investigator` | `investigator@demo.local` | Cases, evidence, custody, AI analysis, dossiers |
| **ANALYST** | `analyst` | `analyst@demo.local` | Graph analytics, crime trends, report generation |
| **VIEWER** | `viewer` | `viewer@demo.local` | Read-only access to authorized records |

---

## 6. Setup & Execution Instructions

### Prerequisites
- **Java**: JDK 21+
- **Node.js**: v18+ and npm
- **Maven**: 3.9+ (or use included `mvn` wrapper)

### Step 1: Start the Backend (Spring Boot)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   *The backend will automatically start on `http://localhost:8080`. On first run, it initializes the database schema and seeds 40 synthetic persons, 15 cases, 70 relationships, 25 evidence items, 20 incidents, and RBAC users.*

### Step 2: Start the Frontend (React + Vite)
1. In a separate terminal, navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173` and automatically proxy API calls to port `8080`.*

### Step 3: Access the Application
Open your browser and navigate to:
**`http://localhost:5173`**

Click the **"Investigator"** quick-login button, or enter:
- **Username**: `investigator`
- **Password**: `Password@123`

---

## 7. Key REST API Endpoints

### Authentication
- `POST /api/auth/login` — Authenticate and receive JWT token
- `POST /api/auth/register` — Register investigator account
- `GET /api/auth/me` — Fetch current user profile and role

### Cases & Dossiers
- `GET /api/cases` — List all active cases with filters
- `POST /api/cases` — Create new case (auto-assigns `CASE-2026-XXXX`)
- `GET /api/cases/{id}` — Get case details and associated entities
- `PUT /api/cases/{id}` — Update case status, priority, or notes

### Network Graph & Centrality
- `GET /api/network` — Get complete global synthetic graph (nodes & edges)
- `GET /api/network/case/{caseId}` — Get graph subnetwork for a case
- `GET /api/network/person/{personId}` — Get ego-network for an entity
- `POST /api/network/relationships` — Create verified relationship

### AI Intelligence & Suggestions
- `POST /api/ai/network-analysis/{caseId}` — Compute Brandes centrality & bridges
- `GET /api/ai/suggestions` — Fetch pending algorithmic relationship proposals
- `POST /api/ai/suggestions/{id}/review` — Accept or reject AI suggestion

### Evidence & Custody
- `GET /api/evidence` — List evidence records with integrity hashes
- `POST /api/evidence` — Register evidence item with SHA-256
- `GET /api/evidence/{id}/custody` — Fetch unbroken chain of custody timeline
- `POST /api/evidence/{id}/custody` — Record custody transfer movement

### Global Search
- `GET /api/search?q={query}` — Unified search across persons, cases, evidence, vehicles, orgs

---

## 8. Database Architecture

The system supports two database backends:
1. **Zero-Configuration Mode (Default)**: Persistent H2 database in MySQL-compatibility mode (`MODE=MySQL`), allowing instant execution without requiring a local MySQL server setup.
2. **Production MySQL Server**: Pre-configured in `src/main/resources/application-mysql.properties`. Simply create the database `criminal_network_db` and execute `database/schema.sql` and `database/sample-data.sql`.

---

## 9. Academic Demonstration Highlights
- **Command Palette (`Ctrl + K`)**: Instant access to global cross-entity search and navigation commands.
- **Shortest Path Trace**: Algorithmic route visualization between arbitrary nodes.
- **Forensic Custody Ledger**: Audit-compliant chain of custody transfers.
- **Ethical Safeguard Disclaimers**: Displayed across all analytical screens and formal PDF exports.
