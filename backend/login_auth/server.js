import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// User Schema
const UserSchema = new mongoose.Schema({
  username: String,
  registerNo: String,
  isCoordinator: Boolean,
  // Add other fields if needed
});

const User = mongoose.model("UserAuth", UserSchema);

// Login API
app.post('/login', async (req, res) => {
  const { username, registerNo, isCoordinator } = req.body;

  try {
    let user;

    if (isCoordinator) {
      user = await User.findOne({ username, registerNo, isCoordinator: true });
    } else {
      user = await User.findOne({ username, registerNo, isCoordinator: false });
    }

    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
