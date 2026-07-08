import { Router } from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { createMyAlbum, getMessages, getUserAlbum, getUserAlbums, getUsers } from "../controllers/userControllers.js";

const userRouter = Router();

userRouter.get('/getusers', protectRoute, getUsers);
userRouter.post('/createme', protectRoute, createMyAlbum);
userRouter.get('/myalbums', protectRoute, getUserAlbums);
userRouter.get('/myalbums/:albumId', protectRoute, getUserAlbum);
userRouter.get("/messages/:userId", protectRoute, getMessages);

export default userRouter;