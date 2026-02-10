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
  degree.textContent = `${Math.round(data.temp)}${data.unitSymbol}`;

  infoDiv.append(cityHeader, degree);

  const iconImg = document.createElement("img");
  iconImg.classList.add("main-weather-img");
  iconImg.src = await loadWeatherIcon(data.icon);
  iconImg.alt = data.condition;

  container.append(infoDiv, iconImg);
}

export async function renderTodayForecast(hourlyData, unitSymbol) {
  const forecastContainer = document.querySelector(".forecast-cards-container");
  forecastContainer.textContent = "";

  const upcomingHours = hourlyData.filter((_, index) => index % 3 === 0);

  for (const hour of upcomingHours) {
    const card = document.createElement("div");
    card.classList.add("forecast-card");

    const timeLabel = document.createElement("p");
    timeLabel.textContent = hour.time;

    const iconImg = document.createElement("img");
    iconImg.src = await loadWeatherIcon(hour.icon);
    iconImg.alt = "weather icon";

    const tempLabel = document.createElement("p");
    tempLabel.classList.add("forecast-temp");
    tempLabel.textContent = `${hour.temp}${unitSymbol}`;

    card.append(timeLabel, iconImg, tempLabel);
    forecastContainer.append(card);
  }
}

function createConditionItem(iconClass, labelText, valueText) {
  const item = document.createElement("div");
  item.className = "condition-item";

  const labelDiv = document.createElement("div");
  labelDiv.className = "condition-label";

  const icon = document.createElement("i");
  icon.classList.add("fas", ...iconClass.split(" "));

  const span = document.createElement("span");
  span.textContent = labelText;

  const p = document.createElement("p");
  p.textContent = valueText;

  labelDiv.append(icon, span);
  item.append(labelDiv, p);

  return item;
}

export async function renderConditions(data, unitSymbol) {
  const grid = document.querySelector(".conditions-grid");
  grid.textContent = "";

  const conditions = [
    {
      icon: "fa-thermometer-half",
      label: "Feels like",
      value: `${data.realFeel}${unitSymbol}`,
    },
    { icon: "fa-wind", label: "Wind", value: `${data.wind} ${data.windUnit}` },
    {
      icon: "fa-tint",
      label: "Chance of rain",
      value: `${data.chanceOfRain}%`,
    },
    { icon: "fa-sun", label: "UV Index", value: data.uvIndex },
  ];

  conditions.forEach((c) => {
    const item = createConditionItem(c.icon, c.label, c.value);
    grid.appendChild(item);
  });
}

function createForecastRow(dayData, unitSymbol) {
  const row = document.createElement("div");
  row.className = "week-forecast-row";

  const dayLabel = document.createElement("span");
  dayLabel.className = "forecast-day";
  dayLabel.textContent = dayData.day;

  const conditionGroup = document.createElement("div");
  conditionGroup.className = "forecast-condition-group";

  const icon = document.createElement("img");
  icon.src = `./assets/images/${dayData.icon}.svg`;
  icon.alt = dayData.condition;
  icon.className = "forecast-mini-icon";

  const conditionText = document.createElement("span");
  conditionText.className = "forecast-condition-text";
  conditionText.textContent = dayData.condition;

  conditionGroup.append(icon, conditionText);

  const tempRange = document.createElement("div");
  tempRange.className = "forecast-temp-range";

  const highTemp = document.createElement("span");
  highTemp.className = "temp-high";
  highTemp.textContent = Math.round(dayData.tempmax);

  const separator = document.createTextNode("/");

  const lowTemp = document.createElement("span");
  lowTemp.className = "temp-low";
  lowTemp.textContent = Math.round(dayData.tempmin);

  const unit = document.createElement("span");
  unit.textContent = unitSymbol;
  unit.style.fontSize = "0.7rem";
  unit.style.marginLeft = "2px";

  tempRange.append(highTemp, separator, lowTemp, unit);
  row.append(dayLabel, conditionGroup, tempRange);
  return row;
}

export async function renderWeekForecast(days, unitSymbol) {
  const container = document.querySelector(".week-forecast");
  if (!container) return;

  container.replaceChildren();

  const header = document.createElement("h3");
  header.textContent = "7-Day Forecast";
  header.style.marginBottom = "20px";
  header.style.color = "#8b8b8b";
  header.style.textTransform = "uppercase";
  header.style.fontSize = "0.8rem";
  container.appendChild(header);

  const nextSevenDays = days.slice(1, 8);

  nextSevenDays.forEach((day) => {
    const date = new Date(day.datetime);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

    const row = createForecastRow({
      day: dayName,
      icon: day.icon,
      condition: day.conditions.split(",")[0],
      tempmax: day.tempmax,
      tempmin: day.tempmin,
    }, unitSymbol);

    container.appendChild(row);
  });
}