import { model, Schema } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  email: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  dateOfBirth: {
    type: String,
  },
  avatar: {
    type: String,
  },
  friends: {
    type: [Schema.Types.ObjectId],
  },
  enemies: {
    types: [Schema.Types.ObjectId],
  },
});

const User = model("User", userSchema, "users");

export default User;
