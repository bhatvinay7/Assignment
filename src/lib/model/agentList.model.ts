import mongoose, { Schema, Document, model, models } from "mongoose";

export interface User extends Document {
  userId:mongoose.Types.ObjectId;
  agenId:mongoose.Types.ObjectId;
  listURL:string;
  createdAt?: Date;
  updatedAt?: Date;
}

const agentList = new Schema<User>(
  {
    agenId:{ type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    listURL:{type: String, required: true }
  },
  { timestamps: true }
);

const user = models.AgentList || model<User>("AgentList", agentList);

export default user;
