# LinearFlow ⚡

> An original, high-performance issue-tracking and project management web application crafted with pixel-accurate dark-mode aesthetics, keyboard-driven navigation, and real-time interactive workspace workflows.

[![React](https://img.shields.io/badge/React-19.3-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646cff?logo=vite)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Highlights & Key Features

* **High-Fidelity Dark Mode Design System**: Custom CSS variables calibrated for WCAG AA contrast ratios, deep matte surfaces (`#08090a`, `#101114`, `#131418`), restrained borders, and micro-interactions.
* **Dual View Issue Workspace**:
  * **Kanban Board**: Drag-and-drop / click-to-move cards across status columns (`Todo`, `In Progress`, `In Review`, `Done`, `Backlog`).
  * **Dense Table List**: Tabular view with customizable columns, priority badges, status pills, and assignee avatars.
* **Floating Display Configuration Panel**:
  * Segmented [List / Board] mode toggle.
  * Column & Row grouping selectors (by Status, Priority, Assignee, Project).
  * Ordering selector (Priority, Status, Created date, Updated date, Title) with directional sort toggle.
  * Completed issues filtering window (`All`, `Past week`, `Past month`, `None`).
  * Show sub-issues & empty column/row switches.
  * Interactive chips to dynamically toggle card properties (Priority, ID, Status, Labels, Project, Milestone, Due date, Links, Assignee).
* **Workspace Dashboard**: Key velocity metrics, project milestone completion cards, and real-time updates feed.
* **Slide-over Issue Detail Panel**: Live editable title and markdown description, properties inspector, due date picker, comments stream, and timestamped activity history.
* **Command Palette (`Ctrl+K` / `⌘K`)**: Quick fuzzy navigation, issue search by ID/text, and one-key shortcuts (`C` for new issue, `Escape` to close).
* **Workspace Settings & Backup**: Team persona switcher, theme token visualizer, reset to seed data, and JSON workspace backup download.
* **Storage Abstraction**: Extensible `IStorageService` layer persisting locally in `localStorage`, ready to connect to any REST API, Supabase, or Firebase backend.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Core Framework** | React 19, TypeScript |
| **Build & Bundler** | Vite 8 |
| **Routing** | React Router 7 (`react-router-dom`) |
| **Icons** | Lucide React |
| **Styling** | Vanilla CSS Design System with CSS Custom Properties (`src/index.css`) |
| **Persistence** | LocalStorage Abstraction Layer (`src/services/storage.ts`) |

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or newer)
* [npm](https://www.npmjs.com/) (v9 or newer)

### 1. Clone the repository
```bash
git clone https://github.com/Ragulchandru/LinearFlow.git
cd LinearFlow
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 4. Build for production
```bash
npm run build
```
Generates optimized bundles in the `dist/` directory.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + K` or `⌘ + K` | Open Command Palette / Fuzzy Search |
| `C` | Create New Issue (when not typing in an input) |
| `Escape` | Dismiss open Modal, Detail Drawer, or Command Palette |
| `↑` / `↓` + `Enter` | Navigate and execute Command Palette items |

---

## 📂 Project Architecture

```
LinearFlow/
├── public/                 # Static assets and icons
├── src/
│   ├── components/
│   │   ├── common/         # Avatar, StatusBadge, PriorityBadge, Toast, CommandPalette
│   │   ├── issues/         # IssueBoard, IssueList, IssueDetailDrawer, CreateIssueModal, DisplayPanel
│   │   └── layout/         # Sidebar, Navbar
│   ├── context/            # AppContext (global state, filter state, display config)
│   ├── pages/              # AllIssues, Dashboard, MyIssues, Inbox, Projects, ProjectDetail, Settings
│   ├── services/           # StorageService (local persistence and seed data)
│   ├── types/              # TypeScript interfaces (Issue, DisplayConfig, User, Project, etc.)
│   ├── App.tsx             # Root router and overlay container
│   ├── index.css           # Design system tokens and styles
│   └── main.tsx            # Application entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 📄 License

This project is licensed under the MIT License.
