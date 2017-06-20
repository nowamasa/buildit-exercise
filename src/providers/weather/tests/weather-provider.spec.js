import WeatherProvider from "../weather-provider";
import Config from "../config"

describe("WeatherProvider", ()=> {

    let weatherProvider = null;
    const dispatcher = {trigger: ()=> {}};

    function getPromise(promiseHelper) {
        return new Promise((resolve,reject)=> {
            promiseHelper.resolve = resolve;
            promiseHelper.reject = reject;
        });
    }

    beforeEach(()=> {
        spyOn(WeatherProvider.prototype, "_getDispatcher").and.returnValue(dispatcher);
        weatherProvider = new WeatherProvider();
    });

    describe("constructor", ()=> {
        it("should set dispatcher property", ()=> {
            expect(weatherProvider.dispatcher).toEqual(dispatcher);
        });
    });

    describe("fetchFiveDayForecast", ()=> {
        const requestConfig = {stubId: "stubbed request config"};
        const httpRequest = {stubId: "stubbed httpRequest"};
        let fetchPromiseHelper = {}
        let timeoutPromiseHelper = {};

        beforeEach(()=> {
            spyOn(weatherProvider, "_getRequestConfig").and.returnValue(requestConfig);
            spyOn(weatherProvider, "_getFiveDayForecastUrl").and.returnValue(Config.URL);
            spyOn(weatherProvider, "_getRequestInstance").and.returnValue(httpRequest);
            spyOn(weatherProvider, "_getRequestTimeoutPromise").and.returnValue(
                getPromise(timeoutPromiseHelper)
            );
            spyOn(weatherProvider, "_getFetchPromise").and.returnValue(
                getPromise(fetchPromiseHelper)
            );
        });

        it("should call _getResponseContent when fetch response status is ok", (done)=> {
            let waitForPromiseRaceHelper = {};
            const waitForPromiseRace = getPromise(waitForPromiseRaceHelper);
            const responseData = {ok: true, description: "fake response data"};
            spyOn(weatherProvider, "_getResponseContent").and.callFake(()=> {
                waitForPromiseRaceHelper.resolve();
            });
            weatherProvider.fetchFiveDayForecast("Edinburgh", "uk");
            fetchPromiseHelper.resolve(responseData);
            waitForPromiseRace.then(()=> {
                expect(weatherProvider._getResponseContent).toHaveBeenCalledWith(responseData);
                done();
            });
        });

        it("should call _catchFetchError when fetch response status is not ok", (done)=> {
            let waitForPromiseRaceHelper = {};
            const waitForPromiseRace = getPromise(waitForPromiseRaceHelper);
            const responseData = {ok: false};
            spyOn(weatherProvider, "_getResponseContent").and.callThrough();
            spyOn(weatherProvider, "_catchFetchError").and.callFake(()=> {
                waitForPromiseRaceHelper.resolve();
            });
            weatherProvider.fetchFiveDayForecast("Edinburgh", "uk").catch(()=>{});
            fetchPromiseHelper.resolve(responseData);
            waitForPromiseRace.then(()=> {
                expect(weatherProvider._catchFetchError).toHaveBeenCalledWith(
                    {message: Config.MESSAGES.REQUEST_FAILED}
                );
                done();
            });
        });

        it("should call _catchFetchError when fetch request times out", (done)=> {
            let waitForPromiseRaceHelper = {};
            const waitForPromiseRace = getPromise(waitForPromiseRaceHelper);
            spyOn(weatherProvider, "_catchFetchError").and.callFake(()=> {
                waitForPromiseRaceHelper.reject();
            });
            weatherProvider.fetchFiveDayForecast("Edinburgh", "uk").catch(()=>{});
            timeoutPromiseHelper.reject({message: Config.MESSAGES.REQUEST_TIMED_OUT});
            waitForPromiseRace.catch(()=> {
                expect(weatherProvider._catchFetchError).toHaveBeenCalledWith(
                    {message: Config.MESSAGES.REQUEST_TIMED_OUT}
                );
                done();
            });
        });
    });

    describe("_getRequestConfig", ()=> {
        const headers = {description: "fake headers object"};

        beforeEach(()=> {
            weatherProvider = new WeatherProvider();
            spyOn(weatherProvider, "_getHeadersInstance").and.returnValue(headers);
        });

        it("should get a Headers object", ()=> {
            weatherProvider._getRequestConfig();
            expect(weatherProvider._getHeadersInstance).toHaveBeenCalledWith(
                {"Accept": "Application/json"}
            )
        });

        it("should return request configuration", ()=> {
            expect(weatherProvider._getRequestConfig()).toEqual({
                method: "GET",
                headers: headers,
                mode: 'cors',
                cache: 'default'
            })
        })
    });

    describe("_getResponseContent", ()=> {
        const headers = {description: "fake headers object"};

        beforeEach(()=> {
            weatherProvider = new WeatherProvider();
            spyOn(weatherProvider, "_getHeadersInstance").and.returnValue(headers);
        });

        it("should return response json when response is ok", ()=> {
            const response = {ok: true, json: ()=> {}};
            const json = {description: "mock json returned from response.json call"};
            spyOn(response, "json").and.returnValue(json);
            const result = weatherProvider._getResponseContent(response);
            expect(response.json).toHaveBeenCalled();
            expect(result).toEqual(json);
        });

        it("should return a rejected promise when response is not ok", ()=> {
            const response = {ok: false, json: ()=> {}};
            spyOn(Promise, "reject").and.callFake(()=> {});
            const result = weatherProvider._getResponseContent(response);
            expect(Promise.reject).toHaveBeenCalled();
            expect(result).toEqual(Promise.reject({
                message: Config.MESSAGES.REQUEST_FAILED
            }));
        });
    });

    describe("_getFiveDayForecastUrl", ()=> {
        it("Shoud return expected url", ()=> {
            const cityName = "Edinburgh";
            const countryCode = "uk";
            const expectedUrl = [Config.URL + '?q=',
                encodeURIComponent(cityName) + ',' + countryCode, "&APPID=" + Config.API_KEY
            ].join('');
            weatherProvider = new WeatherProvider();
            const result = weatherProvider._getFiveDayForecastUrl(cityName, countryCode);
            expect(result).toEqual(expectedUrl);
        });
    });
});
