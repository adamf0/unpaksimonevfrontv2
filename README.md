# Unpak Simonev - Frontend Portal

Frontend application for the **Simonev** monitoring and evaluation system, built on Next.js 16 (React 19) and structured with Domain-Driven Design (DDD) and the Atomic Design Pattern.

---

## 📖 Architecture & Documentation

We have established comprehensive technical documentation to assist developers:

1.  **[Tech Stack & Package Specifications](file:///Users/adamf/Documents/next_project/unpaksimonev/docs/TECH_STACK.md)**: Specifications for frameworks, design assets, and development libraries.
2.  **[System Flow & Activity Diagrams](file:///Users/adamf/Documents/next_project/unpaksimonev/docs/FLOW_DIAGRAMS.md)**: Flowcharts detailing the login validations, redirects, and background token refresh lifecycles.
3.  **[DDD & Atomic Design Architecture](file:///Users/adamf/Documents/next_project/unpaksimonev/docs/DDD_ATOMIC_ARCHITECTURE.md)**: Breakdown of pure Domain models, application adapters, and structural atomic UI presentation components (Atoms, Molecules, Organisms, Templates). Includes the generated system architecture diagram.
4.  **[Developer & Contribution Guide](file:///Users/adamf/Documents/next_project/unpaksimonev/docs/CONTRIBUTING.md)**: Local installation instructions, git conventions, directory structure guidelines, and specifications checklists.

---

## 🚀 Getting Started

### 1. Running the Development Server
```bash
npm install
npm run dev
```
Open [http://localhost:4000](http://localhost:4000) to view the portal locally.

### 2. Running the Test Suite
This project implements a test-driven ecosystem using **Vitest** and **JSDOM** to ensure 100% regression safety.
```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

---

## 🛠️ CI/CD Pipelines

This repository includes configured workflows under `.github/workflows/`:
1.  **Auto Release Docker**: Bumps versions and compiles a standalone production container pushed directly to Docker Hub.
2.  **CI/CD Test and Deploy**: Compiles and runs all Vitest unit tests, generates a static HTML build (`out/`), and automatically deploys the latest frontend resources to **GitHub Pages** upon pushing to the `main` branch.
