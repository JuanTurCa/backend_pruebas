import { Router } from "express";
const router = Router();
import { testPublication } from "../controllers/publication.js";

//Definir las rutas para este user
router.get('/test-publication', testPublication);

//Exportar el router
export default router;
