import mongoose from "mongoose";
import 'dotenv/config';
const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI,{
            dbName: "ChatDock"
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export default connectDb