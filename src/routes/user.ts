import Router from "@koa/router";

const userRouter = new Router();
userRouter.prefix("/user");

userRouter.get("/", function ({ response }) {
  response.body = "API is working properly";
});

userRouter.post("/", function ({ request, response }) {
  response.body = request.body;
});

export { userRouter };
