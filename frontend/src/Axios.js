import axios from "axios";

const instance = axios.create({
    baseURL: "https://whatsapp-clone-node-server.netlify.app/.netlify/functions/server",
});
export default instance;