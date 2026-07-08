import { Album } from "../model/albumModel.js";
import { UserAlbum } from "../model/userAlbumModel.js";

export const getAllAlbums = async (req, res, next) => {
    try {
        const albums = await Album.find();
        res.status(200).json(albums);
    } catch (error) {
        next(error);
    }
};


export const getAlbumById = async (req, res, next) => {
    try {
        const { albumId } = req.params;
        const album = await Album.findById(albumId).populate("songs");

        if (!album) {
            return res.status(404).json({ message: "Album not found" });
        }

        res.status(200).json(album);
    } catch (error) {
        console.log(error);
        next(error);
    }
};


export const addSongToUserAlbum = async (req, res, next) => {
    try {
        const { albumId, songs } = req.body;
        const songIds = JSON.parse(songs);

        const album = await UserAlbum.findById(albumId);
        if (!album) return res.status(401).json({ success: false, message: "Invalid albumId" })

        const updatedAlbum = await UserAlbum.findByIdAndUpdate(albumId, {
            $addToSet: { songs: songIds }
        },
            { new: true },
        );

        res.status(200).json(updatedAlbum);

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
}


export const deleteSongOfUserAlbum = async (req, res, next) => {
    try {
        const { albumId, songId } = req.body;
        const album = await UserAlbum.findByIdAndUpdate(albumId,
            { $pull: { songs: songId } },
            { new: true }
        );

        return res.json(album.songs);

    } catch (error) {
        console.log(error);
        return res.status(501).json({ success: false, message: "Internal server error" });
    }
}


export const deleteUserAlbum = async (req, res, next) => {
    try {
        const { albumId } = req.params;
        const album = await UserAlbum.findByIdAndDelete(albumId);
        return res.status(200).json({ success: true, message: "Album has been deleted" });

    } catch (error) {
        console.log(error);
        res.status(501).json({ success: false, message: "Internal server error" });
    }
}