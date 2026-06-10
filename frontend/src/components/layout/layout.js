import { navigate } from "../../routes/routes";

/**
 * Renderiza el layout principal con sidebar y header.
 * @param {string} activeRoute - La ruta activa para marcar en el sidebar ('/', '/task', '/profile', '/todo')
 * @param {string} content - El HTML del contenido principal
 * @param {Object} options - Opciones adicionales
 * @param {string} options.breadcrumb - Texto del breadcrumb (default: 'Dashboard')
 * @param {boolean} options.showNewTaskBtn - Mostrar botón "+ New Task" (default: false)
 * @param {string} options.headingTitle - Título del heading (default: 'Task Manager')
 * @param {string} options.headingSubtitle - Subtítulo del heading (default: 'Overview...')
 */
export function Layout(activeRoute, content, options = {}) {
    const {
        breadcrumb = 'Dashboard',
        showNewTaskBtn = false,
        headingTitle = 'Task Manager',
        headingSubtitle = 'Overview of your current academic performance tasks.'
    } = options;

    setTimeout(() => {
        const homeBtn = document.getElementById('nav-dashboard');
        const taskBtn = document.getElementById('nav-tasks');
        const newTaskBtn = document.getElementById('btn-new-task');
        const logoutBtn = document.getElementById('btn-logout');

        if (homeBtn) homeBtn.onclick = (e) => { e.preventDefault(); navigate('/'); };
        if (taskBtn) taskBtn.onclick = (e) => { e.preventDefault(); navigate('/task'); };
        if (newTaskBtn) newTaskBtn.onclick = (e) => { e.preventDefault(); navigate('/todo'); };
        if (logoutBtn) logoutBtn.onclick = (e) => {
            e.preventDefault();
            if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                navigate('/login');
            }
        };
    }, 0);

    const newTaskButton = showNewTaskBtn
        ? `<button id="btn-new-task" class="btn-new-task">+ New Task</button>`
        : '';

    const headingSection = (headingTitle || headingSubtitle || showNewTaskBtn)
        ? `<div class="view-heading">
            <div class="heading-text">
                <h1>${headingTitle}</h1>
                <p>${headingSubtitle}</p>
            </div>
            ${newTaskButton}
        </div>`
        : '';

    const isActive = (route) => activeRoute === route ? 'active' : '';

    return `
    <div class="app-layout">
        <aside class="app-sidebar">
            <div class="sidebar-brand">
                <div class="logo-wrapper">👔</div>
                <span class="brand-text">CRUDZASO</span>
            </div>
            <nav class="sidebar-menu">
                <a href="/" id="nav-dashboard" class="menu-item ${isActive('/')}">
                    <span class="menu-icon">📊</span> Dashboard
                </a>
                <a href="/task" id="nav-tasks" class="menu-item ${isActive('/task')}">
                    <span class="menu-icon">📋</span> My Tasks
                </a>
                <a href="/profile" class="menu-item ${isActive('/profile')}">
                    <span class="menu-icon">👤</span> Profile
                </a>
            </nav>
        </aside>

        <main class="app-main">
            <header class="app-header">
                <div class="header-breadcrumb">
                    🏠 <span class="sep">&rsaquo;</span> <span class="current">${breadcrumb}</span>
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
                    <button id="btn-logout" class="btn-logout">🚪</button>
                </div>
            </header>

            <section class="view-container">
                ${headingSection}
                ${content}
            </section>
        </main>
    </div>
    `;
}

