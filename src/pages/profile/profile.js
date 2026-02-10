import './profile.css'
import { navigate } from "../../routes/routes";

export function Profile() {
    // Configuramos los eventos de navegación después de que el HTML se ha montado en el DOM
    setTimeout(() => {
        // Corregido: eliminado el ")" extra en el id
        const homeBtn = document.getElementById('nav-dashboard');
        const taskBtn = document.getElementById('nav-tasks');

        if (homeBtn) homeBtn.onclick = (e) => {e.preventDefault(); navigate('/')};
        if (taskBtn) taskBtn.onclick = (e) => {e.preventDefault(); navigate('/home')};
    }, 0);


    return`
        <div class="app-layout">
            <aside class="app-sidebar">
                <div class="sidebar-brand">
                    <div class="logo-wrapper">👔</div>
                    <span class="brand-text">CRUDZASO</span>
                </div>
                <nav class="sidebar-menu">
                    <a href="/home" id="nav-dashboard" class="menu-item">
                        <span class="menu-icon">📊</span> Dashboard
                    </a>
                    <a href="/task" id="nav-tasks" class="menu-item">
                        <span class="menu-icon">📋</span> My Tasks
                    </a>
                    <a href="/profile" class="menu-item active">
                        <span class="menu-icon">👤</span> Profile
                    </a>
                </nav>
                <!-- Sección inferior del usuario en la barra lateral -->
                <div class="user-footer">
                    <p>Dr. Sarah J.</p>
                    <span>Admin</span>
                </div>
            </aside>

            <main class="app-main">
                <div class="main-header">
                    <h3>My Profile</h3>
                </div>
                
                <div class="profile-container">
                    <!-- Tarjeta de Info Básica (Izquierda) -->
                    <div class="profile-card basic-info">
                        <img src="https://via.placeholder.com" alt="Profile picture" class="profile-pic" />
                        <p class="user-name">brallam delgado</p>
                        <span class="user-role-badge">System admin</span>
                        <p class="user-email">brallam.delgado@crudzaso.edu</p>
                        
                        <div class="task-summary">
                            <span class="task-count">154</span>
                            <p>Tasks</p>
                        </div>
                    </div>

                    <!-- Tarjeta de Información Personal (Derecha) -->
                    <div class="profile-card personal-details">
                        <div class="details-header">
                            <h4>Personal Information</h4>
                            <a href="#" class="edit-btn">✏️ Edit Profile</a>
                        </div>
                        <div class="details-grid">
                            <!-- Fila 1 -->
                            <div class="detail-item"><strong>Full Name</strong><span>brallam delgado</span></div>
                            <div class="detail-item"><strong>Employee ID</strong><span>CZ-882103</span></div>
                            <!-- Fila 2 -->
                            <div class="detail-item"><strong>Phone</strong><span>+1(555) 123-4567</span></div>
                            <div class="detail-item"><strong>Department</strong><span class="department-badge">Computer Science</span></div>
                            <!-- Fila 3 -->
                            <div class="detail-item"><strong>Role Level</strong><span>Senior Administrator</span></div>
                            <div class="detail-item"><strong>Join Date</strong><span>September 14, 2020</span></div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `;    
}
