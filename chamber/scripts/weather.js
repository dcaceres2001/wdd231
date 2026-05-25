const apiKey = 'e8ce03dfc7668d3dba8b47e6221cd8f2';
const lat = '14.52';
const lon = '-90.76';

const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

async function apiFetch() {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            displayResults(data);
        } else {
            throw Error(await response.text());
        }
    } catch (error) {
        console.error("Error getting weather data:", error);
    }
}


function displayResults(data) {
    const tempSpan = document.getElementById('temperature');
    const descCaption = document.getElementById('condition');
    const iconImg = document.getElementById('weather-icon');
    const windSpan = document.getElementById('windspeed');

    const temp = data.main.temp;
    const windSpeed = data.wind.speed;

    
    const desc = data.weather[0].description;
    const formattedDesc = desc.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    
    if (tempSpan) tempSpan.textContent = `${temp.toFixed(0)}`;
    if (descCaption) descCaption.textContent = formattedDesc;
    if (windSpan) windSpan.textContent = windSpeed.toFixed(1);

   
    if (iconImg) {
        iconImg.setAttribute('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
        iconImg.setAttribute('alt', formattedDesc);
    }

    
    const chillElement = document.getElementById('windchill');
    if (chillElement) {
        chillElement.textContent = calculateWindChill(temp, windSpeed);
    }
}

function calculateWindChill(temp, speed) {

    const speedKmh = speed * 3.6;

    
    if (temp <= 10 && speed > 4.8) {
        const chill = 13.12 + (0.6215 * temp) - (39.75 * Math.pow(speed, 0.16)) + (0.4275 * temp * Math.pow(speed, 0.16));
        return `${chill.toFixed(1)}°C`;
    }
    return "N/A";
}

apiFetch();
