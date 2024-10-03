import express, { Express } from "express";
import mongoose from "mongoose";

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(express.json());

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/test";

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
