import { model, Schema } from "mongoose";

export interface IUser {
  _id?: string;
  name: string;
  gender: "male" | "female" | "other";
  age: number;
  email: string;
  image: string;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true, enum: ["male", "female", "other"] },
  image: { type: String, required: true },
});

export const User = model<IUser>("User", UserSchema); 
