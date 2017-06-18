import WeatherProvider from "../../providers/weather/weather-provider";

class WeatherViewer {
    constructor() {
        console.log("WeatherViewer constructor called");
        this.state = {
            weatherResults: []
        }
        this.provider = new WeatherProvider();
    }

    onclickDay(e) {
        console.log("TODO", e)
    }

    _attachEventHandler(selector) {
        document.querySelector(selector).addEventListener(
            "click", this.onclickDay.bind(this)
        );
    }

    _fetchWeatherData() {
        this.provider.fetchWeatherData()
                     .then(this._dataFetchCompleted)
                     .catch(this._fetchDataError)
    }

    _dataFetchCompleted(response) {
        const componentData = this._mapResponse(response);
        console.log(componentData)
    }

    _fetchDataError(response) {
        console.log(response)
    }
}

export default WeatherViewer;
