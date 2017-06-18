import WeatherProvider from "../../providers/weather/weather-provider";
import dispatcher from "../../dispatcher";
import EVENT from "../../events";

class WeatherViewer {

    constructor() {
        this.state = {
            showLoadingMsg: true,
            city: '',
            days: [],
            errorMessage: null
        }
        this.provider = this._getWeatherProvider();
        this.dispatcher = this._getDispatcher();
        this.fetchWeatherData("Edinburgh", "uk");
    }

    _getWeatherProvider() {
        return new WeatherProvider();
    }

    _getDispatcher() {
        return dispatcher;
    }

    fetchWeatherData(cityName, countryCode) {
        this.provider.fetchFiveDayForecast(cityName, countryCode)
                     .then(this._dataFetchCompleted.bind(this))
                     .catch(this._fetchDataError.bind(this))
    }

    _dataFetchCompleted(response) {
        console.log("data fetch completed res = ", response)
        const {city, days} = this._tidyResponse(response);
        this.state.city = city;
        this.state.days = days;
        this.state.showLoadingMsg = false;
        this.dispatcher.trigger(EVENT.WEATHER_VIEWER_RIOT_UPDATE, this.state);
    }

    _tidyResponse({city, list}) {
        let uniqueDates = {};
        const parsedList = list.map((item)=> {
            const splitDate = item.dt_txt.split(' ');
            const shortDate = splitDate[0];

            uniqueDates[shortDate] = [];
            item.shortDate = shortDate;
            item.time = splitDate[1].slice(0,5);
            item.shortDescription = item.weather[0].description;
            item.iconUrl = "http://openweathermap.org/img/w/" + item.weather[0].icon + ".png";

            return item;
        });
        return {
            city: city.name,
            days: this._getForecastsByDay(parsedList, uniqueDates)
        }
    }

    _getForecastsByDay(tidyList, uniqueDates) {
        for(let key in uniqueDates) {
            uniqueDates[key] = tidyList.filter((item)=> {
                return item.shortDate === key;
            });
        }
        return uniqueDates;
    }

    _fetchDataError(response) {
        console.log("_fetchDataError", response);
        this.state.showLoadingMsg = false;
        this.state.errorMessage = response.message;
        this.dispatcher.trigger(EVENT.WEATHER_VIEWER_RIOT_UPDATE, this.state);
    }
}

export default WeatherViewer;
