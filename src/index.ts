import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import { User } from "./routes/user";

const app = express();
const port = 9000;

app.use(cors());
app.use(bodyParser.json());
app.use(User().url, User().router);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
