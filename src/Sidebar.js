import React from "react";
import SidebarChats from "./SidebarChats.js";
import "./Sidebar.css";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import { Avatar, IconButton } from "@material-ui/core";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar_header">
        <Avatar className="avatar" src="https://pbs.twimg.com/media/C0SPOkMWgAA9UTy.jpg"/>
        <div className="sidebar_headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="sidebar_search">
          <div className="sidebar_searchContainer">
              <IconButton><SearchOutlined fontSize="small"/></IconButton>
              
              <input className="search_box" placeholder="Search or start new chat ">
              </input>
          </div>
      </div>
      <div className="sidebar_chats">
        <SidebarChats/>
        <SidebarChats/>
        <SidebarChats/>
      </div>
    </div>
  );
}

export default Sidebar;
