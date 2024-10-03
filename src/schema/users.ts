import mongoose from "mongoose";

export interface User {
  name: string;
  email: string;
  password: string;
  currentToken?: string;
  createdAt?: Date;
}

const UserSchema = new mongoose.Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  currentToken: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const UserModel = mongoose.model<User>("User", UserSchema);

export default UserModel;
