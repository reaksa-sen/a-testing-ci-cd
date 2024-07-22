import mongoose from "mongoose";
import configs from "../config";

const uri = configs.mongodbUrl

export const ConnectDB = async () => {
  try {
    if(!uri){
        throw new Error("MongoDB it not define in .env!")
    }
    await mongoose.connect(uri);
    console.log("Database is connected!");
    
  } catch(err) {
    console.error("Database it fail to connected!")
    process.exit(1); // when can't connect database server is closed
  }
};
