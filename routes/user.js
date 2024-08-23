import { Router } from "express";
const router = Router();
import { register } from "../controllers/user.js";

//Definir las rutas para este user
//router.get('/test-user', testUser); Solo cuando se quiera probar
// .get es para hacer pruebas
router.post('/register', register);

//Exportar el router
export default router;