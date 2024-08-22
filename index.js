//Es el documento principal de la API,
//donde se configura el servidor Node y se inicializa la conexión a la base de datos.
import express from "express";
import connection from "./database/connection.js";
import bodyParser from "body-parser";
import cors from "cors";

//Mensajde de bienvenida para verificar que el servidor esta corriendo
console.log("API Node en ejecución");

//Inicializamos la conexión a la base de datos
connection();

//Crear el servidor de Node
const app = express();
const port = process.env.PORT || 3900;

//Configurar cors para hacer las peticiones correctamente
app.use(cors({
    origen: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'] //Métodos permitidos para las peticiones
}));

// Decodificar los datos desde los formularios para convertirlos en objetos JS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Configurar las rutas de la API
//Ruta de prueba
app.get('/ruta-prueba', (req, res) => {
    return res.status(200).json(
        {
        'id': 1,
        'name': 'Juan Manuel',
        'username': 'jmtc',
        }
    );
});

//Otras configuraciones

//Configurar el servidor Node
app.listen(port, () => {
    console.log(`Servidor Node en ejecución en http://localhost:${port}`);
});

export default app;