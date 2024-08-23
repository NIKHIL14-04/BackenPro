import express, { urlencoded } from "express"
import cors from "cors"
import cookiesParser from "cookie-parser"
const app  = express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit:"16KB"}))
app.use(urlencoded({limit:"16KB",extended:true}))
app.use(express.static("Public"))
app.use(cookiesParser())

// import Router
import UserRouter from "./Routes/User.Router.js"
app.use("/user",UserRouter)

export default app;