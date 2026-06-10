import './task.css';
import { Layout } from '../../components/layout/layout';
import { apiGet } from '../../utils/api';

export function Task() {
    const content = `
        <div class="cards">
            <div class="card-task">
                <div class="card-info">
                    <span class="card-title">Total Tasks</span>
                    <span class="card-value" id="total-tasks">—</span>
                </div>
                <div class="card-icon icon-blue">📚</div>
            </div>
            <div class="card-task">
                <div class="card-info">
                    <span class="card-title">Completed</span>
                    <span class="card-value" id="completed-tasks">—</span>
                </div>
                <div class="card-icon icon-green">✅</div>
            </div>
            <div class="card-task">
                <div class="card-info">
                    <span class="card-title">Pending</span>
                    <span class="card-value" id="pending-tasks">—</span>
                </div>
                <div class="card-icon icon-orange">🕒</div>
            </div>
            <div class="card-task">
                <div class="card-info">
                    <span class="card-title">Overall Progress</span>
                    <span class="card-value" id="progress-percent">—</span>
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
                        <th>CATEGORY</th>
                        <th>STATUS</th>
                        <th>PRIORITY</th>
                        <th>DUE DATE</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody id="tasks-tbody">
                    <tr>
                        <td colspan="6" style="text-align:center; padding:2rem; color:#64748b;">Loading tasks...</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;

    setTimeout(() => {
        loadTasks();
    }, 0);

    return Layout('/task', content, {
        breadcrumb: 'My Tasks',
        showNewTaskBtn: true,
        headingTitle: 'Task Manager',
        headingSubtitle: 'Overview of your current academic performance tasks.'
    });
}

async function loadTasks() {
    try {
        const data = await apiGet('/tasks');
        console.log('Tareas obtenidas:', data);

        const tbody = document.getElementById('tasks-tbody');
        if (!tbody || !Array.isArray(data)) return;

        // Actualizar contadores
        const total = data.length;
        const completed = data.filter(t => t.status === 'completed').length;
        const pending = total - completed;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

        const totalEl = document.getElementById('total-tasks');
        const completedEl = document.getElementById('completed-tasks');
        const pendingEl = document.getElementById('pending-tasks');
        const progressEl = document.getElementById('progress-percent');

        if (totalEl) totalEl.textContent = total;
        if (completedEl) completedEl.textContent = completed;
        if (pendingEl) pendingEl.textContent = pending;
        if (progressEl) progressEl.textContent = progress + '%';

        // Renderizar tabla
        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:#64748b;">No tasks found</td></tr>`;
            return;
        }

        tbody.innerHTML = data.map(t => {
            const statusClass = t.status === 'completed' ? 'completed' :
                                t.status === 'in-progress' ? 'progress' : 'pending';
            const priorityClass = t.priority === 'high' ? 'red' :
                                  t.priority === 'low' ? 'green' : 'orange';
            return `
                <tr>
                    <td class="task-name-cell">${t.task || ''}</td>
                    <td>
                        <div class="assignee-cell">
                            <div class="avatar-placeholder"></div> ${t.category || 'N/A'}
                        </div>
                    </td>
                    <td><span class="status-badge ${statusClass}">${t.status || 'Pending'}</span></td>
                    <td><span class="dot-pri ${priorityClass}"></span> ${t.priority || 'Medium'}</td>
                    <td>${t.date || ''}</td>
                    <td class="actions-cell">✎ 🗑</td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading tasks:', error);
        const tbody = document.getElementById('tasks-tbody');
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:#ef4444;">Error loading tasks: ${error.message}</td></tr>`;
        }
    }
}

