import mongoose, { Schema, Document, model, models } from "mongoose";

export interface User extends Document {
  userName: string;
  email: string;
  refreshToken:String,
  picture:String,
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<User>(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshToken:{type:String,required:false},
    picture:{type:String,required:false}
  },
  { timestamps: true }
);

const user = models.User || model<User>("User", userSchema);

export default user;
