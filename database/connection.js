import { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connection = async () => {
    try {
    await connect(process.env.MONGODB_URI);
    console.log("Database connected successfully to db_social");
    } catch (error) {
        console.log("Error while connecting to database", error);
        throw new Error("Error while connecting to database");
    }
}

export default connection;