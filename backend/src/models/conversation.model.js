import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    // The Client or Freelancer in this conversation
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // The Admin / Platform Project Desk
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Cached role of the user ("client" or "freelancer") for fast filtering
    userRole: {
      type: String,
      enum: ["client", "freelancer"],
      required: true,
    },

    // Last message snippet for preview in inboxes
    lastMessage: {
      type: String,
      default: "",
    },

    lastMessageAt: {
      type: Date,
      default: Date.now,
    },

    unreadCountUser: {
      type: Number,
      default: 0,
    },

    unreadCountAdmin: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate conversations between the same user and admin
conversationSchema.index({ user: 1, admin: 1 }, { unique: true });

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
