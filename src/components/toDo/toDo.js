import './task.css';

export function ToDo(){

    setTimeout(() => {
        const btnSumit = document.getElementById('btnSumit')

        btnSumit.addEventListener('click', ()=>{
            

            const task = document.getElementById('task-title').value
            const category = document.getElementById('category').value
            const priority = document.getElementById('priority').value
            const status = document.getElementById('status').value
            const date = document.getElementById('due-date').value
            const descripcion = document.getElementById('description').value

            const tasks = {
                task: task,
                category: category,
                priority: priority,
                status: status,
                date: date,
                descripcion: descripcion
            }

            fetch('http://localhost:3000/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tasks)
            })
            .then(res => res.json())
            .then(data => {
                console.log('Tarea guardada:', data)
            })
            .catch(error => {
                console.error('Error:', error)
            })
            
        })    
    }, 0);    



    return`
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
        <div class="main-header-task">
            <a href="#" class="back-link">← Back to Tasks</a>
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
                        <input id="category" type="text"/>
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
                        <input type="date" id="due-date" placeholder="mm/dd/yyyy">
                    </div>
                </div>

                <!-- Description Field -->
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" rows="5" placeholder="Add details about this task..."></textarea>
                </div>

                <!-- Action Buttons -->
                <div class="form-actions">
                    <button type="button" class="btn-cancel">Cancel</button>
                    <button id="btnSumit" type="submit" class="btn-save">💾 Save Task</button>
                </div>
            </form>
        </div>
    </main>

    </div>
    `
}