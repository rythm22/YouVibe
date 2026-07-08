import mongoose from "mongoose";

const userAlbumSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

export const UserAlbum = mongoose.model("UserAlbum", userAlbumSchema);