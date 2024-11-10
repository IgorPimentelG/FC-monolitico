import { dbConnection } from "../db/migrator-cli";
import { app } from "./express";

const port = 3000;

dbConnection();

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});