async function loadWeatherIcon(iconName) {
    try {
        const image = await import(`./assets/images/${iconName}.png`)

        return image.default
    } catch (err) {
        console.error("Icon not found", err)
        const defaultImg = await import('./assets/images/clear-day.png')
        return defaultImg.default
    }
}