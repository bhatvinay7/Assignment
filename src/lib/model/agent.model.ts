import mongoose, { Schema, Document, model, models } from "mongoose";

export interface User extends Document {
  userName: string;
  email: string;
  refreshToken:String,
  picture:String,
  mobile:String,
  user:mongoose.Types.ObjectId,
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const agentSchema = new Schema<User>(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile:{type:String,required:true},
    refreshToken:{type:String,required:false},
    picture:{type:String,required:false},
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

const agent = models.Agent || model<User>("Agent", agentSchema);

export default agent;
