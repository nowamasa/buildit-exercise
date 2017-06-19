import WeatherViewer from "../weather-viewer";
import EVENT from "../../../events";

describe("WeatherViewer class", ()=> {

    let weatherViewer = null;

    const dispatcher = {trigger: ()=> {}}
    const weatherProvider = {
        fetchFiveDayForecast: ()=> {}
    };

    beforeEach(()=> {
        spyOn(WeatherViewer.prototype, "_getDispatcher").andReturn(dispatcher);
        spyOn(WeatherViewer.prototype, "_getWeatherProvider").andReturn(weatherProvider);
    });

    describe("constructor", ()=> {
        beforeEach(()=> {
            spyOn(WeatherViewer.prototype, "fetchWeatherData").andCallFake(()=>{});
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
            spyOn(weatherProvider, "fetchFiveDayForecast").andReturn(Promise.resolve());
            weatherViewer = new WeatherViewer();
            weatherViewer.fetchWeatherData(cityName, countryCode);
            expect(weatherProvider.fetchFiveDayForecast)
                    .toHaveBeenCalledWith(cityName, countryCode);
        });

        it("should call _dataFetchCompleted on successful response", ()=> {
            let promiseResolved = false;

            spyOn(WeatherViewer.prototype, "_dataFetchCompleted").andCallFake(()=> {
                promiseResolved = true;
            });
            spyOn(weatherProvider, "fetchFiveDayForecast").andReturn(Promise.resolve());
            weatherViewer = new WeatherViewer();
            // reset promiseResolved flag to false as fetchWeatherData
            // call from constructor will have set to true
            promiseResolved = false;
            weatherViewer.fetchWeatherData(cityName, countryCode);

            waitsFor(()=> {
                    return promiseResolved === true;
                }, "Timeout exceeded waiting for mocked promise to resolve", 500
            );

            runs(()=> {
                expect(WeatherViewer.prototype._dataFetchCompleted).toHaveBeenCalled();
            });
        });

        it("should call _fetchDataError on error response", ()=> {
            let promiseRejected = false;

            spyOn(WeatherViewer.prototype, "_fetchDataError").andCallFake(()=> {
                promiseRejected = true;
            });
            spyOn(weatherProvider, "fetchFiveDayForecast").andReturn(Promise.resolve());
            weatherViewer = new WeatherViewer();
            promiseRejected = false;
            weatherViewer.fetchWeatherData(cityName, countryCode);

            waitsFor(()=> {
                    return promiseRejected === true;
                }, "Timeout exceeded waiting for mocked promise to reject", 500
            );

            runs(()=> {
                expect(WeatherViewer.prototype._fetchDataError).toHaveBeenCalled();
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
            spyOn(WeatherViewer.prototype, "fetchWeatherData").andCallFake(()=>{});
            weatherViewer = new WeatherViewer();
            spyOn(weatherViewer, "_tidyResponse").andReturn(mockTidyResponse);
            spyOn(dispatcher, "trigger").andCallFake(()=>{});
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
            spyOn(WeatherViewer.prototype, "fetchWeatherData").andCallFake(()=>{});
            weatherViewer = new WeatherViewer();
            spyOn(dispatcher, "trigger").andCallFake(()=>{});
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
