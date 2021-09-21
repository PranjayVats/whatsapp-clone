import React, { useState } from "react";
import { Avatar, IconButton } from "@material-ui/core";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import AttachFile from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import axios from "./Axios";
import "./Chat.css";

function Chat({ messages }) {
  const [input,setInput]=useState("");
  const sendMessage= async (e)=>{
    e.preventDefault();
    await axios.post("/messages/new",{
      message: input,
      name: "You",
      timestamp: "Just Now",
      received: true,
    })
    setInput("");
  }
  
  return (
    
    <div className="chat">
      <div className="chat_header">
        <Avatar className="avatar" />
        <div className="chat_headerInfo">
          <h3>Room Name</h3>
          <p>Last seen at....</p>
        </div>
        <div className="chat_headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="chat_body">
        {
        messages.map(message=>(
          <p className={`chat_message ${message.received && "receiver"}`}>
          <span className="chat_name">{message.name}</span>
          {message.message}
          <br />
          <span className="chat_timestamp">{message.timestamp}</span>
        </p>
        ))}
      </div>
      <div className="chat_footer">
        <InsertEmoticonIcon />
        <form>
          <input value={input} onChange={e=> setInput(e.target.value)} placeholder="Message" type="text" />
          <button onClick={sendMessage} type="submit">Send message</button>
        </form>
        
        <IconButton >
          <MicIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default Chat;
