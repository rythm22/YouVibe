import cloudinary from "../lib/cloudinary.js";
import { Album } from "../model/albumModel.js";
import { Song } from "../model/songModel.js";
import { UserAlbum } from "../model/userAlbumModel.js";

const uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: "auto",
        })
        return result.secure_url;
    } catch (error) {
        console.log(error);
    }
}

export const addSong = async (req, res, next) => {
    try {
        if (!req.files || !req.files.audioFile || !req.files.imageFile) {
            return resizeBy.status(400).json({ success: false, message: "Please upload all required files" });
        }

        const { title, artist, albumId, duration } = req.body;
        const audioFile = req.files.audioFile;
        const imageFile = req.files.imageFile;

        const audioUrl = await uploadToCloudinary(audioFile);
        const imageUrl = await uploadToCloudinary(imageFile);

        const song = new Song({
            title,
            artist,
            duration,
            audioUrl,
            imageUrl,
            albumId: albumId || null
        });

        await song.save();
        if (albumId) {
            await Album.findByIdAndUpdate(albumId, {
                $push: { songs: song._id },
            })
        }

        return res.status(201).json(song);
    } catch (error) {
        console.log("Something went wrong!", error);
        next(error);
    }
}

export const addSongToAlbum = async (req, res, next) => {
    try {
        const { albumId, songs } = req.body;
        const songIds = JSON.parse(songs);

        const album = await Album.findById(albumId);
        if (!album) return res.status(401).json({ success: false, message: "Invalid albumId" })

        const updatedAlbum = await Album.findByIdAndUpdate(albumId, {
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

export const deleteSong = async (req, res, next) => {
    try {
        const songId = req.params.songId;
        const song = await Song.findById(songId);
        if (!song) {
            return res.status(404).json({ success: false, message: "Song not found" });
        }

        await Album.updateMany(
            { songs: songId },
            { $pull: { songs: songId } }
        );

        await UserAlbum.updateMany(
            { songs: songId },
            { $pull: { songs: songId } }
        );

        await Song.findByIdAndDelete(songId);
        res.status(200).json({ success: true, message: "Song deleted successfully" });

    } catch (error) {
        console.error("Error deleting song:", error);
        res.status(500).json({ success: false, message: "Server error" });
        next(error);
    }
};

export const createAlbum = async (req, res, next) => {
    try {
        const { title, artist, releaseYear } = req.body;
        const { imageFile } = req.files;

        const imageUrl = await uploadToCloudinary(imageFile);

        const album = new Album({
            title,
            artist,
            imageUrl,
            releaseYear,
        });

        await album.save();

        res.status(201).json(album);
    } catch (error) {
        console.log("Error in createAlbum", error);
        next(error);
    }
};


export const deleteAlbum = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Album.findByIdAndDelete(id);
        res.status(200).json({ message: "Album deleted successfully" });
    } catch (error) {
        console.log("Error in deleteAlbum", error);
        next(error);
    }
};

export const checkAdmin = async (req, res, next) => {
    res.status(200).json({ admin: true });
};