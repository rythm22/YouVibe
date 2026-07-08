import express from "express";
import dotenv from "dotenv";
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node'; 
import fileUpload from "express-fileupload"
import path from "path";
import userRouter from "./routes/userRoute.js";
import authRouter from "./routes/authRoute.js";
import adminRouter from "./routes/adminRoute.js";
import songRouter from "./routes/songRoute.js";
import albumRouter from "./routes/albumRoute.js";
import statRouter from "./routes/statRoute.js"; 
import cors from "cors"
import { connectDB } from "./lib/db.js";
import { createServer } from "http";
import { initializeSocket } from "./lib/socket.js";

dotenv.config();

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT;

const httpServer = createServer(app);
initializeSocket(httpServer);

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());

app.use(ClerkExpressWithAuth());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10mb max file
    }
}))

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/songs", songRouter);
app.use("/api/albums", albumRouter);

app.use("/api/stats", statRouter);

app.use((err, req, res, next) => {
    res.status(500).json({ message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message });
})

httpServer.listen(PORT, () => {
    console.log(`Running on PORT ${PORT}`);
    connectDB();
})