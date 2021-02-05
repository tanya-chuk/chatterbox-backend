import Router from "@koa/router";
import { MongoClient } from "mongodb";
import { db } from "../../database";

const userRouter = new Router();
userRouter.prefix("/user");
const { namespace, url } = db;

const handleConnection = async (cb: (list) => void) => {
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  await client.connect();
  const clientList = client
    .db(namespace.user.root)
    .collection(namespace.user.collections.list);
  await cb(clientList);
  client.close();
};

userRouter.post("/login", async ({ request, response }) => {
  await handleConnection(async (list) => {
    const results = await list.find({ name: request.body.name }).toArray();
    if (!results.length) {
      response.status = 400;
      response.body = {
        message: "Bad credentials"
      };
    }
    response.body = results;
  });
});

userRouter.post("/signup", async ({ request, response }) => {
  await handleConnection(async (list) => {
    const results = await list.findOneAndUpdate(
      { name: request.body.name },
      { $set: { name: request.body.name } },
      {
        upsert: true,
        returnOriginal: false
      }
    );

    if (results.lastErrorObject.updatedExisting) {
      response.status = 400;
      response.body = {
        message: "User already exists"
      };
      return;
    }

    response.body = results.value;
  });
});

export { userRouter };
