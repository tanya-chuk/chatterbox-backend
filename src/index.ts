import Koa from "koa";
import { userRouter } from "./routes/user";
import cors from "@koa/cors";
import koaBody from "koa-body";

const app = new Koa();
const port = 9000;

app.use(cors());
app.use(koaBody());
app.use(userRouter.routes());

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
