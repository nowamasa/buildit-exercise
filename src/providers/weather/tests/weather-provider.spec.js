import WeatherProvider from "../weather-provider";
import Config from "../config"

describe("WeatherProvider", ()=> {

    let weatherProvider = null;
    const dispatcher = {trigger: ()=> {}};
    const window = {fetch:()=> {}}

    beforeEach(()=> {
        spyOn(WeatherProvider.prototype, "_getDispatcher").andReturn(dispatcher);
        spyOn(WeatherProvider.prototype, "_getWindowReference").andReturn(window);
        weatherProvider = new WeatherProvider();
    });

    describe("constructor", ()=> {
        it("should set dispatcher property", ()=> {
            expect(weatherProvider.dispatcher).toEqual(dispatcher);
        });
    });

    describe("fetchFiveDayForecast", ()=> {
        const cityName = "Edinburgh";
        const countryCode = "uk";
        const responseData = {description: "fake response data"};
        const fn = (resolve, reject)=> {}; // eslint-disable-line no-unused-vars
        const timeoutPromise = new Promise(fn);
        const resolvedFetchPromise = Promise.resolve(responseData);
        const requestConfig = {stubId: "stubbed request config"};
        const httpRequest = {stubId: "stubbed httpRequest"};

        beforeEach(()=> {
            spyOn(window, "fetch").andReturn(resolvedFetchPromise);
            spyOn(weatherProvider, "_getRequestTimeoutPromise").andReturn(timeoutPromise);
            spyOn(weatherProvider, "_getRequestConfig").andReturn(requestConfig);
            spyOn(weatherProvider, "_getFiveDayForecastUrl").andReturn(Config.URL);
            spyOn(weatherProvider, "_getRequestInstance").andReturn(httpRequest);
        });

        it("should call window fetch", ()=> {
            weatherProvider.fetchFiveDayForecast(cityName, countryCode);
            expect(window.fetch).toHaveBeenCalledWith(httpRequest);
        });

        it("should call _getResponseContent when fetch promise resolves", ()=> {
            let fetchPromiseResolved = false;
            spyOn(weatherProvider, "_getResponseContent").andCallFake(()=>{
                fetchPromiseResolved = true;
            });
            weatherProvider.fetchFiveDayForecast(cityName, countryCode);
            waitsFor(()=> {
                    return fetchPromiseResolved === true;
                }, "Timeout exceeded waiting for fetch promise to resolve", 500
            );
            runs(()=> {
                expect(weatherProvider._getResponseContent)
                    .toHaveBeenCalledWith(responseData);
            });
        });

        it("should return a rejected promise when fetch promise rejects", ()=> {
            let fetchPromiseRejected = false;
            spyOn(weatherProvider, "_getResponseContent").andCallFake(()=>{
                fetchPromiseRejected = true;
            });
            weatherProvider.fetchFiveDayForecast(cityName, countryCode);
            waitsFor(()=> {
                    return fetchPromiseRejected === true;
                }, "Timeout exceeded waiting for fetch promise to resolve", 500
            );
            runs(()=> {
                expect(weatherProvider._getResponseContent)
                    .toHaveBeenCalledWith(responseData);
            });
        });
    });

    describe("_getRequestConfig", ()=> {
        const headers = {description: "fake headers object"};

        beforeEach(()=> {
            weatherProvider = new WeatherProvider();
            spyOn(weatherProvider, "_getHeadersInstance").andReturn(headers);
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
            spyOn(weatherProvider, "_getHeadersInstance").andReturn(headers);
        });

        it("should return response json when response is ok", ()=> {
            const response = {ok: true, json: ()=> {}};
            const json = {description: "mock json returned from response.json call"};
            spyOn(response, "json").andReturn(json);
            const result = weatherProvider._getResponseContent(response);
            expect(response.json).toHaveBeenCalled();
            expect(result).toEqual(json);
        });

        it("should return a rejected promise when response is not ok", ()=> {
            const response = {ok: false, json: ()=> {}};
            spyOn(Promise, "reject").andCallFake(()=> {});
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
