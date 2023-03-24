import axios from "axios";

const instance = axios.create({
    baseURL: "https://silver-peony-9c96d4.netlify.app/.netlify/functions/server",
});
export default instance;