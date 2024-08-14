import dotenv from "dotenv"
import ConnectDb from "./Src/Db/Dbconnection.js"

dotenv.config({
    path:'.env'
})
ConnectDb()

