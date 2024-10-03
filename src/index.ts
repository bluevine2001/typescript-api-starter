import cors from "cors";
import express, { Express } from "express";
import mongoose from "mongoose";
import AuthRouter from "./routes/auth";
import UserRouter from "./routes/users";

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/test";

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));

app.use("/auth", AuthRouter);
app.use("/users", UserRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
