import "./styles.css";
import { getWeather } from "./modules/API.js";
import { renderOverview, renderTodayForecast, renderConditions, renderWeekForecast } from "./modules/UI.js";
import { getBrowserLocation } from "./modules/location.js";

const searchInput = document.querySelector("#search");
const weatherBtn = document.querySelector("#weather-btn");
const unitBtn = document.querySelector("#unit-toggle");

let currentUnit = "metric";
let lastLocation = "Cairo";

async function initWeather(location = lastLocation) {
  lastLocation = location;
  
  const data = await getWeather(location, currentUnit);
  if (data) {
    renderOverview(data);
    renderTodayForecast(data.hourly, data.unitSymbol);
    renderConditions(data.airConditions, data.unitSymbol);
    renderWeekForecast(data.daily, data.unitSymbol);
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const rawLocation = searchInput.value.trim();
    if (rawLocation) {
      initWeather(capitalize(rawLocation));
      searchInput.value = "";
      searchInput.blur();
    }
  }
});

unitBtn.addEventListener("click", () => {
  currentUnit = currentUnit === "metric" ? "us" : "metric";
  unitBtn.textContent = currentUnit === "metric" ? "Display: °C" : "Display: °F";
  initWeather(lastLocation);
});

weatherBtn.addEventListener("click", () => {
  document
    .querySelectorAll(".menu-item")
    .forEach((item) => item.classList.remove("active"));
  weatherBtn.classList.add("active");
  initWeather(lastLocation);
});

(async () => {
  try {
    const browserLoc = await getBrowserLocation();
    initWeather(browserLoc);
  } catch {
    initWeather("Cairo");
  }
})();