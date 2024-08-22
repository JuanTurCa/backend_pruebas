//Es el documento principal de la API,
//donde se configura el servidor Node y se inicializa la conexión a la base de datos.
import express from "express";
import connection from "./database/connection.js";

//Mensajde de bienvenida para verificar que el servidor esta corriendo
console.log("API Node en ejecución");

//Inicializamos la conexión a la base de datos
connection();

//Crear el servidor de Node
const app = express();
const port = process.env.PORT || 3900;

//Otras configuraciones

//Configurar el servidor Node
app.listen(port, () => {
    console.log(`Servidor Node en ejecución en http://localhost:${port}`);
});

export default app;