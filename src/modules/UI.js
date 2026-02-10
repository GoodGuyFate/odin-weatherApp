async function loadWeatherIcon(iconName) {
  try {
    const image = await import(`../assets/images/${iconName}.svg`);
    return image.default;
  } catch (err) {
    console.error("Icon not found", err);
    const defaultImg = await import("../assets/images/clear-day.svg");
    return defaultImg.default;
  }
}

export async function renderOverview(data) {
  const container = document.querySelector(".overview");

  container.textContent = "";
  const infoDiv = document.createElement("div");
  infoDiv.classList.add("weather-info");

  const cityHeader = document.createElement("div");
  cityHeader.classList.add("city-header");

  const cityName = document.createElement("h1");
  cityName.textContent = data.city.split(",")[0];

  const rainChance = document.createElement("p");
  rainChance.classList.add("rain-chance");
  rainChance.textContent = `Condition: ${data.condition}`;

  cityHeader.append(cityName, rainChance);

  const degree = document.createElement("h2");
  degree.classList.add("degree");
  degree.textContent = `${Math.round(data.temp)}°`;

  infoDiv.append(cityHeader, degree);

  const iconImg = document.createElement("img");
  iconImg.classList.add("main-weather-img");
  iconImg.src = await loadWeatherIcon(data.icon);
  iconImg.alt = data.condition;

  container.append(infoDiv, iconImg);
}
