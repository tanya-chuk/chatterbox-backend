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
    const user = await list.findOne({ name: request.body.name });
    if (!user) {
      response.status = 400;
      response.body = {
        message: "Bad credentials"
      };
      return;
    }
    const peers = user.peers?.length
      ? await list
          .find({ _id: { $in: user["peers"] } }, { projection: { peers: 0 } })
          .toArray()
      : [];
    response.body = { ...user, peers };
  });
});

userRouter.post("/signup", async ({ request, response }) => {
  await handleConnection(async (list) => {
    const user = await list.findOneAndUpdate(
      { name: request.body.name },
      { $set: { name: request.body.name } },
      { upsert: true, returnOriginal: false }
    );

    if (user.lastErrorObject.updatedExisting) {
      response.status = 400;
      response.body = {
        message: "User already exists"
      };
      return;
    }
    const peers = user.value.peers?.length
      ? await list
          .find({ _id: { $in: user["peers"] } }, { projection: { peers: 0 } })
          .toArray()
      : [];
    response.body = { ...user.value, peers };
  });
});

userRouter.get("/history", async ({ request, response }) => {
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  await client.connect();
  const clientList = client
    .db(namespace.user.root)
    .collection(namespace.user.collections.history);
  const results = await clientList.find({ userId: request.query.id }).toArray();
  response.body = results;
  client.close();
});

export { userRouter };
