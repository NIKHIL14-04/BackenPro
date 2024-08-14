import mongoose from "mongoose";
import { DataBase_Name } from "../Constants.js";

const ConnectDb = async()=>{
    try {
        const ConnectionInstans = await mongoose.connect(`${process.env.MONGODB_URL}/${DataBase_Name}`)
        console.log(`connnection successfully ! ${ConnectionInstans.connection.host}`)
    } catch (error) {
       console.log(`connection error :`+ error)
       throw error
    }
}

export default ConnectDb;