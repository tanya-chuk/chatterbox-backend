import Router from "@koa/router";
import { MongoClient } from "mongodb";
import { db } from "../../database";

const userRouter = new Router();
userRouter.prefix("/user");

userRouter.get("/", function ({ response }) {
  response.body = "API is working properly";
});

userRouter.post("/", function ({ request, response }) {
  const client = new MongoClient(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  client.connect((err, client) => {
    if (err) {
      console.log(err);
    }

    const collection = client.db("test").collection("test");
    collection.insertOne(request.body);
  });

  response.body = request.body;
});

export { userRouter };
