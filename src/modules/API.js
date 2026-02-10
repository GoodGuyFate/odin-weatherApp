export async function getWeather(location) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=F8PTXNSDMXF4KAFZXYTV9RZ38&contentType=json`,
    );

    if (!response.ok) {
      throw new Error(`City not found (${response.status})`);
    }
    const weatherData = await response.json();

    console.log("Full Data Object:", weatherData);
    console.log(processWeatherData(weatherData));

    return processWeatherData(weatherData);
  } catch (error) {
    console.error("Fetch error:", error);
    alert(error.message);
  }
}

function processWeatherData(data) {
  const current = data.currentConditions;
  const today = data.days[0];
  const hourlyData = today.hours;

  return {
    city: data.address || "Unknown Location",
    temp: Math.round(current.temp),
    humidity: current.humidity,
    condition: current.conditions,
    icon: current.icon,

    airConditions: {
      realFeel: Math.round(current.feelslike),
      wind: current.windspeed,
      uvIndex: current.uvindex ?? 0,
      chanceOfRain: current.precipprob ?? 0,
    },

    daily: data.days,

    hourly: hourlyData.map((h) => {
      const [hours] = h.datetime.split(":");
      const hourInt = parseInt(hours);
      const ampm = hourInt >= 12 ? "PM" : "AM";
      const formattedHour = hourInt % 12 || 12;

      return {
        time: `${formattedHour}:00 ${ampm}`,
        temp: Math.round(h.temp),
        icon: h.icon,
      };
    }),
  };
}
