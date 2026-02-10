import './home.css';
import { navigate } from "../../routes/routes";

export function Home() {
    setTimeout(() => {
        const homeBtn = document.getElementById('nav-dashboard');
        const taskBtn = document.getElementById('nav-tasks');
        const btnAddTask = document.getElementById('btnAdd')

        if (homeBtn) homeBtn.onclick = (e) => { e.preventDefault(); navigate('/home'); };
        if (taskBtn) taskBtn.onclick = (e) => { e.preventDefault(); navigate('/task'); };
        if (btnAddTask) btnAddTask.onclick = (e) => { e.preventDefault(); navigate('/todo'); };

    }, 0);

    return `
    <div class="app-layout">
        <aside class="app-sidebar">
            <div class="sidebar-brand">
                <div class="logo-wrapper">👔</div>
                <span class="brand-text">CRUDZASO</span>
            </div>
            <nav class="sidebar-menu">
                <a href="/home" id="nav-dashboard" class="menu-item active">
                    <span class="menu-icon">📊</span> Dashboard
                </a>
                <a href="/task" id="nav-tasks" class="menu-item">
                    <span class="menu-icon">📋</span> My Tasks
                </a>
                <a href="/profile" class="menu-item">
                    <span class="menu-icon">👤</span> Profile
                </a>
            </nav>
        </aside>

        <main class="app-main">
            <header class="app-header">
                <div class="header-breadcrumb">
                    🏠 <span class="sep">&rsaquo;</span> <span class="current">Dashboard</span>
                </div>
                <div class="header-right">
                    <button class="btn-icon">🔔</button>
                    <div class="user-dropdown">
                        <img src="https://i.pravatar.cc/150?u=alex" class="user-avatar" alt="Profile">
                        <div class="user-details">
                            <span class="user-name">Alex Morgan</span>
                            <span class="user-role">Product Designer</span>
                        </div>
                        <span class="chevron">⌄</span>
                    </div>
                    <button class="btn-logout">🚪</button>
                </div>
            </header>

            <section class="view-container">
                <div class="view-heading">
                    <div class="heading-text">
                        <h1>Task Manager</h1>
                        <p>Overview of your current academic performance tasks.</p>
                    </div>
                    <button id="btnAdd" href="/todo" class="btn-new-task" data-link>+ New Task</button>
                </div>

                <div class="summary-cards">
                    <div class="card">
                        <div class="card-info">
                            <span class="card-title">Total Tasks</span>
                            <span class="card-value">24</span>
                            <span class="card-trend trend-up">↗ +12% from last week</span>
                        </div>
                        <div class="card-icon icon-blue">📚</div>
                    </div>
                    <div class="card">
                        <div class="card-info">
                            <span class="card-title">Completed</span>
                            <span class="card-value">18</span>
                            <span class="card-trend trend-up">✓ On track</span>
                        </div>
                        <div class="card-icon icon-green">✅</div>
                    </div>
                    <div class="card">
                        <div class="card-info">
                            <span class="card-title">Pending</span>
                            <span class="card-value">6</span>
                            <span class="card-trend trend-warning">⚠ 2 High Priority</span>
                        </div>
                        <div class="card-icon icon-orange">🕒</div>
                    </div>
                    <div class="card">
                        <div class="card-info">
                            <span class="card-title">Overall Progress</span>
                            <span class="card-value">75%</span>
                            <span class="card-trend trend-up">📊 Keep it up!</span>
                        </div>
                        <div class="card-icon icon-purple">📈</div>
                    </div>
                </div>

                <div class="table-block">
                    <div class="table-actions">
                        <div class="search-input">
                            🔍 <input type="text" placeholder="Search tasks...">
                        </div>
                        <div class="filter-pills">
                            <button class="pill active">All Tasks</button>
                            <button class="pill">Pending</button>
                            <button class="pill">Completed</button>
                        </div>
                    </div>

                    <table class="tasks-table">
                        <thead>
                            <tr>
                                <th>TASK NAME</th>
                                <th>ASSIGNEE</th>
                                <th>STATUS</th>
                                <th>PRIORITY</th>
                                <th>DUE DATE</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="task-name-cell">Update Documentation</td>
                                <td>
                                    <div class="assignee-cell">
                                        <div class="avatar-placeholder"></div> Sarah Lin
                                    </div>
                                </td>
                                <td><span class="status-badge progress">In Progress</span></td>
                                <td><span class="dot-pri orange"></span> Medium</td>
                                <td>Oct 24, 2023</td>
                                <td class="actions-cell">✎ 🗑</td>
                            </tr>
                            <tr>
                                <td class="task-name-cell">Fix Login Authentication</td>
                                <td>
                                    <div class="assignee-cell">
                                        <img src="https://i.pravatar.cc/30?u=raj" class="avatar-xs"> Raj Patel
                                    </div>
                                </td>
                                <td><span class="status-badge pending">Pending</span></td>
                                <td><span class="dot-pri red"></span> High</td>
                                <td class="date-overdue">Oct 22, 2023</td>
                                <td class="actions-cell">✎ 🗑</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    </div>
    `;
}