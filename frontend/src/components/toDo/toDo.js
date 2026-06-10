import './task.css';
import { Layout } from '../layout/layout';
import { apiPost } from '../../utils/api';
import { navigate } from '../../routes/routes';

export function ToDo() {
    const content = `
        <div class="main-header-task">
            <a href="/task" id="back-link" class="back-link">← Back to Tasks</a>
            <span class="separator">|</span>
            <span class="create-new-text">Create New</span>
        </div>

        <h1>Create New Task</h1>

        <div class="form-card">
            <form id="create-task-form">
                <!-- Task Title Field -->
                <div class="form-group">
                    <label for="task-title">Task Title <span class="required">*</span></label>
                    <input type="text" id="task-title" placeholder="e.g., Complete Quarter 3 Report" required>
                </div>

                <div class="form-row">
                    <!-- Category Field -->
                    <div class="form-group">
                        <label for="category">Category</label>
                        <input id="category" type="text" placeholder="e.g., Development"/>
                    </div>

                    <!-- Priority Field -->
                    <div class="form-group">
                        <label for="priority">Priority</label>
                        <select id="priority">
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                </div>

                <div class="form-row">
                    <!-- Status Field -->
                    <div class="form-group">
                        <label for="status">Status</label>
                        <select id="status">
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <!-- Due Date Field -->
                    <div class="form-group">
                        <label for="due-date">Due Date</label>
                        <input type="date" id="due-date">
                    </div>
                </div>

                <!-- Description Field -->
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" rows="5" placeholder="Add details about this task..."></textarea>
                </div>

                <!-- Action Buttons -->
                <div class="form-actions">
                    <button type="button" id="btn-cancel" class="btn-cancel">Cancel</button>
                    <button id="btnSumit" type="submit" class="btn-save">💾 Save Task</button>
                </div>
            </form>
        </div>
    `;

    setTimeout(() => {
        const backLink = document.getElementById('back-link');
        const cancelBtn = document.getElementById('btn-cancel');
        const form = document.getElementById('create-task-form');
        const btnSumit = document.getElementById('btnSumit');

        if (backLink) backLink.onclick = (e) => { e.preventDefault(); navigate('/task'); };
        if (cancelBtn) cancelBtn.onclick = () => navigate('/task');

        if (form && btnSumit) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const task = document.getElementById('task-title').value;
                const category = document.getElementById('category').value;
                const priority = document.getElementById('priority').value;
                const status = document.getElementById('status').value;
                const date = document.getElementById('due-date').value;
                const descripcion = document.getElementById('description').value;

                if (!task) {
                    alert('Task Title is required');
                    return;
                }

                const taskData = { task, category, priority, status, date, descripcion };

                try {
                    btnSumit.disabled = true;
                    btnSumit.textContent = 'Saving...';

                    const data = await apiPost('/tasks', taskData);
                    console.log('Tarea guardada:', data);
                    navigate('/task');
                } catch (error) {
                    console.error('Error:', error);
                    alert('Error saving task: ' + error.message);
                } finally {
                    btnSumit.disabled = false;
                    btnSumit.textContent = '💾 Save Task';
                }
            });
        }
    }, 0);

    return Layout('/todo', content, {
        breadcrumb: 'Create Task',
        showNewTaskBtn: false,
        headingTitle: '',
        headingSubtitle: ''
    });
}

