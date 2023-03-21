import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
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
db.once("open", () => {
  console.log("db is connected");
  const msgCollection = db.collection("messagecontents");
  const changeStream = msgCollection.watch();

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
// "/" is end point
router.get("/messages/sync", (req, res) => {
  Messages.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});
app.post("/messages/new", (req, res) => {
  const dbMessage = req.body;

  Messages.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.use("/.netlify/functions/api", router);

//listener
app.listen(port, () => console.log(`Listening on localhost: ${port}`));
export const handler = serverless(app);
