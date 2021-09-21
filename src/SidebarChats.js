import { Avatar } from "@material-ui/core";
import React from "react";
import "./SidebarChats.css";

function SidebarChats() {
  return (
    <div className="sidebarChat">
      <Avatar className="avatar" />
      <div className="chatInfo">
        <h2>Name</h2>
        <p>This is the last message.</p>
      </div>
    </div>
  );
}

export default SidebarChats;
