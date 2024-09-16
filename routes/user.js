import { Router } from "express";
const router = Router();
import { testUser, register, login, profile, listUsers, updateUser, uploadAvatar, avatar, counters } from "../controllers/user.js";
import { ensureAuth } from "../middlewares/auth.js";
import multer from "multer";
import { checkEntityExists } from "../middlewares/checkEntityExists.js"
import User from "../models/user.js";

//Configuracion de subida de archivos
const storage = multer.diskStorage({
    //Configurar donde se guardaran los archivos
    destination: (req, file, cb) => {
        cb(null, './uploads/avatars');
    },
    //Configurar el nombre del archivo
    filename: (req, file, cb) => {
        cb(null, "avatar_" + Date.now() + "_" + file.originalname);
    }
});

const uploads = multer({ storage });

//Definir las rutas para este user
router.get('/test-user', ensureAuth,testUser); //Solo cuando se quiera probar
// .get es para hacer pruebas
router.post('/register', register);
router.post('/login', login); //endpoint
router.get('/profile/:id', ensureAuth, profile);
router.get('/list/:page?', ensureAuth, listUsers);
router.put('/update/', ensureAuth, updateUser);
router.post('/upload-image', [ensureAuth, checkEntityExists(User, 'user_id'),uploads.single("file0")], uploadAvatar);
router.get('/avatar/:file', avatar);
router.get('/counters/:id?', ensureAuth, counters);

//Exportar el router
export default router;
//No quiere subir imagenes