import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import userRouter from "./router/user";
import merchantRouter from "./router/merchant";

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    app.use(bodyParser.json());
    app.use("/user", userRouter);
    app.use("/merchant", merchantRouter);
    app.get("/", (req: Request, res: Response) => {
      res.send("Hello World! Express is running on port 3051");
    });
    app.listen(3051, () => {
      console.log(
        "Express server has started on port 3051. Open http://localhost:3051/ to see results",
      );
    });
  })
  .catch((error) => console.log(error));
