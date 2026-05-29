# OvieLearn 🎓🚀

Welcome to **OvieLearn**, a highly interactive, modern web application designed by **@southwarridev** for mastering the **Ovie programming language**. 

OvieLearn leverages a high-fidelity systems learning playground complete with an interactive compiler sandbox, challenging syllabus modules, real-time feedback, simulated AdMob ad monetization panels, and live GitHub integration.

---

## ✨ Features Overview

### 1. 💻 Interactive Compiler & Sandbox
* Master Ovie code syntax directly inside the sandboxed code terminal.
* Runs on-the-fly syntax validation, memory layouts, register telemetry, and outputs clean run confirmations.
* Integrated with progress persistence (`localStorage`) keeping track of completed classes and challenges.

### 2. 🦊 Connected GitHub Bridge Console (Collapsible Bottom Menu)
* **Live Repo Statistics**: Dynamically queries repository details (stars, forks, open issues, description) for the source project.
* **OAuth Account Linker**: Implements secure GitHub OAuth flow enabling developers to link their profiles directly.
* **Profile Search Tool**: Integrated API endpoint to fetch information about active contributors directly.
* **Diagnostics Screen**: Live reporting of compile server status, response latency, dynamic security layer state, and dependency parameters.
* **Interactive Testing Screen**: Benchmark optimization check routines including:
  * **Tail Recursion Optimizer Check** — validates stack frame boundaries.
  * **Struct Memory Align Validator** — validates heap-offset offsets.
  * **Aproko Parser Alerts** — suggests code styling improvements.

### 3. 🎯 Simulated Google AdMob Revenue Dashboard
* **Dynamic Placements**: Houses banner, interstitial, and rewarded ad placeholders acting like official mobile ads.
* **Interactive Simulator**: Run playback overlays, watch promotional videos to claim supporter awards, and add developer earnings metrics.
* **Server-Side Verification (SSV)**: Documented server-side verifiers simulating cryptographic query verification on our backend controllers.

### 4. ⚙️ Integrated CI Pipeline
* Fully preconfigured-up GitHub Actions pipeline in `.github/workflows/ci.yml` verifying code standards automatically through Type safety and production asset compilation on every push or pull-request events.

---

## 🛠️ Local Setup & Guidelines

To clone, test, and contribute to the OvieLearn code suite locally:

### 1. Install Dependencies
Ensure you have [Node.js](https://nodejs.org) installed, then run:
```bash
npm install
```

### 2. Set Up Environment Keys
Configure your OAuth keys inside your local `.env` setup:
```env
# Create .env from the target template
GITHUB_CLIENT_ID="your_github_oauth_client_id"
GITHUB_CLIENT_SECRET="your_github_oauth_client_secret"
```

### 3. Start Development Server
Starts both the full-stack Express backend server and the hot-reloading Vite server on standard port `3000`:
```bash
npm run dev
```

### 4. Code Verification (Linter)
Run TypeScript compilation sanity checks to verify zero type mismatches:
```bash
npm run lint
```

### 5. Compile Application Bundles
Bundles frontend components and uses `esbuild` to compile the backend server entry-point into a self-contained CommonJS file:
```bash
npm run build
```

---

## 🚀 Deployment & Publishing

OvieLearn is completely optimized to run within sandboxed cloud run container environments.

### 🔑 Publishing Settings:
1. Open the **API Keys & Secrets** settings pane in your builder platform dashboard.
2. Ensure you have registered the following parameters to unlock authentic GitHub authorizations:
   * **`GITHUB_CLIENT_ID`**: Create a GitHub OAuth App profile on GitHub settings, configuring the Application Authorization Callback URL to direct to: `https://[Your-App-URL]/auth/callback`.
   * **`GITHUB_CLIENT_SECRET`**: Paste the corresponding secure developer token.
3. Once configured, your end-users can seamlessly verify their GitHub accounts directly inside the user dashboard!

---

*Designed and maintained with passion for the Ovie ecosystem by **[@southwarridev](https://github.com/southwarridev)**.*
