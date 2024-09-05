//Es el documento principal de la API,
//donde se configura el servidor Node y se inicializa la conexión a la base de datos.
import express from "express";
import connection from "./database/connection.js";
import bodyParser from "body-parser";
import cors from "cors";
import UserRoutes from "./routes/user.js";
import PublicationRoutes from "./routes/publication.js";
import FollowRoutes from "./routes/follow.js";
//importamos el módulo path para poder trabajar con rutas de archivos
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

//Mensajde de bienvenida para verificar que el servidor esta corriendo
console.log("API Node en ejecución");

//Inicializamos la conexión a la base de datos
connection();

//Crear el servidor de Node
const app = express();
const port = process.env.PORT || 3900;

//Configurar cors para hacer las peticiones correctamente
app.use(cors({
    origin: '*', // debe ser 'origin' en lugar de 'origen'
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH'], //Metodos permitidos
    preflightContinue: false, //Evitar que se envíen las peticiones OPTIONS
    optionsSuccessStatus: 204 //Para que retorne el status 204
}));

// Decodificar los datos desde los formularios para convertirlos en objetos JS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Configurar las rutas de la API
app.use('/api/user', UserRoutes);
app.use('/api/publication', PublicationRoutes);
app.use('/api/follow', FollowRoutes);

//Configurar la ruta de los archivos estáticos
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Configurar la ruta de archivos estáticos para las imágenes de los avatares
app.use('/uploads/avatars', express.static(path.join(__dirname, 'uploads/avatars')));

//Configurar la ruta de archivos estáticos para las imágenes de las publicaciones
app.use('/uploads/publications', express.static(path.join(__dirname, 'uploads/publications')));

//Ruta de prueba, cuando sea necesario
//app.get('/ruta-prueba', (req, res) => {
//    return res.status(200).json(
//        {
//            'id': 1,
//            'name': 'Juan Manuel',
//          'username': 'jmtc',
//      }
//  );
//});

//Otras configuraciones

//Configurar el servidor Node
app.listen(port, () => {
    console.log(`Servidor Node en ejecución en http://localhost:${port}`);
});

export default app;