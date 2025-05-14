import { connectDB } from "./db/databaseConnection.js";
import { app } from "./app.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(
    app.listen(process.env.PORT, () => {
      console.log("Server is listening at port: ", process.env.PORT);
    })
  )
  .catch((err) => {
    console.log(`Failed to connect to MongoDB. Aborting server start.`, err);
  });
