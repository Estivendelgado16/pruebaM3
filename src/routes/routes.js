import { Home } from "../pages/home/home"
import { Login } from "../pages/login/login"
import { Profile } from "../pages/profile/profile"
import { Task } from "../pages/task/task"
import { ToDo } from "../components/toDo/toDo";




const routes = {
    '/': Home,
    '/login': Login,
    '/task': Task,
    '/profile': Profile,
    '/task': Task,
    '/todo': ToDo
}

export function router() {
    const path = window.location.pathname
    const page = routes[path] || Home

    const app = document.getElementById('app')

    app.innerHTML = page()

    window.scrollTo(0,0)
}

export function navigate(path) {
    window.history.pushState({}, '',path)
    router()
}

window.addEventListener('popstate', router)