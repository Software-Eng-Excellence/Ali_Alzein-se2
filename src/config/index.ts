import dotenv from "dotenv"
import path from "path"
import { DBMode } from "../config/types"
import { StringValue } from "ms";

dotenv.config({path: path.join(__dirname, '../../.env')})

export default{
    logDir: process.env.LOG_DIR || "./logs",
    isDev: process.env.NODE_ENV === "development",
    isProduction: process.env.NODE_ENV === "production",
    storagePath: {
        csv:{
            cake: "src/data/cake orders.csv"
        },
        xml:{
            toy: "src/data/toy orders.xml"
        },
        json:{
            book: "src/data/book orders.json"
        },
        sqlite: "src/data/orders.db"
<<<<<<< HEAD
        
=======
    },

    port: parseInt(process.env.PORT || '') || 3000,
    host: process.env.HOST || "localhost",
    dbMode: DBMode.POSTGRESQL,

    auth:{
    jwtSecret: process.env.JWT_SECRET || "secretkey",
    tokenExpiration: (process.env.TOKEN_EXPIRATION || "20m") as StringValue,
    refreshTokenExpiration: (process.env.REFRESH_TOKEN_EXPIRATION || "7d") as StringValue
>>>>>>> module-4.1
    }
    
}