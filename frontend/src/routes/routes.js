import { Home } from "../pages/home/home"
import { Login } from "../pages/login/login"
import { Profile } from "../pages/profile/profile"
import { Task } from "../pages/task/task"
import { ToDo } from "../components/toDo/toDo";

const routes = {
    '/': Home,
    '/home': Home,
    '/login': Login,
    '/task': Task,
    '/profile': Profile,
    '/todo': ToDo
}

export function router() {
    try {
        const path = window.location.pathname
        const page = routes[path] || Home

        const app = document.getElementById('app')
        if (!app) {
            // Si no existe #app, evitamos excepción silenciosa
            console.error('Missing #app element')
            document.body.innerHTML = '<pre style="color:#ef4444; padding:1rem;">Error: no existe el elemento #app</pre>'
            return
        }

        app.innerHTML = page()
        window.scrollTo(0, 0)
    } catch (err) {
        console.error('Render error:', err)
        const app = document.getElementById('app')
        if (app) {
            app.innerHTML = `<pre style="color:#ef4444; padding:1rem; white-space:pre-wrap;">Error renderizando la página: ${err?.message || err}</pre>`
        }
    }
}


export function navigate(path) {
    window.history.pushState({}, '',path)
    router()
}

window.addEventListener('popstate', router)