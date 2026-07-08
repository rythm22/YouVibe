import { Message } from "../model/messageModel.js";
import { UserAlbum } from "../model/userAlbumModel.js";
import { User } from "../model/userModel.js"

export const getUsers = async (req, res, next) => {
    try {
        const currentUserId = req.auth.userId
        const users = await User.find({ clerkId: { $ne: currentUserId } });
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export const createMyAlbum = async (req, res, next) => {
    try {
        const { title, songs } = req.body;
        const userId = req.auth.userId;
        const songIds = JSON.parse(songs);

        const user = await User.findOne({ clerkId: userId });

        const newUserAlbum = await UserAlbum.create({
            userId: user._id,
            title: title,
            songs: songIds
        });

        await User.findByIdAndUpdate(user._id, {
            $push: { userAlbums: newUserAlbum._id }
        })

        const populatedAlbum = await UserAlbum.findById(newUserAlbum._id).populate("songs");
        res.status(200).json(populatedAlbum);

    } catch (error) {
        console.error('Error creating your album:', error);
        res.status(500).json({ message: error.message });
    }
}

export const getUserAlbums = async (req, res, next) => {
    try {
        const userId = req.auth.userId;
        const user = await User.findOne({ clerkId: userId });

        const userAlbums = await UserAlbum.find({ userId: user._id }).populate("songs");
        res.status(200).json(userAlbums);
    } catch (error) {
        console.error('Error fetching your albums:', error);
        res.status(500).json({ message: error.message });
    }
}

export const getUserAlbum = async (req, res, next) => {
    try {
        const { albumId } = req.params;

        const userAlbums = await UserAlbum.findById(albumId).populate("songs");
        res.status(200).json(userAlbums);
    } catch (error) {
        console.error('Error fetching your albums:', error);
        res.status(500).json({ message: error.message });
    }
}

export const getMessages = async (req, res, next) => {
    try {
        const myId = req.auth.userId;
        const { userId } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: myId },
                { senderId: myId, receiverId: userId }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.log(error);
        next();
    }
}