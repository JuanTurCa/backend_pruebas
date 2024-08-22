import { Router } from "express";
const router = Router();
import { testUser } from "../controllers/user.js";

//Definir las rutas para este user
router.get('/test-user', testUser);

//Exportar el router
export default router;