import Config from "./config";
import dispatcher from "../../dispatcher";

export default class WeatherProvider {

    constructor() {
        this.dispatcher = this._getDispatcher();
    }

    _getDispatcher() {
        return dispatcher;
    }

    fetchFiveDayForecast(cityName, countryCode) {
        const timeout = this._getRequestTimeoutPromise();
        const httpRequest = this._getRequestInstance(
            this._getFiveDayForecastUrl(cityName, countryCode),
            this._getRequestConfig()
        );
        const fetchRequest = this._getWindowReference().fetch(httpRequest);

        return Promise.race([timeout, fetchRequest])
                      .then(this._getResponseContent)
                      .catch((rejectInfo) => {
                          return Promise.reject({
                              message: rejectInfo || Config.MESSAGES.REQUEST_FAILED
                          });
                      });
    }

    _getResponseContent(response) {
        return response.ok ? response.json()
                           : Promise.reject({message: Config.MESSAGES.REQUEST_FAILED});
    }

    _getRequestTimeoutPromise() {
        return new Promise((resolve, reject)=> {
            this._getWindowReference().setTimeout(
                reject, Config.TIMEOUT_LIMIT, {message: Config.MESSAGES.REQUEST_TIMED_OUT}
            );
        });
    }

    _getFiveDayForecastUrl(cityName, countryCode) {
        return [Config.URL + '?q=', encodeURIComponent(cityName) + ',' + countryCode,
            "&APPID=" + Config.API_KEY].join('');
    }

    _getRequestConfig() {
        return {
            method: "GET",
            headers: this._getHeadersInstance({"Accept": "Application/json"}),
            mode: 'cors',
            cache: 'default'
        };
    }

    _getRequestInstance(url, requestConfig) {
        return new Request(url, requestConfig);
    }

    _getHeadersInstance(headerConfig) {
        return new Headers(headerConfig);
    }

    _getWindowReference() {
        return window;
    }
}
