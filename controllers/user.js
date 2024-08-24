import User from "../models/user.js";
import bcrypt from "bcrypt"; //Libreria para cifrar contraseñas
import { createToken } from "../services/jwt.js";

//Metodo de prueba
export const testUser = (req, res) => {
    return res.status(200).send({
        message: "Test User Controller, send from user.js",
        user: req.user
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
        user_to_save.email = params.email.toLowerCase();

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

//Metodo - Login de usuario usando JWT (Json Web Token)
export const login = async (req, res) => {
    try{
        //Obtener los datos de la peticion para los datos del usuario
        let params = req.body;

        //Validaciones de los datos obtendios
        if (!params.email || !params.password) {
            return res.status(400).send({
                status: "error",
                message: "Faltan datos por enviar"
            });
        }

        //Buscar el usuario en la base de datos: email recibido
        //Filtro con MongoDB y el Schema
        const user = await User.findOne({email: params.email.toLowerCase()});

        //Si no existe el usuario
        if (!user) {
            return res.status(404).send({
                status: "error",
                message: "El usuario no encontrado"
            });
        }

        //Comparar la contraseña cifrada
        //bcrypt.compare() compara la contraseña que recibe con la del usuario en MongoDB
        const validPassword = await bcrypt.compare(params.password, user.password);
        //Si la contraseña no es valida
        if (!validPassword) {
            return res.status(401).send({
                status: "error",
                message: "La contraseña no es valida"
            });
        }

        //Generar el token de autenticacion
        const token = createToken(user);
        //Devolver el token generado y el usuario autenticado
        return res.status(200).json({
            status: "success",
            mesagge: "Login Exitoso",
            token,
            user: {
                id: user._id,
                name: user.name,
                last_name: user.last_name,
                email: user.email,
                nick: user.nick,
                image: user.image,
                created_at: user.created_at
            }
        });

    }catch(error){
        //Manejo de errores
        console.log("Error en el login de usuario", error);
        return res.status(500).send({
            status: "error",
            message: "Error en la autenticación usuario ?"
        });

    }
}

//Metodo para mostrar el perfil de un usuario
export const profile = async (req, res) => {
    try {
        //Obtener el id del usuario desde la url petición
        const userId = req.params.id;

        //Buscar el usuario en la base de datos y excluimos los datos que no queremos mostrar
        const user = await User.findById(userId).select("-password -__v -role -created_at -email");

        //Verificar si el usuario existe
        if (!user) {
            return res.status(404).send({
                status: "error",
                message: "Usuario no encontrado"
            });
        }

        //Devolver el usuario encontrado
        return res.status(200).json({
            status: "success",
            user
        });


        return res.status(200).send({
            status: "success",
            message: "Metodo Profile",
        });

    }catch(error){
        //Manejo de errores
        console.log("Error al obtener el perfil de usuario", error);
        return res.status(500).send({
            status: "error",
            message: "Error al obtener el perfil de usuario"
        });
    }
};