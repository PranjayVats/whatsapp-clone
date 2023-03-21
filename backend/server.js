import express from "express";
//express is server where our code will run
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import Pusher from "pusher";
import Cors from "cors";
import dotenv from "dotenv";


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
app.get("/", (req, res) => res.status(200).send("Server is Running"));
// "/" is end point
app.get("/messages/sync", (req, res) => {
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
//

//listener
app.listen(port, () => console.log(`Listening on localhost: ${port}`));
