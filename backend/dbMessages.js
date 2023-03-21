import mongoose from "mongoose";

//creating schema like how the data is gonna be built

const whatsappSchema = mongoose.Schema(
    {
        message: String,
        name: String,
        timestamp: String,
        received: Boolean
    }
)
//collection
export default mongoose.model("messagecontents", whatsappSchema)