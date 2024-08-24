//Importar modulos
import jwt from 'jwt-simple';
import moment from 'moment';
import { secret } from '../services/jwt.js'; //Importar la clave secreta


//Funcion de autenticacion
export const ensureAuth = (req, res, next) => {

    //Comprobar si llega la cabecera de autorizacion
    if(!req.headers.authorization){
        return res.status(403).send({
            status: "error",
            message: "La peticion no tiene la cabecera de autorizacion"
        });

    }
    //Limpiar el token y quitar comillas
    const token = req.headers.authorization.replace(/['"]+/g, '').replace("Bearer ", "");

    try{
        //Decodificar el token
        let payload = jwt.decode(token, secret);

        //Comprobar si el token ha expirado (fecha de expiracion)
        if(payload.exp <= moment().unix()){
            return res.status(401).send({
                status: "error",
                message: "El token ha expirado"
            });
        }

        //Se agrega datos del usuario
        req.user = payload;
    }
    catch(error){
        return res.status(404).send({
            status: "error",
            message: "El token no es valido"
        });
    }

    //Pasar a la accion siguiente (Metodo)
    next();
};