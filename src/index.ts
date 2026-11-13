import express from "express";
import cors from "cors"
import bodyParser from "body-parser";
import { API_VERSION, PORT } from "./config/env";
import router from "./routes/api";
import { errorHandler } from "./middlewares/errorHandler.middleware";

async function init() {
  try {
    const app = express();

    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    //routes
    app.use(`/api/${API_VERSION}`, router);


    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    })

  } catch (error) {
    console.log(error);
  }
}

init();