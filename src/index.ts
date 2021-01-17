import Koa from "koa";
import { userRouter } from "./routes/user";
import cors from "@koa/cors";
import koaBody from "koa-body";
import { db } from "../db";
import { MongoClient } from "mongodb";

const app = new Koa();
const port = 9000;

app.use(cors());
app.use(koaBody());
app.use(userRouter.routes());

const client = new MongoClient(db.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

client.connect((err, client) => {
  if (err) {
    console.log(err);
  }

  const db = client.db("test");
  const collection = db.collection("test");
  collection.find({}).toArray(function (err, data) {
    if (!err) {
      console.log(data);
    }
  });
});

app.listen(port, () => {
  console.log("We are live on " + port);
});
