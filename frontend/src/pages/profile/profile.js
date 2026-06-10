import './profile.css';
import { Layout } from '../../components/layout/layout';

export function Profile() {
    const content = `
        <div class="profile-container">
            <!-- Tarjeta de Info Básica (Izquierda) -->
            <div class="profile-card basic-info">
                <img src="https://via.placeholder.com/100" alt="Profile picture" class="profile-pic" />
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
    `;

    return Layout('/profile', content, {
        breadcrumb: 'Profile',
        showNewTaskBtn: false,
        headingTitle: 'My Profile',
        headingSubtitle: ''
    });
}

