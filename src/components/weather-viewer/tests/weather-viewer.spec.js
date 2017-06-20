import WeatherViewer from "../weather-viewer";
import EVENT from "../../../events";

describe("WeatherViewer class", ()=> {

    let weatherViewer = null;

    const dispatcher = {trigger: ()=> {}}
    const weatherProvider = {
        fetchFiveDayForecast: ()=> {}
    };

    beforeEach(()=> {
        spyOn(WeatherViewer.prototype, "_getDispatcher").and.returnValue(dispatcher);
        spyOn(WeatherViewer.prototype, "_getWeatherProvider").and.returnValue(weatherProvider);
    });

    describe("constructor", ()=> {
        beforeEach(()=> {
            spyOn(WeatherViewer.prototype, "fetchWeatherData").and.callFake(()=>{});
            spyOn(WeatherViewer.prototype, "_dataFetchCompleted").and.callFake(()=> {});
            weatherViewer = new WeatherViewer();
        });

        it("should set initial component state", ()=> {
            expect(weatherViewer.state).toEqual({
                showLoadingMsg: true,
                city: '',
                days: [],
                errorMessage: null
            });
        });

        it("should set dispatcher property", ()=> {
            expect(weatherViewer.dispatcher).toEqual(dispatcher);
        });

        it("should set provider property", ()=> {
            expect(weatherViewer.provider).toEqual(weatherProvider);
        });

        it("should fetch weather data", ()=> {
            expect(weatherViewer.fetchWeatherData).toHaveBeenCalledWith("Edinburgh", "uk");
        });
    });

    describe("fetchWeatherData", ()=> {
        const cityName = "Edinburgh";
        const countryCode = "uk";

        it("should call provider fetchFiveDayForecast", ()=> {
            spyOn(weatherProvider, "fetchFiveDayForecast").and.returnValue(Promise.resolve());
            spyOn(WeatherViewer.prototype, "_dataFetchCompleted").and.callFake(()=> {});
            weatherViewer = new WeatherViewer();
            weatherViewer.fetchWeatherData(cityName, countryCode);
            expect(weatherProvider.fetchFiveDayForecast)
                    .toHaveBeenCalledWith(cityName, countryCode);
        });

        it("should call _dataFetchCompleted on successful response", (done)=> {
            let promiseHelper = {};
            let dataFetchCompletedCallCount = 0;
            const waitForFetchPromise = new Promise((resolve,reject)=> {
                promiseHelper.resolve = resolve;
                promiseHelper.reject = reject;
            });
            spyOn(WeatherViewer.prototype, "_dataFetchCompleted").and.callFake(()=> {
                dataFetchCompletedCallCount++;
                // first _dataFetchCompleted call is from the constructor call to fetchWeatherData.
                // We want the waitForFetchPromise to resolve on the second call triggered by
                // the test line below - weatherViewer.fetchWeatherData(cityName, countryCode);
                if (dataFetchCompletedCallCount === 2) {
                    promiseHelper.resolve();
                }
            });
            spyOn(weatherProvider, "fetchFiveDayForecast").and.returnValue(Promise.resolve());

            weatherViewer = new WeatherViewer();
            weatherViewer.fetchWeatherData(cityName, countryCode);
            waitForFetchPromise.then(()=> {
                expect(WeatherViewer.prototype._dataFetchCompleted).toHaveBeenCalled();
                done();
            });
        });

        it("should call _fetchDataError on error response", (done)=> {
            let promiseHelper = {};
            let dataFetchErrorCallCount = 0;
            const waitForFetchPromise = new Promise((resolve,reject)=> {
                promiseHelper.resolve = resolve;
                promiseHelper.reject = reject;
            });
            spyOn(WeatherViewer.prototype, "_fetchDataError").and.callFake(()=> {
                dataFetchErrorCallCount++;
                // first call to _fetchDataError is from the constructor call to fetchWeatherData.
                // We want the waitForFetchPromise to reject on the second call triggered by
                // the test line below - weatherViewer.fetchWeatherData(cityName, countryCode);
                if (dataFetchErrorCallCount === 2) {
                    promiseHelper.reject({message: 'err msg'});
                }
            });
            spyOn(weatherProvider, "fetchFiveDayForecast").and.callFake(()=> {
                return Promise.reject({message: 'err msg'})
            });
            weatherViewer = new WeatherViewer();
            weatherViewer.fetchWeatherData(cityName, countryCode);
            waitForFetchPromise.catch(()=> {
                expect(WeatherViewer.prototype._fetchDataError).toHaveBeenCalled();
                done();
            });
        });
    });

    describe("_dataFetchCompleted", ()=> {
        const stubResponse = {id: "stubbed response"};
        const mockTidyResponse = {
            days: {"2017-11-22": []},
            city: "Edinburgh"
        };

        beforeEach(()=> {
            spyOn(WeatherViewer.prototype, "fetchWeatherData").and.callFake(()=>{});
            weatherViewer = new WeatherViewer();
            spyOn(weatherViewer, "_tidyResponse").and.returnValue(mockTidyResponse);
            spyOn(dispatcher, "trigger").and.callFake(()=>{});
        });

        it("should set component state", ()=> {
            weatherViewer._dataFetchCompleted(stubResponse);
            expect(weatherViewer.state).toEqual({
                city: mockTidyResponse.city,
                days: mockTidyResponse.days,
                showLoadingMsg: false,
                errorMessage: null
            });
        });

        it("should trigger riot update event", ()=> {
            weatherViewer._dataFetchCompleted(stubResponse);
            expect(weatherViewer.dispatcher.trigger).toHaveBeenCalledWith(
                EVENT.WEATHER_VIEWER_RIOT_UPDATE, weatherViewer.state
            );
        });
    });

    describe("_fetchDataError", ()=> {
        const errorResponse = {message: "Request failed"};

        beforeEach(()=> {
            spyOn(WeatherViewer.prototype, "fetchWeatherData").and.callFake(()=>{});
            weatherViewer = new WeatherViewer();
            spyOn(dispatcher, "trigger").and.callFake(()=>{});
        });

        it("should update component state", ()=> {
            weatherViewer._fetchDataError(errorResponse);
            expect(weatherViewer.state.showLoadingMsg).toEqual(false);
            expect(weatherViewer.state.errorMessage).toEqual(errorResponse.message);
        });

        it("should trigger riot update event", ()=> {
            weatherViewer._fetchDataError(errorResponse);
            expect(weatherViewer.dispatcher.trigger).toHaveBeenCalledWith(
                EVENT.WEATHER_VIEWER_RIOT_UPDATE, weatherViewer.state
            );
        });
    });
});
