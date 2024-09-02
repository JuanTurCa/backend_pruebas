//Importaciones
import { Router } from "express";
const router = Router();
import { following, testFollow, saveFollow, unfollow, followers } from "../controllers/follow.js";
import { ensureAuth } from "../middlewares/auth.js";

//Definir las rutas para Follow
router.get('/test-follow', testFollow);
router.post('/follow', ensureAuth, saveFollow);
router.delete('/unfollow/:id', ensureAuth, unfollow);
router.get('/following/:id?/:page?', ensureAuth, following);
router.get('/followers/:id?/:page?', ensureAuth, followers);

//Exportar el router
export default router;