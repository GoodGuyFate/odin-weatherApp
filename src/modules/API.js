export async function getWeather(location) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=F8PTXNSDMXF4KAFZXYTV9RZ38&contentType=json`,
    );

    if (!response.ok) {
        throw new Error(`City not found (${response.status})`);
    }
    const weatherData = await response.json();

    console.log("Full Data Object:", weatherData)
    console.log(processWeatherData(weatherData))

    return processWeatherData(weatherData)

  } catch (error) {
    console.error("Fetch error:", error);
    alert(error.message)
  }
}

function processWeatherData(data) {
    return {
        city: data.resolvedAddress,
        temp: data.currentConditions.temp,
        feelsLike: data.currentConditions.feelslike,
        humidity: data.currentConditions.humidity,
        condition: data.currentConditions.conditions,
        icon: data.currentConditions.icon 
    };
}