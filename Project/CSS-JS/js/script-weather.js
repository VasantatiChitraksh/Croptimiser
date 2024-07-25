let api_key = 'ccd4a65d6daa2c1406d4997f1db9712f';
let limit = 1;

const weatherIcons = {
    "clear sky": "01d",
    "few clouds": "02d",
    "scattered clouds": "03d",
    "broken clouds": "04d",
    "shower rain": "09d",
    "rain": "10d",
    "thunderstorm": "11d",
    "snow": "13d",
    "mist": "50d",
    "smoke": "50d",
    "haze": "50d",
    "sand/dust whirls": "50d",
    "fog": "50d",
    "sand": "50d",
    "dust": "50d",
    "volcanic ash": "50d",
    "squalls": "50d",
    "tornado": "50d",
    "light rain": "10d",
    "moderate rain": "10d",
    "heavy intensity rain": "10d",
    "very heavy rain": "10d",
    "extreme rain": "10d",
    "freezing rain": "13d",
    "light intensity shower rain": "09d",
    "heavy intensity shower rain": "09d",
    "ragged shower rain": "09d",
    "light snow": "13d",
    "heavy snow": "13d",
    "sleet": "13d",
    "light shower sleet": "13d",
    "shower sleet": "13d",
    "light rain and snow": "13d",
    "rain and snow": "13d",
    "light shower snow": "13d",
    "shower snow": "13d",
    "heavy shower snow": "13d",
    "thunderstorm with light rain": "11d",
    "thunderstorm with rain": "11d",
    "thunderstorm with heavy rain": "11d",
    "light thunderstorm": "11d",
    "heavy thunderstorm": "11d",
    "ragged thunderstorm": "11d",
    "thunderstorm with light drizzle": "11d",
    "thunderstorm with drizzle": "11d",
    "thunderstorm with heavy drizzle": "11d",
    "light intensity drizzle": "09d",
    "drizzle": "09d",
    "heavy intensity drizzle": "09d",
    "light intensity drizzle rain": "09d",
    "drizzle rain": "09d",
    "heavy intensity drizzle rain": "09d",
    "shower rain and drizzle": "09d",
    "heavy shower rain and drizzle": "09d",
    "shower drizzle": "09d",
    "overcast clouds": "04d"
};

function getWindDirection(degree) {
    switch (true) {
        case (degree >= 337.5 || degree < 22.5):
            return "North";
        case (degree >= 22.5 && degree < 67.5):
            return "North-East";
        case (degree >= 67.5 && degree < 112.5):
            return "East";
        case (degree >= 112.5 && degree < 157.5):
            return "South-East";
        case (degree >= 157.5 && degree < 202.5):
            return "South";
        case (degree >= 202.5 && degree < 247.5):
            return "South-West";
        case (degree >= 247.5 && degree < 292.5):
            return "West";
        case (degree >= 292.5 && degree < 337.5):
            return "North-West";
        default:
            return "unavlble";
    }
}




/* Promise Implementation for getLonLat*/
/*
function getLonLat() {
    let searchBarEl = document.getElementById('searchBar');
    let cityName = searchBarEl.value;
    console.log("Your Query City is : " , cityName);
    
    let Geocode_api = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${api_key}`;


    fetch(Geocode_api)
        .then(response => response.json())
        .then(data => console.log(data[0]))
        .catch(error => console.error(error))
}
*/

function returnEmojiLink(description) {
    const iconCode = weatherIcons[description];
    if (iconCode) {
        return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    } else {
        return "Icon not found";
    }
}

function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}

function formatUnixTimestamp(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000);
    
    const day = date.getDate();
    const ordinalSuffix = getOrdinalSuffix(day); /* like 23rd 13th rd th nd etc.. */
    const month = date.toLocaleString('default', { month: 'long' });
    const dayOfWeek = date.toLocaleString('default', { weekday: 'long' });
    
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // specially identifies hour '0' and make it 12
    
    return `${day}${ordinalSuffix} ${month}, ${dayOfWeek} ${hours}:${minutes} ${ampm}`;
}

function getAQIDescription(aqi) {
    let description;

    switch (aqi) {
        case 1:
            description = "Very Good";
            break;
        case 2:
            description = "Good";
            break;
        case 3:
            description = "Average";
            break;
        case 4:
            description = "Bad";
            break;
        case 5:
            description = "Very Bad";
            break;
        default:
            description = "Invalid AQI";
            break;
    }

    return description;
}




function renderPageW(name,temp,feels_like,temp_max,temp_min,sea_level,pressure,humidity,grnd_level,description,icon,speed, deg,sunrise,sunset,aqi){

    document.getElementById('instruction').innerHTML = `Weather information for ${name}...!`;
    document.getElementById('description').innerHTML = `${description}`;
    document.getElementById('main-emoji').innerHTML = `<img src="${returnEmojiLink(description)}" alt="icon">`;

    
    document.getElementById('city-name').innerHTML = `${name}`;
    document.getElementById('temp').innerHTML = `${Math.round((temp - 273.15) * 10) / 10}`;
    document.getElementById('feels_like').innerHTML = `Feels like: ${Math.round((feels_like - 273.15) * 10) / 10} °C`;
    document.getElementById('temp_max').innerHTML = ` ${Math.round((temp_max - 273.15) * 10) / 10}  `;
    document.getElementById('temp_min').innerHTML = ` | ${Math.round((temp_min - 273.15) * 10) / 10} °C`;
    document.getElementById('sea_level').innerHTML = `Sea Level Pressure: ${Math.round(sea_level)} hPa`;
    document.getElementById('pressure').innerHTML = `Pressure: ${Math.round(pressure)} hPa`;
    document.getElementById('humidity').innerHTML = `Humidity: ${Math.round(humidity)} %`;
    document.getElementById('grnd_level').innerHTML = `Ground Level: ${Math.round(grnd_level)} hPa`;
    document.getElementById('aqi').innerHTML = `Air Quality Index : ${getAQIDescription(aqi)} `;
    
    let aqiString = getAQIDescription(aqi);
    let aqiArray = aqiString.split(" ");

    document.getElementById('aqi-button').innerHTML = `<button class="${aqiArray.length==1 ? aqiArray[0] : aqiArray[0] + '-' + aqiArray[1]}">${aqiString}</button>`;

    document.getElementById('aqi-advise').innerHTML = `${aqi>=4 ? "  Highly Risky to go out" : "  Safe to go out"}`;

    document.getElementById('speed').innerHTML = ` ${(speed * 3.6).toFixed(1)} km/h`;
    document.getElementById('deg').innerHTML = `${getWindDirection(deg)}  `;
    let sunR = formatUnixTimestamp(sunrise);
    let sunS = formatUnixTimestamp(sunset);
    let arraySunR = sunR.split(" ");
    let arraySunS = sunS.split(" ");
    document.getElementById('sunrise').innerHTML = `Sunrise: ${arraySunR[3]} ${arraySunS[4]} `;
    document.getElementById('sunset').innerHTML = `Sunset: ${arraySunS[3]} ${arraySunS[4]} `;

}

function renderPageF(hourF, timePeriod) {
    const dt = hourF.dt;
    const description = hourF.weather[0].description;
    const temp = hourF.main.temp;
    const str = formatUnixTimestamp(dt);
    const timearray = str.split(" ");
    document.getElementById(`date-time${timePeriod}`).innerHTML = `${timearray[2]} ${timearray[3]} ${timearray[4]}`;
    document.getElementById(`temp${timePeriod}`).innerHTML = `${Math.round((temp - 273.15) * 10) / 10} °C`;
    document.getElementById(`description${timePeriod}`).innerHTML = `<img src="${returnEmojiLink(description)}" alt="icon">`;

}


async function loadStats(country,lat,lon,name,state){
    weather_api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
    forecast_api = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;
    air_api = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`

    try{
        const responseW = await fetch(weather_api);
        const responseF = await fetch(forecast_api);
        const responseA = await fetch(air_api);

        console.log('Response from Weather API: ' , responseW['ok']);
        console.log('Response from Forecast API: ' , responseF['ok']);
        console.log('Response from Forecast API: ' , responseA['ok']);
        
        let dataW = await responseW.json();
        let dataF = await responseF.json();
        let dataA = await responseA.json();

        
        console.log(dataW);
        console.log(dataF);
        console.log(dataA);
        if(!responseW.ok || !responseF.ok || !responseA.ok ){
            document.getElementById('instruction').innerHTML = `Something went wrong...!   :(`;
            throw new Error("Response not ok");
        }
        else if(dataW.length==0 || dataF.length==0  ){
            document.getElementById('instruction').innerHTML = `Could not find the place you are looking for..!   :( `;
            console.log("Weather API couldn't find your place");
            
        }
        else{
            /*console.log(data.main.temp-273.15);*/
            /*console.log(data); */
            
            let {temp,feels_like,temp_max,temp_min,sea_level,pressure,humidity,grnd_level} = dataW.main;
            let {description,icon} = dataW.weather[0];
            let {speed, deg} = dataW.wind;
            let {sunrise,sunset} = dataW.sys;
            let aqi = dataA.list[0].main.aqi;
            console.log("Air QUality Index", aqi);
            console.log("description", description);
            console.log(icon, speed, deg, sunrise, sunset);
            console.log("Temp, pressure , feelslie", temp ," ", pressure, " ", feels_like);

            console.log(dataF.list[0]); 

            const threeF = dataF.list[0];
            const sixF = dataF.list[1];
            const nineF = dataF.list[2];
            const twelveF = dataF.list[3];
            const fifteenF = dataF.list[4];
            const eighteenF = dataF.list[5]; 

            renderPageF(threeF, 'ThreeF');
            renderPageF(sixF, 'SixF');
            renderPageF(nineF, 'NineF');
            renderPageF(twelveF, 'TwelveF');
            renderPageF(fifteenF, 'FifteenF');
            renderPageF(eighteenF, 'EighteenF');
            renderPageW(name,temp,feels_like,temp_max,temp_min,sea_level,pressure,humidity,grnd_level,description,icon,speed, deg,sunrise,sunset,aqi);
        }
        
    }
    catch(error){
        console.error(error);
    }

}

async function getLonLat(){
    let searchBarEl = document.getElementById('searchBar');
    let cityName = searchBarEl.value;
    console.log("Your Query City is : " , cityName);
    
    let Geocode_api = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${api_key}`;    

    try{
        const response = await fetch(Geocode_api);
        console.log('Response from Geo API: ' , response['ok']);
        let data = await response.json();

        if(!response.ok){
            document.getElementById('instruction').innerHTML = `Something went wrong...!   :(`;
            throw new Error("Response False")
        }
        else if(data.length==0){
            document.getElementById('instruction').innerHTML = `Could not find the place you are looking for..!   :( `;
            console.log("Could not find your Query.");
        }
        else{
            console.log(data[0]);
            let {country,lat,lon,name,state} = data[0];
            loadStats(country,lat,lon,name,state);
        }
    }
    catch(error){
        console.error(error);
    }
}

document.getElementById('searchButton').addEventListener('click' , getLonLat);
