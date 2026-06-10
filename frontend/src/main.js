import { router } from './routes/routes'
import './style.css'

// Esperar a que exista #app antes de renderizar
window.addEventListener('DOMContentLoaded', () => {
  router()
})


