import User from "../models/user.js";
import bcrypt from "bcrypt"; //Libreria para cifrar contraseñas
import { createToken } from "../services/jwt.js";
import fs from "fs";
import path from "path";
import { followThisUser } from "../services/followServices.js";

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
                { email: user_to_save.email.toLowerCase() },
                { nick: user_to_save.nick.toLowerCase() }
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
    } catch (error) {
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
    try {
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
        const user = await User.findOne({ email: params.email.toLowerCase() });

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

    } catch (error) {
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

        // Verificar si el usuario autenticado esta disponible
        if(!req.user || !req.user.userId){
            return res.status(401).send({
                status: "error",
                message: "Usuario no autenticado"
            });
        }

        //Buscar el usuario en la base de datos y excluimos los datos que no queremos mostrar
        const userProfile = await User.findById(userId).select("-password -__v -role -created_at -email");

        //Verificar si el usuario no existe
        if (!userProfile) {
            return res.status(404).send({
                status: "error",
                message: "Usuario no encontrado"
            });
        }

        //Informacion del seguimiento
        const followInfo = await followThisUser(req.user.userId, userId);

        //Devolver la informacion del perfil del usuario
        return res.status(200).json({
            status: "success",
            user: userProfile,
            followInfo
        });
    } catch (error) {
        //Manejo de errores
        console.log("Error al obtener el perfil de usuario", error);
        return res.status(500).send({
            status: "error",
            message: "Error al obtener el perfil de usuario"
        });
    }
};

//Metodo para mostrar todos los usuarios con Paginación de MongoDB
export const listUsers = async (req, res) => {
    try {
        //Gestinar paginas
        //Controlar la pagina actual, la que se este solicitando
        let page = req.params.page || 1; //Si no se recibe el parametro de la pagina se pone la 1
        //let page = rep.params.page ? parseInt(req.params.page, 10) : 1; //Si se recibe el parametro de la pagina se convierte a entero

        //Configurar los items por pagina
        let itemsPerPage = req.query.limit ? parseInt(req.query.limit, 10) : 2; //Si no se recibe el parametro de items por pagina se pone 3

        //Realizar consulta paginada
        const opcions = {
            page: page,
            limit: itemsPerPage,
            select: "-password -email -role -__v",
        };
        const users = await User.paginate({}, opcions);

        //Si no hay usuarios disponibles en mongoDB
        if (!users || users.docs.length === 0) {
            return res.status(404).send({
                status: "error",
                message: "No hay usuarios disponibles"
            });
        }

        //De donde salen estos datos??
        //Devolver la consulta paginada (para FrontEnd)
        return res.status(200).send({
            status: "success",
            //Como se va ver el resultado en el FrontEnd paginado
            users: users.docs,
            totalDocs: users.totalDocs,
            totalPages: users.totalPages,
            currentPage: users.page
        });

    } catch (error) {
        //Manejo de errores
        console.log("Error al obtener la lista de usuarios", error);
        return res.status(500).send({
            status: "error",
            message: "Error al obtener la lista de usuarios"
        });
    }
};

//Metodo para actualizar los datos de si mismo (usuario autenticado)
export const updateUser = async (req, res) => {
    try {
        //Obtener la informacion del usuario a actualizar
        let userIdentity = req.user;
        let userToUpdate = req.body;

        //Eliminar campos que no se pueden actualizar
        delete userToUpdate.iat;
        delete userToUpdate.exp;
        delete userToUpdate.role;

        //Comprobar si el usuario ya existe
        const users = await User.find({
            $or: [
                { email: userToUpdate.email },
                { nick: userToUpdate.nick }
            ]
        }).exec(); //Ejecutar la consulta

        //Verificar si el usuario esta duplicado y evitar que se actualice
        const isDuplicateUser = users.some(user => {
            return user && user._id.toString() !== userIdentity._id.toString();
        });

        if (isDuplicateUser) {
            return res.status(409).send({
                status: "error",
                message: "Solo puedes actualizar tu cuenta"
            });
        }

        //Cifrar la contraseña si se proporciona
        if (userToUpdate.password) {
            try {
                let pwd = await bcrypt.hash(userToUpdate.password, 10);
                userToUpdate.password = pwd;
            } catch (hashError) {
                return res.status(500).send({
                    status: "error",
                    message: "Error al cifrar la contraseña"
                });
            }
        } else {
            delete userToUpdate.password;
        }

        //Buscar y actualizar el usuario en la base de datos mongoDB
        let userUpdated = await User.findByIdAndUpdate(userIdentity.userId, userToUpdate, { new: true });
        if (!userUpdated) {
            return res.status(404).send({
                status: "error",
                message: "No se ha podido actualizar el usuario"
            });
        }

        //Devolver el usuario actualizado
        return res.status(200).send({
            status: "success",
            message: "El usuario se ha actualizado correctamente",
            user: userUpdated
        });
    } catch (error) {
        //Manejo de errores
        console.log("Error al actualizar el usuario", error);
        return res.status(500).send({
            status: "error",
            message: "Error al actualizar el usuario"
        });
    }
};

// Método para subir AVATAR (imagen de perfil) y actualizar el campo image del User
export const uploadAvatar = async (req, res) => {
    try {
      // Obtener el archivo de la imagen y comprobar si existe
      if(!req.file){
        return res.status(404).send({
          status: "error",
          message: "Error la petición no incluye la imagen"
        });
      }

      // Obtener el nombre del archivo
      let image = req.file.originalname;

      // Obtener la extensión del archivo
      const imageSplit = image.split(".");
      const extension = imageSplit[imageSplit.length -1];

      // Validar la extensión
      if(!["png", "jpg", "jpeg", "gif"].includes(extension.toLowerCase())){
        // Borrar archivo subido
        const filePath = req.file.path;
        fs.unlinkSync(filePath);
        return res.status(404).send({
          status: "error",
          message: "Extensión del archivo inválida. Solo se permite: png, jpg, jpeg, gif"
        });
      }
      // Comprobar tamaño del archivo (pj: máximo 1MB)
      const fileSize = req.file.size;
      const maxFileSize = 1 * 1024 * 1024; // 1 MB

      if (fileSize > maxFileSize) {
        const filePath = req.file.path;
        fs.unlinkSync(filePath);

        return res.status(400).send({
          status: "error",
          message: "El tamaño del archivo excede el límite (máx 1 MB)"
        });
      }

      // Guardar la imagen en la BD
      const userUpdated = await User.findOneAndUpdate(
        {_id: req.user.userId},
        { image: req.file.filename },
        { new: true}
      );

      console.log("userUpdated", userUpdated.name);
      // verificar si la actualización fue exitosa
      if (!userUpdated) {
        return res.status(500).send({
          status: "error",
          message: "Eror en la subida de la imagen"
        });
      }

      // Devolver respuesta exitosa
      return res.status(200).json({
        status: "success",
        user: userUpdated,
        file: req.file
      });

    } catch (error) {
      console.log("Error al subir archivos", error)
      return res.status(500).send({
        status: "error",
        message: "Error al subir archivos"
      });
    }
  }

  //Metodo para mostrar la imagen de perfil de un usuario
  export const avatar = async (req, res) => {
    try{
        //Obtener el parametro del archivo desde la url
        const file = req.params.file;

        //Const filePath
        const filePath = `./uploads/avatars/${file}`; //Ruta del archivo

        //Comprobar si el archivo existe
        fs.stat(filePath, (error, exists) => {
            if(!filePath){
                return res.status(404).send({
                    status: "error",
                    message: "La imagen no existe"
                });
            }

            //Devolver la imagen
            return res.sendFile(path.resolve(filePath));
        });

    }catch(error){
        //Manejo de errores
        console.log("Error al obtener la imagen de perfil", error);
        return res.status(500).send({
            status: "error",
            message: "Error al obtener la imagen de perfil"
        });
    }
  };