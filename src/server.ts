import app from "@/src/app";
import { ConnectDB } from "./database/connection";
import configs from "./config";

function run() {
  // ========================
  // Connect Database
  // ========================
  ConnectDB(); 
  app.listen(configs.port, () => {
    console.log(`User Service running on Port: ${configs.port}`);
  });
}

run();
