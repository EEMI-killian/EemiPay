import * as express from "express";
import * as cors from "cors"
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import userRouter from "./router/user";
import merchantRouter from "./router/merchant";
import credentialRouter from "./router/credential";
import transactionRouter from "./router/transaction";

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    app.use(bodyParser.json());
    app.use(cors());
    app.use("/user", userRouter);
    app.use("/transaction", transactionRouter);
    app.use("/merchant", merchantRouter);
    app.use("/credential", credentialRouter);
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

