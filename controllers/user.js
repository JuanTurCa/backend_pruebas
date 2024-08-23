import User from "../models/user.js";
import bcrypt from "bcrypt"; //Libreria para cifrar contraseñas

//Metodo de prueba
export const testUser = (req, res) => {
    return res.status(200).send({
        message: "Test User Controller, send from user.js"
    });
}

//Metodo - Registro de usuario
export const register = async (req, res) => {
    try {
        //Obtener los datos de la peticion para los datos del usuario
        let params = req.body;
        //Validaciones de los datos obtendios
        if (!params.name || !params.last_name || !params.nick || !params.email ||
            !params.password) {
            return res.status(400).send({
                status: "error",
                message: "Faltan datos por enviar"
            });
        }
        //Crar el objeto del usuario con los datos recibidos
        let user_to_save = new User(params);
        //Busca si ya existe algun atributo necesario y si existe devuelve un mesaje
        const existingUser = await User.findOne({
            $or: [
                {email: user_to_save.email.toLowerCase()},
                {nick: user_to_save.nick.toLowerCase()}
            ]
        });

        if (existingUser) {
            return res.status(409).send({
                status: "error",
                message: "El usuario ya esta registrado"
            });
        }
        //Cifrar la contraseña si no existe
        const salt = await bcrypt.genSalt(10); //Genera un # de saltos
        const hashedPassword = await bcrypt.hash(params.password, salt); //Cifra la contraseña
        user_to_save.password = hashedPassword; //Guarda la contraseña cifrada
        //Guardar los datos en la base de datos
        await user_to_save.save();
        //Devolver el usuario registrado
        return res.status(200).json({
            status: "success",
            mesagge: "Registro Exitoso",
            params,
            user_to_save
        });
    }catch(error){
        //Manejo de errores
        console.log("Error en el registro de usuario", error);
        return res.status(500).send({
            status: "error",
            message: "Error en el servidor"
        });
    }
}


