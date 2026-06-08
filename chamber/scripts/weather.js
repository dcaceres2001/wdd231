const apiKey = 'e8ce03dfc7668d3dba8b47e6221cd8f2';
const lat = '14.52';
const lon = '-90.76';

const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

async function fetchChamberWeather() {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        const currentData = data.list[0];
        document.getElementById("temperature").innerText = Math.round(currentData.main.temp);
        document.getElementById("condition").innerText = currentData.weather[0].description;

        const currentIconCode = currentData.weather[0].icon;
        document.getElementById("weather-icon").setAttribute("src", `https://openweathermap.org/img/wn/${currentIconCode}@2x.png`);

        const midDayList = data.list.filter(item => item.dt_txt.includes("12:00:00"));
        for (let i = 0; i < 3; i++) {
            const dayData = midDayList[i];
            const cardNumber = i + 1;
            const dateOptions = { weekday: 'long' };
            const dayName = new Date(dayData.dt_txt).toLocaleDateString('en-US', dateOptions);

            document.getElementById(`day${cardNumber}-name`).innerText = dayName;
            document.getElementById(`day${cardNumber}-temp`).innerText = Math.round(dayData.main.temp);

            const forecastIconCode = dayData.weather[0].icon;
            document.getElementById(`day${cardNumber}-icon`).setAttribute("src", `https://openweathermap.org/img/wn/${forecastIconCode}.png`);
        }
    } catch (error) {
        console.error("Failed to parse chamber weather data:", error);
    }
}

fetchChamberWeather();