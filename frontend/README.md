# CRUDZASO — Frontend

A **Single-Page Application (SPA)** for task management built with **Vite 7** and **Vanilla JavaScript (ES Modules)**. It provides a dashboard, CRUD task operations, user authentication simulation, and a profile view. The frontend communicates with a REST API backend (Express + Supabase) running on port `3000`.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone the repository](#1-clone-the-repository)
  - [2. Install dependencies](#2-install-dependencies)
  - [3. Configure environment variables](#3-configure-environment-variables)
  - [4. Start the development server](#4-start-the-development-server)
- [Available Scripts](#available-scripts)
- [Architecture Overview](#architecture-overview)
  - [Entry Point](#entry-point-indexhtml--mainjs)
  - [SPA Router](#spa-router-srcroutesroutesjs)
  - [Layout Component](#layout-component-srccomponentslayoutlayoutjs)
  - [API Helper Layer](#api-helper-layer-srcutilsapijs)
  - [Pages](#pages)
  - [ToDo Component](#todo-component-srccomponentstodotodojs)
- [Environment Variables](#environment-variables)
- [Production Build](#production-build)
- [Styling Approach](#styling-approach)
- [How the App Works (Flow)](#how-the-app-works-flow)
- [Possible Improvements](#possible-improvements)

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Bundler / Dev Server** | [Vite](https://vitejs.dev/) | `^7.2.4` |
| **Language** | JavaScript (ES Modules) | ES2022+ |
| **Runtime** | [Node.js](https://nodejs.org/) | `>=18` |
| **Package Manager** | [npm](https://www.npmjs.com/) | `>=9` |
| **CSS** | Vanilla CSS (no framework) | — |
| **Mock API (optional)** | [json-server](https://github.com/typicode/json-server) | `^1.0.0-beta.5` |

> **Note:** No frontend framework (React, Vue, Svelte) is used. This is a pure Vanilla JS SPA.

---

## Project Structure

```
frontend/
├── index.html                      # Entry HTML (mounts #app + loads main.js)
├── package.json                    # Dependencies and scripts
├── package-lock.json
├── README.md                       # This file
├── public/
│   └── vite.svg                    # Favicon
└── src/
    ├── main.js                     # JS entry point — initialises the router on DOMContentLoaded
    ├── style.css                   # Global base styles (reset, typography, variables)
    ├── routes/
    │   └── routes.js               # Client-side SPA router (hash-less, popstate-based)
    ├── utils/
    │   └── api.js                  # HTTP helper: apiGet, apiPost, apiPut, apiDelete
    ├── components/
    │   ├── layout/
    │   │   └── layout.js           # Reusable layout shell (sidebar + header + main)
    │   └── toDo/
    │       ├── toDo.js             # "Create New Task" form component
    │       └── task.css            # Styles for the form
    └── pages/
        ├── home/
        │   ├── home.js             # Dashboard page — summary cards + mock task table
        │   └── home.css            # Layout, sidebar, cards, table styles
        ├── login/
        │   ├── login.js            # Login page — hardcoded admin/1234 auth
        │   └── login.css           # Login card, form, button styles
        ├── profile/
        │   ├── profile.js          # Profile page — static user info card
        │   └── profile.css         # Profile cards, grid, badge styles
        └── task/
            ├── task.js             # Task list page — fetches live data from API
            └── task.css            # Task-specific styles (cards, table, status badges)
```

---

## Prerequisites

- **Node.js** `>= 18` (tested with 18.x, 20.x, 22.x)
- **npm** `>= 9`
- A running backend (Express + Supabase) on `http://localhost:3000`, **or** `json-server` serving `../db.json`

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Estivendelgado16/pruebaM3.git
cd pruebaM3/frontend
```

### 2. Install dependencies

```bash
npm install
```

This installs:
- **vite** (dev dependency) — the build tool and dev server
- **json-server** (runtime dependency) — optional, for mocking the API

### 3. Configure environment variables

Create a `.env` file in the `frontend/` directory (optional):

```bash
# frontend/.env
VITE_API_URL=http://localhost:3000
```

If not set, the API helper defaults to `http://localhost:3000`. See [Environment Variables](#environment-variables) for details.

### 4. Start the development server

```bash
npm run dev
```

The Vite dev server starts on **http://localhost:5173** with Hot Module Replacement (HMR).

---

## Available Scripts

All scripts are defined in `frontend/package.json`:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite development server with HMR |
| `npm run build` | Build the project for production into `frontend/dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run api` | Launch `json-server` (requires `../db.json`) |

---

## Architecture Overview

### Entry Point (`index.html` + `main.js`)

`index.html` provides a minimal shell with a single `<div id="app"></div>` and loads `src/main.js` as an ES Module:

```html
<div id="app"></div>
<script type="module" src="/src/main.js"></script>
```

`main.js` listens for `DOMContentLoaded` and calls `router()`, which renders the appropriate page into `#app`.

### SPA Router (`src/routes/routes.js`)

A custom client-side router that maps `window.location.pathname` to page functions:

```js
const routes = {
    '/': Home,
    '/home': Home,
    '/login': Login,
    '/task': Task,
    '/profile': Profile,
    '/todo': ToDo
}
```

**Key behaviours:**
- On navigation, `router()` reads `window.location.pathname`, looks up the matching page function, and sets `app.innerHTML = page()`.
- `navigate(path)` uses `window.history.pushState()` to change the URL without a full page reload, then calls `router()`.
- `popstate` events (browser back/forward) are caught to re-render accordingly.
- Error handling: if `#app` is missing or a page function throws, an error message is rendered inline.

### Layout Component (`src/components/layout/layout.js`)

A reusable shell injected by every page component. It renders:

```
┌──────────────────────────────────────┐
│  App-Layout                          │
│  ┌──────────┬───────────────────────┐│
│  │ Sidebar  │ Header                ││
│  │          │  Breadcrumb | Notif   ││
│  │  📊 Dash │  User avatar + logout ││
│  │  📋 Tasks├───────────────────────┤│
│  │  👤 Prof │ View-container        ││
│  │          │  Heading (title+btn)  ││
│  │          │  Page-specific content││
│  └──────────┴───────────────────────┘│
└──────────────────────────────────────┘
```

**Parameters:**

```js
Layout(activeRoute, content, options)
```

| Param | Type | Description |
|-------|------|-------------|
| `activeRoute` | `string` | Marks the active sidebar item (`'/'`, `'/task'`, `'/profile'`, `'/todo'`) |
| `content` | `string` (HTML) | The page's inner HTML |
| `options.breadcrumb` | `string` | Breadcrumb label (default: `'Dashboard'`) |
| `options.showNewTaskBtn` | `boolean` | Shows/hides the "+ New Task" button in the heading |
| `options.headingTitle` | `string` | Main heading text |
| `options.headingSubtitle` | `string` | Subtitle below the heading |

**Post-render binding:** A `setTimeout(..., 0)` attaches `click` event listeners to sidebar links, the "New Task" button, and the logout button after the DOM is painted.

### API Helper Layer (`src/utils/api.js`)

A thin wrapper around `fetch()` providing four functions:

| Function | HTTP Method | Usage |
|----------|-------------|-------|
| `apiGet(endpoint)` | `GET` | `const tasks = await apiGet('/tasks')` |
| `apiPost(endpoint, body)` | `POST` | `await apiPost('/tasks', { task: '...' })` |
| `apiPut(endpoint, body)` | `PUT` | `await apiPut('/tasks/1', { status: 'completed' })` |
| `apiDelete(endpoint)` | `DELETE` | `await apiDelete('/tasks/1')` |

**Base URL resolution:**
```js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

Every function checks `res.ok` and throws a descriptive `Error` on non-2xx responses.

### Pages

| Route | File | Data Source | Description |
|-------|------|-------------|-------------|
| `/`, `/home` | `home.js` | **Mock data** (hardcoded) | Dashboard with 4 summary cards (Total, Completed, Pending, Progress) and a static task table with 2 sample rows. Includes search input and filter pills (non-functional). |
| `/task` | `task.js` | **Live API** (`apiGet('/tasks')`) | Same layout as Home but fetches tasks dynamically. Renders a row per task with status/priority badges. Summary cards update based on fetched data. Handles loading, empty, and error states. |
| `/login` | `login.js` | **Hardcoded auth** (`admin` / `1234`) | Standalone login page (no Layout wrapper). On successful login, navigates to `/`. Does **not** persist any session token. |
| `/profile` | `profile.js` | **Mock data** (hardcoded) | Two-column profile layout: left card shows avatar, name, role badge, task count (static `154`); right card shows a details grid (Full Name, Employee ID, Phone, Department, Role, Join Date). |

### ToDo Component (`src/components/toDo/toDo.js`)

The create-task form. It wraps itself in the `Layout` component (with `activeRoute = '/todo'`).

**Form fields:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Task Title | `text` | Yes | Validates before submit |
| Category | `text` | No | Free text (e.g., "Development") |
| Priority | `select` | No | Options: `medium` (default), `high`, `low` |
| Status | `select` | No | Options: `pending` (default), `in-progress`, `completed` |
| Due Date | `date` | No | Native date picker |
| Description | `textarea` | No | Free text, 5 rows |

**Submit flow:**
1. Validates that `task-title` is non-empty.
2. Disables the submit button and sets its text to `"Saving..."`.
3. Calls `apiPost('/tasks', taskData)`.
4. On success: logs the response and navigates to `/task`.
5. On error: shows an `alert` with the error message.
6. Re-enables the submit button in the `finally` block.

---

## Environment Variables

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `VITE_API_URL` | `http://localhost:3000` | No | Base URL for the REST API backend |

Create a `.env` file in `frontend/` to override:

```bash
VITE_API_URL=https://your-production-backend.com
```

---

## Production Build

```bash
npm run build
```

Output goes to `frontend/dist/`. The built files are:

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── vite.svg
```

To preview the production build locally:

```bash
npm run preview
```

---

## Styling Approach

- **Vanilla CSS** — no preprocessors (Sass, PostCSS) or utility frameworks (Tailwind).
- **CSS custom properties** (`:root`) used in `home.css`, `task.css`, and `login.css` for consistent colors.
- **No BEM** — naming is ad-hoc (`.card`, `.card-task`, `.table-block`, etc.).
- There is **CSS duplication** between `home.css` and `task.css` (sidebar, header, table styles). This is a known area for refactoring.
- The login page has its own `login.css` that overrides global `body` styles (centering, font-family).

---

## How the App Works (Flow)

```
User opens http://localhost:5173
        │
        ▼
index.html serves <div id="app"></div>
        │
        ▼
main.js fires on DOMContentLoaded → calls router()
        │
        ▼
router() reads window.location.pathname (e.g. "/")
        │
        ▼
Looks up routes object → finds Home function
        │
        ▼
Home() generates HTML string, passes it to Layout('/', content, options)
        │
        ▼
Layout returns full app shell HTML with sidebar + header + content
        │
        ▼
app.innerHTML = rendered HTML  →  page is painted
        │
        ▼
setTimeout(...,0) attaches event listeners:
  • Sidebar links → navigate('/')
  • New Task btn → navigate('/todo')
  • Logout btn → confirm → navigate('/login')
```

For the **Task page**, after the initial render, `loadTasks()` is called asynchronously:

```
Task() → Layout rendered
        │
        ▼
setTimeout → loadTasks()
        │
        ▼
apiGet('/tasks') → fetch from http://localhost:3000/tasks
        │
        ▼
Parse response → update summary card values (total, completed, pending, progress %)
        │
        ▼
Map data array → generate <tr> rows with status/priority badges
        │
        ▼
tbody.innerHTML = rows  →  table updated
```

---

## Possible Improvements

- **State management**: Introduce a simple reactive store (e.g., a pub/sub pattern) to share state between pages.
- **CSS refactoring**: Extract shared layout styles into a single `layout.css` to eliminate duplication across `home.css`, `task.css`, and `profile.css`.
- **TypeScript migration**: Add TypeScript for type safety across the SPA router, API helper, and page components.
- **Authentication persistence**: Replace hardcoded login with JWT token storage (localStorage) and protected route guards.
- **Form validation library**: Use a lightweight validator (e.g., `Valibot` or native Constraint Validation API) for the ToDo form.
- **Unit tests**: Add Vitest for testing the router, API helper, and page rendering logic.
- **Loading skeletons**: Replace the plain "Loading tasks..." text with animated skeleton placeholders.
- **Pagination / infinite scroll**: For large task lists fetched from the API.
