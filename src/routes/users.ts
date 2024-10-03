import express, { Request, Response } from "express";
import UserModel from "../schema/users";

interface CustomResponse extends Response {
  user?: any;
}

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const user = new UserModel({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// middleware to get user by id
const getUserById = async (
  req: Request,
  res: CustomResponse,
  next: any
): Promise<void> => {
  let user;

  try {
    user = await UserModel.findById(req.params.id);

    if (user == null) {
      res.status(404).json({ message: "Cannot find user" });
      return;
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
    return;
  }

  res.user = user;
  next();
};

router.get("/:id", getUserById, (req: Request, res: CustomResponse) => {
  res.json(res.user);
});

export default router;
