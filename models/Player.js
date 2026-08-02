import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 30
    },
    achievements: {
      type: [String],
      default: []
    },
    endingsReached: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Player = mongoose.model("Player", playerSchema);

export default Player;
