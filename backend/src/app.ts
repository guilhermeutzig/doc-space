import express from "express";
import config from "./config";
import usersRouter from "./routes/users";
import bodyParser from "body-parser";
import authRouter from "./routes/auth";

const app = express();
const PORT = config.port;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
