import jwt from 'jwt-simple';
import moment from 'moment';
import dotenv from 'dotenv';

//Cargar las variables de entorno desde el archivo .env
dotenv.config();

//Clave secreta para el token
const secret = process.env.secret;

//Generar el token
const createToken = (user) => {
    //Contiene toda la informacion del usuario
    const payload = {
        userId: user._id, //Este id es el que se genera automaticamente en la bd de MongoDB
        name: user.name,
        role: user.role,
        //Fecha de creacion del token -> Contiene formato Unix
        iat: moment().unix(),
        exp: moment().add(15, 'days').unix() //Fecha de expiracion del token
    };
    //Retornar el token
    return jwt.encode(payload, secret);
};

export {
    secret,
    createToken
};