const renderRawResponse = (res) => {
  // Takes the first 10 words from res
  
  let temp = res.STATION[0].OBSERVATIONS.air_temp_value_1.value;
  let tempDegF = temp*(9/5)+32
  
  let dew = res.STATION[0].OBSERVATIONS.dew_point_temperature_value_1d.value;
  let dewDegF = Math.round(dew*(9/5)+32);
  
  let rh = res.STATION[0].OBSERVATIONS.relative_humidity_value_1.value;
  
  let speed = Math.round((res.STATION[0].OBSERVATIONS.wind_speed_value_1.value)*2.23694);
  let direction = res.STATION[0].OBSERVATIONS.wind_direction_value_1.value;
  let gust = Math.round((res.STATION[0].OBSERVATIONS.wind_gust_value_1.value)*2.23694);
  
  let wind = `${getCardinal(direction)} ${speed} G ${gust} mph`;
  
  let stationPressure = Math.round((res.STATION[0].OBSERVATIONS.pressure_value_1d.value)/100);
  
 
  // Manipulates responseField to render the unformatted response
  
  //responseField.innerHTML = `<text>${JSON.stringify(tempDegF)}°F</text>`;
  temperature.innerHTML = `Temperature: ${tempDegF}°F`;
  dewPoint.innerHTML = `Dew Point: ${dewDegF}°F`;
  relativeHumidity.innerHTML = `Relative Humidity: ${rh}%`;
  windSum.innerHTML = `Wind: ${wind}`;
  pressure.innerHTML = `Station Pressure: ${stationPressure} mb`;
  tempHeader.innerHTML = `Current Conditions at ${getSTID()}:`;
  
}

//Get cardinal direction from degrees
const getCardinal = (direction) => {
  if(direction > 337.5){
  	cardinal = 'N';
  } else if(direction < 22.5){
  	cardinal = 'N';
  } else if(direction > 22.5 && direction < 67.5){
  	cardinal = 'NE';
  } else if(direction > 67.5 && direction < 112.5){
  	cardinal = 'E';
  } else if(direction > 112.5 && direction < 157.5){
  	cardinal = 'SE';
  } else if(direction > 157.5 && direction < 202.5){
  	cardinal = 'S';
  } else if(direction > 202.5 && direction < 247.5){
  	cardinal = 'SW';
  } else if(direction > 247.5 && direction < 292.5){
  	cardinal = 'W';
  } else if(direction > 292.5 && direction < 337.5){
  	cardinal = 'NW';
  }
  
  return cardinal
}

//Parts for URL
const token = "token=6352e76903434fe2bf18cf47b98589b5";
const variable = "vars=air_temp,dew_point_temperature,relative_humidity,wind_speed,wind_direction,wind_gust,pressure";
const url = "https://api.synopticdata.com/v2/stations/latest?";

//HTML fields to fill
const responseField = document.querySelector('#responseField');
const tempHeader = document.querySelector('#tempHeader');
const submit = document.querySelector('#submit');
const temperature = document.querySelector('#temperature');
const dewPoint = document.querySelector('#dewPoint');
const relativeHumidity = document.querySelector('#relativeHumidity');
const windSum = document.querySelector('#windSum');
const pressure = document.querySelector('#pressure');

//Retrieve request station id
const getSTID = () => {
	const station = document.querySelector('#input')
	const stid = station.value;
	return stid
}

//Http request
const getTemperature = () => {
	const station = document.querySelector('#input')
	const stid = 'stids='+station.value;
	const endpoint = url+'&'+variable+'&'+stid+'&'+token
	
	const xhr = new XMLHttpRequest();
	
	
	xhr.responseType = 'json';
	
	xhr.onreadystatechange = (() => {
		if(xhr.readyState === XMLHttpRequest.DONE){
			renderRawResponse(xhr.response)
		}
	})
	
	xhr.open("GET",endpoint)
	xhr.send()
	
}

//Post and clear results from previous API calls
const displaySuggestions = (event) => {
  event.preventDefault();
  while(responseField.firstChild){
    responseField.removeChild(responseField.firstChild);
  };
  getTemperature();
  getSTID();
}

submit.addEventListener('click', displaySuggestions);