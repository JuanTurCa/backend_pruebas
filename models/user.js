import { Schema, model } from "mongoose";

// Modelo que se usa para la colección de usuarios en la base de datos
const UserSchema = Schema({
    name: {type: String, required: true},
    last_name: {type: String, required: true},
    nick: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    bio: String, //Como solo tiene un elemento va sin llaves
    password: {type: String, required: true},
    role: {type: String, default:"role_user"},
    image: {type: String, default: "avatar.png"},
    created_at: {type: Date, default: Date.now},
});

// Exporta el modelo UserSchema con el nombre User
export default model("User", UserSchema, "users");
//"User" es el nombre del modelo
//UserSchema es el esquema
//"users" es el nombre de la colección en la base de datos (MongoDB)