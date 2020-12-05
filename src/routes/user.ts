import express, { Router } from "express";

interface IUser {
  name: string;
}

interface IUserReturns {
  router: Router;
  url: string;
}

const User = (): IUserReturns => {
  const userRouter = express.Router();

  userRouter.get("/", function (res: { send: (arg0: string) => void }) {
    res.send("API is working properly");
  });

  userRouter.post(
    "/",
    function (req: { body: IUser }, res: { send: (arg0: IUser) => void }) {
      res.send(req.body);
    }
  );

  return {
    router: userRouter,
    url: "/user"
  };
};

export { User };
