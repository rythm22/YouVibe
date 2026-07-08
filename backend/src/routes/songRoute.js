import { Router } from "express";
import { deleteSongOfAlbum, getAllSongs, getFeaturedSongs, getSongsMadeForYou, getTrendingSongs, songOfAlbum, songOfUserAlbum } from "../controllers/songContollers.js";
import { protectRoute, requireAdmin } from "../middleware/authMiddleware.js";

const songRouter = Router();

songRouter.get('/allsongs', protectRoute, getAllSongs);
songRouter.get('/featured-songs', getFeaturedSongs);
songRouter.get('/made-for-you', getSongsMadeForYou);
songRouter.get('/trending-songs', getTrendingSongs);
songRouter.get('/songs-album/:albumId', protectRoute, songOfAlbum);
songRouter.get('/songs-useralbum/:albumId', protectRoute, songOfUserAlbum);

songRouter.delete('/songs-album/delete', protectRoute, requireAdmin, deleteSongOfAlbum);

export default songRouter;