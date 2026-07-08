import { Router } from "express";
import { protectRoute, requireAdmin } from "../middleware/authMiddleware.js";
import { addSong, addSongToAlbum, checkAdmin, createAlbum, deleteAlbum, deleteSong } from "../controllers/adminController.js";

const adminRouter = Router();

adminRouter.get('/check', protectRoute, requireAdmin, checkAdmin);

adminRouter.post('/addsong', protectRoute, requireAdmin, addSong);
adminRouter.delete('/deletesong/:songId', protectRoute, requireAdmin, deleteSong);

adminRouter.post('/createalbum', protectRoute, requireAdmin, createAlbum);
adminRouter.post('/addalbumsong/:id', protectRoute, requireAdmin, addSongToAlbum);
adminRouter.delete('/deletealbum/:id', protectRoute, requireAdmin, deleteAlbum);

export default adminRouter;