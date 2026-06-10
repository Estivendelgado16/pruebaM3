import './login.css'
import { navigate } from '../../routes/routes';

export function Login() {
    setTimeout(() => {
        const btn = document.getElementById('btnIn');
        const loginForm = document.getElementById('login-form');

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const user = document.getElementById('user').value;
            const password = document.getElementById('password').value;

            if (user === 'admin' && password === '1234') {
                console.log('Login correcto');
                navigate("/") 
            } else {
                alert('Credenciales incorrectas');
            }
        });
    }, 0);

    return `
        <div class="login-container">
            <header class="login-header">
                <img src="https://via.placeholder.com/40" alt="Logo" class="logo-icon">
                <span class="brand-name">CRUDZASO</span>
            </header>

            <div class="login-card">
                <h2>Welcome back</h2>
                <p class="subtitle">Enter your credentials to access the platform</p>

                <form id="login-form">
                    <div class="input-group">
                        <label for="user">Email or username</label>
                        <input id="user" placeholder="student@university.edu" type="text" required />
                    </div>

                    <div class="input-group">
                        <label for="password">Password</label>
                        <div class="password-wrapper">
                            <input id="password" placeholder="••••••••" type="password" required />
                            <span class="toggle-password">👁️</span>
                        </div>
                    </div>

                    <a href="#" class="forgot-link">Forgot password?</a>

                    <button type="submit" id="btnIn" class="btn-primary">Sign in</button>
                </form>

                <p class="footer-text">
                    Don't have an account? <a href="#" class="register-link">Register</a>
                </p>
            </div>
        </div>
    `;
}