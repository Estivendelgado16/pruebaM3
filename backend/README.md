# CRUDZASO — Backend API

A **RESTful API** built with **Node.js**, **Express 4**, and **Supabase** (PostgreSQL as a Service). It provides full CRUD operations for tasks and serves as the data layer for the CRUDZASO frontend SPA.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Create a Supabase project](#1-create-a-supabase-project)
  - [2. Create the `tasks` table](#2-create-the-tasks-table)
  - [3. Configure environment variables](#3-configure-environment-variables)
  - [4. Install dependencies](#4-install-dependencies)
  - [5. Start the server](#5-start-the-server)
- [Available Scripts](#available-scripts)
- [Architecture Overview](#architecture-overview)
  - [Entry Point (`server.js`)](#entry-point-serverjs)
  - [Supabase Client (`config/supabase.js`)](#supabase-client-configsupabasejs)
  - [Routes (`routes/tasks.js`)](#routes-routestasksjs)
  - [Controller (`controllers/taskController.js`)](#controller-controllerstaskcontrollerjs)
- [API Reference](#api-reference)
  - [GET / — Health Check](#get---health-check)
  - [GET /tasks — List All Tasks](#get-tasks---list-all-tasks)
  - [POST /tasks — Create a Task](#post-tasks---create-a-task)
  - [PUT /tasks/:id — Update a Task](#put-tasksid---update-a-task)
  - [DELETE /tasks/:id — Delete a Task](#delete-tasksid---delete-a-task)
- [Supabase Table Schema](#supabase-table-schema)
- [Environment Variables](#environment-variables)
- [Error Handling](#error-handling)
- [Node.js WebSocket Compatibility](#nodejs-websocket-compatibility)
- [Running with json-server (Alternative)](#running-with-json-server-alternative)
- [Possible Improvements](#possible-improvements)

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Runtime** | [Node.js](https://nodejs.org/) | `>= 18` |
| **Framework** | [Express](https://expressjs.com/) | `^4.18` |
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL) | — |
| **Supabase Client** | [@supabase/supabase-js](https://github.com/supabase/supabase-js) | `^2` |
| **Middleware** | [cors](https://github.com/expressjs/cors) | `^2` |
| **Environment** | [dotenv](https://github.com/motdotla/dotenv) | `^16` |
| **WebSocket** | [ws](https://github.com/websockets/ws) | `^8` |
| **Module System** | ES Modules (`import`/`export`) | Native |

> **Note:** There is no `package.json` in the `backend/` directory. Dependencies must be installed manually or a `package.json` created. See [Getting Started](#4-install-dependencies).

---

## Project Structure

```
backend/
├── server.js                 # Express app entry point — CORS, JSON parser, route mounting, health check
├── config/
│   └── supabase.js           # Supabase client initialisation (with realtime disabled, ws transport)
├── controllers/
│   └── taskController.js     # CRUD logic: getTasks, createTask, updateTask, deleteTask
├── routes/
│   └── tasks.js              # Express Router — maps HTTP verbs + paths to controller functions
├── .env                      # Actual environment variables (SUPABASE_URL, SUPABASE_ANON_KEY, PORT)
├── .env.example              # Template for environment variables
└── README.md                 # This file
```

---

## Prerequisites

- **Node.js** `>= 18` (tested with 18.x, 20.x, 22.x)
- **npm** `>= 9`
- A [Supabase](https://supabase.com/) account and project

---

## Getting Started

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com/) and sign in.
2. Click **New project**.
3. Choose a name (e.g., `crudzaso`), set a secure database password, and select a region.
4. Wait for the database provisioning to finish (usually 1–2 minutes).
5. In the project dashboard, go to **Project Settings → API** and copy:
   - **Project URL** (this is your `SUPABASE_URL`)
   - **anon public** key (this is your `SUPABASE_ANON_KEY`)

### 2. Create the `tasks` table

In the Supabase dashboard, go to **SQL Editor** and run:

```sql
CREATE TABLE tasks (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    task TEXT NOT NULL,
    category TEXT DEFAULT '',
    priority TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'pending',
    date TEXT DEFAULT '',
    descripcion TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

Alternatively, use the **Table Editor**:
1. Go to **Table Editor → New table**.
2. Name: `tasks`
3. Add columns as specified in the [Supabase Table Schema](#supabase-table-schema) section below.

### 3. Configure environment variables

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
PORT=3000
```

### 4. Install dependencies

Since there is no `package.json` in the `backend/` directory, create one and install the required packages:

```bash
cd backend
npm init -y
npm install express cors dotenv @supabase/supabase-js ws
```

This installs:

| Package | Purpose |
|---------|---------|
| `express` | Web framework for routing and middleware |
| `cors` | Cross-Origin Resource Sharing middleware |
| `dotenv` | Loads `.env` file into `process.env` |
| `@supabase/supabase-js` | Supabase client for PostgreSQL queries |
| `ws` | WebSocket library (required by Supabase realtime on Node 20+) |

After installation, ensure `package.json` contains `"type": "module"`:

```json
{
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev:backend": "node --watch server.js"
  }
}
```

> `node --watch` is available natively in Node.js 18+ and replaces the need for `nodemon`.

### 5. Start the server

```bash
cd backend
npm start
```

Expected output:

```
Server listening on http://localhost:3000
```

Verify the API is running:

```bash
curl http://localhost:3000
# {"message":"CRUDZASO API running 🚀"}
```

---

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm start` | `node server.js` | Start the Express server |
| `npm run dev:backend` | `node --watch server.js` | Start with auto-restart on file changes |

---

## Architecture Overview

### Entry Point (`server.js`)

```js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/tasks.js';
```

**Middleware stack (in order):**

1. **`dotenv.config()`** — loads `backend/.env` using a manually resolved `__dirname` (since ES Modules lack `__dirname` natively).
2. **`cors()`** — allows cross-origin requests from the Vite frontend (`http://localhost:5173`).
3. **`express.json()`** — parses incoming JSON request bodies.
4. **`app.use('/tasks', taskRoutes)`** — mounts the task router under the `/tasks` path prefix.
5. **`GET /`** — health-check endpoint returning `{ message: "CRUDZASO API running 🚀" }`.

**Server start:** `app.listen(PORT)` binds to the configured port (default `3000`).

### Supabase Client (`config/supabase.js`)

Creates and exports a singleton Supabase client:

```js
export const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    enabled: false,
    transport: ws,   // ws module for Node 20 compatibility
  },
});
```

**Key details:**
- `SUPABASE_URL` and `SUPABASE_ANON_KEY` are read from environment variables.
- **Validation:** throws immediately if either variable is missing.
- **Realtime disabled** (`enabled: false`) because realtime subscriptions are not needed.
- **WebSocket transport:** The `ws` module is passed explicitly because Node.js 20+ does not include a native `WebSocket` global, which Supabase's realtime client expects. Without this, the server would crash on startup with `ReferenceError: WebSocket is not defined`.

### Routes (`routes/tasks.js`)

Uses `express.Router()` to define four endpoints:

| Method | Path | Controller Function |
|--------|------|-------------------|
| `GET` | `/` | `getTasks` |
| `POST` | `/` | `createTask` |
| `PUT` | `/:id` | `updateTask` |
| `DELETE` | `/:id` | `deleteTask` |

Since the router is mounted at `/tasks` in `server.js`, the full paths are `/tasks`, `/tasks/:id`.

### Controller (`controllers/taskController.js`)

Each controller function follows the same pattern:

```
try {
    // 1. Extract request data (req.params, req.body)
    // 2. Call supabase.from('tasks').<operation>()
    // 3. Return 200/201 JSON response with data
} catch (error) {
    // 4. Return 500 JSON response with error.message
}
```

| Function | Supabase Query | Status Code |
|----------|---------------|-------------|
| `getTasks` | `.select('*').order('created_at', { ascending: false })` | `200` |
| `createTask` | `.insert([{ ... }]).select().single()` | `201` |
| `updateTask` | `.update({ ... }).eq('id', id).select().single()` | `200` |
| `deleteTask` | `.delete().eq('id', id)` | `200` |

**Important behaviours:**
- `.select().single()` is chained on `insert` and `update` to return the created/updated row in the response.
- `getTasks` orders results by `created_at` descending (newest first).
- All errors are caught and returned as `{ error: message }` with HTTP `500`.

---

## API Reference

### GET / — Health Check

```
GET http://localhost:3000/
```

**Response `200`:**

```json
{
  "message": "CRUDZASO API running 🚀"
}
```

---

### GET /tasks — List All Tasks

```
GET http://localhost:3000/tasks
```

**Response `200`:**

```json
[
  {
    "id": 1,
    "task": "Complete Quarter 3 Report",
    "category": "Development",
    "priority": "high",
    "status": "in-progress",
    "date": "2024-10-24",
    "descripcion": "Finish the quarterly financial analysis...",
    "created_at": "2024-10-20T14:30:00Z"
  }
]
```

Returns an empty array `[]` if no tasks exist.

---

### POST /tasks — Create a Task

```
POST http://localhost:3000/tasks
Content-Type: application/json

{
  "task": "Fix Login Authentication",
  "category": "Security",
  "priority": "high",
  "status": "pending",
  "date": "2024-10-22",
  "descripcion": "Investigate and fix the OAuth flow"
}
```

**Request Body:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `task` | `string` | **Yes** | — | Task title |
| `category` | `string` | No | `''` | Task category |
| `priority` | `string` | No | `'medium'` | One of: `low`, `medium`, `high` |
| `status` | `string` | No | `'pending'` | One of: `pending`, `in-progress`, `completed` |
| `date` | `string` | No | `''` | Due date (ISO 8601 or any string) |
| `descripcion` | `string` | No | `''` | Task description / notes |

**Response `201`:**

```json
{
  "id": 2,
  "task": "Fix Login Authentication",
  "category": "Security",
  "priority": "high",
  "status": "pending",
  "date": "2024-10-22",
  "descripcion": "Investigate and fix the OAuth flow",
  "created_at": "2024-10-21T09:15:00Z"
}
```

---

### PUT /tasks/:id — Update a Task

```
PUT http://localhost:3000/tasks/2
Content-Type: application/json

{
  "status": "completed"
}
```

**URL Parameter:** `id` — the task's primary key (integer).

**Request Body:** Partial or full task object. Only provided fields are updated.

**Response `200`:**

```json
{
  "id": 2,
  "task": "Fix Login Authentication",
  "category": "Security",
  "priority": "high",
  "status": "completed",
  "date": "2024-10-22",
  "descripcion": "Investigate and fix the OAuth flow",
  "created_at": "2024-10-21T09:15:00Z"
}
```

**Response `500`** (if `id` does not exist — Supabase returns `null`, no explicit 404 is returned by the current implementation):

```json
{
  "error": "No task found with that ID"
}
```

---

### DELETE /tasks/:id — Delete a Task

```
DELETE http://localhost:3000/tasks/2
```

**URL Parameter:** `id` — the task's primary key (integer).

**Response `200`:**

```json
{
  "message": "Task deleted successfully"
}
```

---

## Supabase Table Schema

The API expects a `tasks` table in your Supabase database with the following schema:

| Column | Type | Constraints | Default |
|--------|------|------------|---------|
| `id` | `bigint` | `PRIMARY KEY`, `GENERATED ALWAYS AS IDENTITY` | auto |
| `task` | `text` | `NOT NULL` | — |
| `category` | `text` | — | `''` |
| `priority` | `text` | — | `'medium'` |
| `status` | `text` | — | `'pending'` |
| `date` | `text` | — | `''` |
| `descripcion` | `text` | — | `''` |
| `created_at` | `timestamptz` | — | `now()` |

**SQL DDL:**

```sql
CREATE TABLE tasks (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    task TEXT NOT NULL,
    category TEXT DEFAULT ''::TEXT,
    priority TEXT DEFAULT 'medium'::TEXT,
    status TEXT DEFAULT 'pending'::TEXT,
    date TEXT DEFAULT ''::TEXT,
    descripcion TEXT DEFAULT ''::TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SUPABASE_URL` | **Yes** | — | Your Supabase project URL (e.g., `https://xxx.supabase.co`) |
| `SUPABASE_ANON_KEY` | **Yes** | — | Your Supabase anonymous public key |
| `PORT` | No | `3000` | The port the Express server listens on |

---

## Error Handling

All controller functions wrap their logic in `try/catch` blocks:

```js
try {
    // Supabase operation
} catch (error) {
    res.status(500).json({ error: error.message });
}
```

**Common error scenarios:**

| Scenario | HTTP Status | Response Body |
|----------|-------------|---------------|
| Missing `task` field on POST | `500` | `{ "error": "null value in column \"task\" violates not-null constraint" }` |
| Invalid `id` on PUT/DELETE | `500` | `{ "error": "invalid input syntax for type bigint: \"abc\"" }` |
| Missing Supabase credentials on startup | — | Process throws immediately with `Error: Missing SUPABASE_URL or SUPABASE_ANON_KEY` |
| Supabase project unreachable | `500` | `{ "error": "fetch failed" }` or similar network error |

> **Note:** The current implementation does **not** distinguish between 404 (not found) and 500 (server error). A production improvement would be to check if the returned data is `null` after an update/delete and respond with `404` instead.

---

## Node.js WebSocket Compatibility

Supabase's realtime client uses `WebSocket` internally. In Node.js 18+, there is no native `WebSocket` global. To prevent a crash on startup, the Supabase client is configured with:

```js
const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');

export const supabase = createClient(url, key, {
  realtime: {
    enabled: false,
    transport: WebSocket,   // <-- polyfill from the `ws` package
  },
});
```

Even though realtime is disabled (`enabled: false`), Supabase still instantiates its realtime client internally. Passing the `transport` option prevents the `ReferenceError: WebSocket is not defined` error.

---

## Running with json-server (Alternative)

If you do not have a Supabase project, you can use `json-server` (already installed in `frontend/`) with the `db.json` file at the project root:

```bash
cd frontend
npm run api -- ../db.json --port 3000
```

This serves a mock API at `http://localhost:3000` with the following endpoints:

- `GET /tasks` — returns the `task` array from `db.json`
- `POST /tasks` — adds an item
- `PUT /tasks/:id` — updates an item
- `DELETE /tasks/:id` — deletes an item

> **Note:** The `db.json` schema does **not** match the Supabase table schema exactly (fields differ). The frontend may behave differently when using `json-server` vs. the real backend.

---

## Possible Improvements

- **Input validation**: Use a library like `zod` or `express-validator` to validate request bodies before hitting the database (e.g., ensure `task` is a non-empty string, `priority` is one of `low`/`medium`/`high`).
- **404 handling**: Check if the returned data from Supabase is `null` after `update`/`delete` and respond with `404` instead of `500`.
- **Error normalisation**: Create a central error-handling middleware instead of try/catch in every controller.
- **Logging**: Integrate `pino` or `winston` for structured request logging.
- **Rate limiting**: Add `express-rate-limit` to protect the API from abuse.
- **Environment validation**: Validate all required env vars at startup using `envalid` or similar.
- **Dockerise**: Provide a `Dockerfile` and `docker-compose.yml` for reproducible deployments.
- **API documentation**: Generate OpenAPI/Swagger specs for better developer experience.
