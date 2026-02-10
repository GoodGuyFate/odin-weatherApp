import "./styles.css"
import { getWeather } from "./modules/API.js"

const searchInput = document.querySelector("#search");

getWeather("cairo") // replace with searchInput when search bar is set up