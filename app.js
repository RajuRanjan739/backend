import express  from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import userRouter from "./routes/user_routes";
import adminRouter from "./routes/admin_routes";
import movieRouter from "./routes/movie_routes";
import bookingsRouter from "./routes/booking_routes";
import cors from "cors";
dotenv.config();
const app= express()
const PORT= process.env.PORT || 5000

//middlewares
app.use(express.json());
app.use("/user",userRouter);
app.use("/admin",adminRouter);
app.use("/movie",movieRouter);
app.use("/booking",bookingsRouter)
app.use(cors({"origin": "*",
"methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
"preflightContinue": false,
"optionsSuccessStatus": 204,
}));

app.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials","true");
  res.send("API is running..");
});


mongoose.connect(`mongodb+srv://admin:${process.env.Mongo_Password}@cluster0.rmqe3zu.mongodb.net/?retryWrites=true&w=majority`
)
.then(()=>app.listen(PORT,()=>console.log("connected server to database")
)
)
.catch((e)=>console.log(e))

