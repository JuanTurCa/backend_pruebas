import { Router } from "express";
const router = Router();
import { login, register, testUser, profile, listUsers} from "../controllers/user.js";
import { ensureAuth } from "../middlewares/auth.js";


//Definir las rutas para este user
router.get('/test-user', ensureAuth,testUser); //Solo cuando se quiera probar
// .get es para hacer pruebas
router.post('/register', register);
router.post('/login', login); //endpoint
router.get('/profile/:id', ensureAuth, profile);
router.get('/list/:page?', ensureAuth, listUsers);

//Exportar el router
export default router;