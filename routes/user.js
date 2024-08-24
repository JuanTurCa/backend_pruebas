import { Router } from "express";
const router = Router();
import { login, register, testUser} from "../controllers/user.js";
import { ensureAuth } from "../middlewares/auth.js";


//Definir las rutas para este user
router.get('/test-user', ensureAuth,testUser); //Solo cuando se quiera probar
// .get es para hacer pruebas
router.post('/register', register);
router.post('/login', login); //endpoint

//Exportar el router
export default router;