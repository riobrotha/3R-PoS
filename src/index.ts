import express from "express";
import cors from "cors"
import { API_VERSION, PORT } from "./config/env";
import router from "./routes/api";
import { errorHandler } from "./middlewares/errorHandler.middleware";

async function init() {

  const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    //routes
    app.use(`/api/${API_VERSION}`, router);
    
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    })
}

init().catch((err) => {
  console.error("Failed to initialize the server:", err);
  process.exit(1);
});