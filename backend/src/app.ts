import express from "express";
import config from "./config/index.js";
import usersRouter from "./routes/users.js";
import bodyParser from "body-parser";
import authRouter from "./routes/auth.js";
import cors from "cors";

const app = express();
const PORT = config.port;
const corsConfig = {
  origin: config.originUrl,
  credentials: true,
  exposedHeaders: ["Authorization"],
};

app.use(cors(corsConfig));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
