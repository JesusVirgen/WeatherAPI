const container = document.querySelector('.container');
const result = document.querySelector('#result');
const form = document.querySelector('#form');

window.addEventListener('load', () => {
    form.addEventListener('submit', serachWeather);
})

function serachWeather(e) {
    e.preventDefault();

    const city = document.querySelector('#city').value;
    const country = document.querySelector('#country').value;

    if (city === '' || country === '') {
        showError('Ambos campos son obligatorios');

        return;
    }

    consultAPI(city, country);
}

function showError(message) {
    const alert = document.querySelector('.error_message');
    const createAlert = document.createElement('DIV');

    if (!alert) { 

        createAlert.classList.add('error_message');

        createAlert.innerHTML =`
            <strong>Error!</strong>
            <span>${message}</span>
        `;

        container.appendChild(createAlert);
    }

    setTimeout(() => {
        createAlert.remove();
    }, 5000);
}

function consultAPI(city, country) { 
    const appId = 'bdc9be3e03f33174bde2f062c3d78384';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${appId}`;

    spinner();

    fetch(url)
        .then( response => response.json())
        .then( data => {
            clearWeather();
            
            if(data.cod === "404") {
                showError('Ciudad no encontrada');

                return;
            }
            showWeather(data);
        })
}

function showWeather(data) {
    const { name, main: { temp, temp_max, temp_min } } = data;

    console.log(data)

    const centigrade = kelvinToCentigrade(temp);
    const maxCentigrade = kelvinToCentigrade(temp_max);
    const minCentigrade = kelvinToCentigrade(temp_min);

    const actualCountry = document.createElement('P');
    actualCountry.innerHTML = `Temperatura actual de ${name}`;
    actualCountry.classList.add('country_field');

    const tempActual = document.createElement('P');
    tempActual.innerHTML = `${centigrade} &#8451`;
    tempActual.classList.add('centigrade_field');

    const tempMax = document.createElement('P');
    tempMax.innerHTML = `Max: ${maxCentigrade} &#8451`;
    tempMax.classList.add('maxmin_centigrade_field');

    const tempMin = document.createElement('P');
    tempMin.innerHTML = `Min: ${minCentigrade} &#8451`;
    tempMin.classList.add('maxmin_centigrade_field');

    const centigradeContent = document.createElement('DIV');
    centigradeContent.classList.add('centigrade_content')

    centigradeContent.appendChild(actualCountry);
    centigradeContent.appendChild(tempActual);
    centigradeContent.appendChild(tempMax);
    centigradeContent.appendChild(tempMin);
    result.appendChild(centigradeContent);
}

function kelvinToCentigrade(grades) {
    return parseInt(grades - 273.15);
}

function clearWeather() {
    while(result.firstChild) { 
        result.removeChild(result.firstChild);
    }
}

function spinner() {
    clearWeather();
    
    const divSpinner = document.createElement('DIV');
    divSpinner.classList.add('spinner');

    divSpinner.innerHTML = `
        <div class="dot1"></div>
        <div class="dot2"></div>
    `;

    result.appendChild(divSpinner)
}