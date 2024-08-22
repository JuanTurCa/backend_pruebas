import { Router } from "express";
const router = Router();
import { testFollow } from "../controllers1/follow";

//Definir las rutas para este user
router.get('/test-follow', testFollow);

//Exportar el router
export default router;