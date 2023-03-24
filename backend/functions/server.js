import express from "express";
import mongoose from "mongoose";
import Pusher from "pusher";
import Cors from "cors";
import dotenv from "dotenv";
import serverless from "serverless-http";
const router = express.Router();
dotenv.config({ path: ".env" });

//app config

const app = express(); //application insatnce created
const port = process.env.PORT || 9000;
const pusher = new Pusher({
  appId: process.env.APP_ID,
  key: process.env.KEY,
  secret: process.env.SECRET,
  cluster: "ap2",
  useTLS: true,
});

//middlewares
app.use(express.json());
app.use(Cors());

//DB config
const connection_url = process.env.MONGO_URI;

mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); //here we have connected with our database

const db = mongoose.connection;
const whatsappSchema = mongoose.Schema({
  message: String,
  name: String,
  timestamp: String,
  received: Boolean,
});
mongoose.set("strictQuery", true);
//collection

db.once("open", async () => {
  console.log("db is connected");
  const msgCollection = db.collection("messagecontents");
  const changeStream = await msgCollection.watch();
  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        received: messageDetails.received,
      });
    } else {
      console.log("Error triggering Pusher");
    }
  });
});

//api routes
router.get("/", (req, res) => res.status(200).send("Server is Running"));

router.get("/messages/sync", (req, res) => {
  mongoose.model("messagecontents", whatsappSchema).find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});
router.post("/messages/new", (req, res) => {
  const dbMessage = req.body;

  mongoose
    .model("messagecontents", whatsappSchema)
    .create(dbMessage, (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send(data);
      }
    });
});

//listener
app.listen(port, () => console.log(`Listening on localhost: ${port}`));
app.use("/.netlify/functions/server", router);
export const handler = serverless(app);
