import "./styles.css";
import { getWeather } from "./modules/API.js";
import { renderOverview } from "./modules/UI.js";
import { getBrowserLocation } from "./modules/location.js";

const searchInput = document.querySelector("#search");
const weatherBtn = document.querySelector("#weather-btn");

async function initWeather(location = null) {
  let targetLocation = location;

  if (!targetLocation) {
    try {
      targetLocation = await getBrowserLocation();
    } catch (error) {
      console.warn("User denied location or error occurred, using default.");
      targetLocation = "Cairo";
    }
  }

  const data = await getWeather(targetLocation);
  if (data) {
    renderOverview(data);
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const rawLocation = searchInput.value.trim();
    if (rawLocation) {
      const formattedLocation = capitalize(rawLocation);
      initWeather(formattedLocation);
      searchInput.value = "";
      searchInput.blur();
    }
  }
});

weatherBtn.addEventListener("click", () => {
  console.log("Switching to Weather Tab");

  document
    .querySelectorAll(".menu-item")
    .forEach((item) => item.classList.remove("active"));
  weatherBtn.classList.add("active");

  const currentCity = "Cairo";
  initWeather(currentCity);
});
initWeather("Cairo");
