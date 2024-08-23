import dotenv from "dotenv"
import ConnectDb from "./Src/Db/Dbconnection.js"
import app from "./Src/App.js"
dotenv.config({path:'./.env'})
const port = process.env.PORT_ADDRESS || 8000;

ConnectDb().then((res)=>{
    app.listen(port,()=>{
        console.log(`server is rining at port : ${port}`)
    })
}).catch((error)=>{
    console.log(`mongodb connnetion failed : ${error.message}` )
})

