import express from "express";
import config from "./config";
import usersRouter from "./routes/users";
import bodyParser from "body-parser";

const app = express();
const PORT = config.port;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/users", usersRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
