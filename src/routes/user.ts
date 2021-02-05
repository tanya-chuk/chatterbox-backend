import Router from "@koa/router";
import { MongoClient } from "mongodb";
import { db } from "../../database";

const userRouter = new Router();
userRouter.prefix("/user");
const {
  namespace: { user },
  url
} = db;

userRouter.post("/login", async (ctx) => {
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  await client.connect();
  const userList = client.db(user.root).collection(user.collections.list);
  const results = await userList
    .find({ name: ctx.request.body.name })
    .toArray();
  ctx.response.body = results;
});

userRouter.post("/", function ({ request, response }) {
  const client = new MongoClient(url, {
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
