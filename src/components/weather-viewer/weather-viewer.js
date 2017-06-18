import WeatherProvider from "../../providers/weather/weather-provider";

class WeatherViewer {

    constructor() {
        console.log("WeatherViewer constructor called");
        this.state = {
            showLoadingDataMessage: true,
            weatherData: {},
            currentDayIndex: 0
        }
        this.provider = new WeatherProvider();
        this.fetchWeatherData("Edinburgh", "uk");
    }

    fetchWeatherData(cityName, countryCode) {
        this.provider.fetchFiveDayForecast(cityName, countryCode)
                     .then(this._dataFetchCompleted.bind(this))
                     .catch(this._fetchDataError.bind(this))
    }

    _dataFetchCompleted(response) {
        console.log("TAG DATA RESPONSE = ", response);
        this._tidyResponse(response)
    }

    _tidyResponse({city, list}) {
        console.log("city = ", city, " list = ", list)
        let uniqueDates = {};
        let tidyList = list.map((item)=> {
            const shortDate = item.dt_txt.split(' ')[0];
            uniqueDates[shortDate] = [];
            item.shortDate = shortDate;
            return item;
        });

        console.log("tidyList = ", tidyList, " uniqueDates = ", uniqueDates)
        this._getForecastsByDay(tidyList, uniqueDates)
        return {
            city: city,
            list: tidyList
        }
    }

    _getForecastsByDay(tidyList, uniqueDates) {
        for(let key in uniqueDates) {
            uniqueDates[key] = tidyList.filter((item)=> {
                return item.shortDate === key;
            });
        }
        console.log("_getForecastsByDay = ", uniqueDates)
    }

    _fetchDataError(response) {
        console.log(response)
    }
}

export default WeatherViewer;
