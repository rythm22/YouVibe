import { Router } from "express";
import { addSongToUserAlbum, deleteSongOfUserAlbum, deleteUserAlbum, getAlbumById, getAllAlbums } from "../controllers/albumController.js";

const albumRouter = Router();

albumRouter.get("/", getAllAlbums);
albumRouter.get("/:albumId", getAlbumById);
albumRouter.post("/addsongs", addSongToUserAlbum);
albumRouter.delete("/delete/album/:albumId", deleteUserAlbum);
albumRouter.delete("/deletesongs", deleteSongOfUserAlbum);


export default albumRouter;