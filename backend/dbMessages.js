import mongoose from "mongoose";

//creating schema like how the data is gonna be built

const whatsappSchema = mongoose.Schema({
  message: String,
  name: String,
  timestamp: String,
  received: Boolean,
});
mongoose.set("strictQuery", true);
//collection
export default mongoose.model("messagecontents", whatsappSchema);
