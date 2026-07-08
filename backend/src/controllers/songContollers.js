import { Album } from "../model/albumModel.js";
import { Song } from "../model/songModel.js";
import { UserAlbum } from "../model/userAlbumModel.js";

export const getAllSongs = async (req, res, next) => {
    try {
        // -1 = Descending => newest -> oldest
        // 1 = Ascending => oldest -> newest
        const songs = await Song.find().sort({ createdAt: -1 });
        res.json(songs);
    } catch (error) {
        next(error);
    }
};

export const getFeaturedSongs = async (req, res, next) => {
    try {
        const songs = await Song.aggregate([
            {
                $sample: { size: 8 },
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1,
                }
            }
        ]);

        res.json(songs);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export const getSongsMadeForYou = async (req, res, next) => {
    try {
        const songs = await Song.aggregate([
            {
                $sample: { size: 5 },
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1,
                }
            }
        ]);

        res.json(songs);
    } catch (error) {
        console.log(error);
        next(error);
    }
}


export const getTrendingSongs = async (req, res, next) => {
    try {
        const songs = await Song.aggregate([
            {
                $sample: { size: 5 },
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1,
                }
            }
        ]);

        res.json(songs);
    } catch (error) {
        console.log(error);
        next(error);
    }
}



export const songOfAlbum = async (req, res, next) => {
    try {
        const { albumId } = req.params;
        const album = await Album.findById(albumId).populate("songs");
        let songs;

        if (album.songs) {
            songs = album.songs;
        } else {
            res.status(401).json({ success: false, message: "No songs available" });
        }

        return res.status(200).json(songs);

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


export const deleteSongOfAlbum = async (req, res, next) => {
    try {
        const { albumId, songId } = req.body;
        const album = await Album.findByIdAndUpdate(albumId,
            { $pull: { songs: songId } },
            { new: true }
        );

        return res.json(album.songs);

    } catch (error) {
        console.log(error);
        return res.status(501).json({ success: false, message: "Internal server error" });
    }
}


export const songOfUserAlbum = async (req, res, next) => {
    try {
        const { albumId } = req.params;
        const album = await UserAlbum.findById(albumId).populate("songs");
        let songs;

        if (album.songs) {
            songs = album.songs;
        } else {
            res.status(401).json({ success: false, message: "No songs available" });
        }

        return res.status(200).json(songs);

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}