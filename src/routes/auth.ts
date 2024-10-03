// authentification routes with jwt
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../schema/users";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    const user = await UserModel.findOne({ email });

    if (user) {
      res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      name,
      email,
      password: hash,
    });

    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "User does not exist" });
    } else {
      const isMatch = await bcrypt.compare(password, user?.password);

      if (!isMatch) {
        res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || "secret",
        {
          expiresIn: 3600,
        }
      );

      user.currentToken = token;
      await user.save();

      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/logout", async (req: Request, res: Response) => {
  const user = await UserModel.findOne({
    currentToken: req.headers.access_token,
  });
  if (!user) {
    res.status(400).json({ message: "User does not exist" });
  } else {
    user.currentToken = "";
    await user.save();
    res.json({ message: "User logged out" });
  }
});

router.get("/retrieve-user", async (req: Request, res: Response) => {
  const user = await UserModel.findOne({
    currentToken: req.headers.access_token,
  });

  if (!user) {
    res
      .status(400)
      .json({ message: "User does not exist or token is expired" });
  } else {
    // verify if token is expired
    jwt.verify(
      req.headers.access_token as string,
      JWT_SECRET as string,
      (err: any, decoded: any) => {
        if (err) {
          res.status(400).json({ message: "Token is expired" });
        } else {
          res.json({
            id: user._id,
            name: user.name,
            email: user.email,
          });
        }
      }
    );
  }
});

export default router;
