import { Avatar } from "@material-ui/core";
import React from "react";
import "./SidebarChats.css";

function SidebarChats({ name, message }) {
  return (
    <div className="sidebarChat">
      <Avatar className="avatar" />
      <div className="chatInfo">
        <h2>{name}</h2>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default SidebarChats;
