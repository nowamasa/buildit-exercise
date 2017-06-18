import riot from "riot";
import dispatcher from "../../dispatcher";
import EVENT from "../../events";
import WeatherViewer from "./weather-viewer";

<weather-viewer>
    <div class="weather-viewer-component">
        <h2 class="city-heading">{state.city}</h2>
        <div class="loading-msg" hide="{state.showLoadingMsg === false}">
            Loading weather...
        </div>
        <div class="error-msg" show="{state.errorMessage}">
            {state.errorMessage.message}
        </div>
        <section if="{state.days}">
            <div class="day" each="{key, value in state.days}">
                <h3 class="date-heading">{key}</h3>
                <div class="clearfix">
                    <div each="{weatherObject in value}" class="day-weather-box">
                        <div class="box-content">
                            <div>{weatherObject.time}</div>
                            <div>{weatherObject.shortDescription}</div>
                            <img src="{weatherObject.iconUrl}" alt="{weatherObject.shortDescription} icon"/>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>

    <script>
        this.controller = null;
        this.state = {showLoadingMsg: true};

        this.on("mount", ()=> {
            this.controller = new WeatherViewer();
        });

        this.on("before-unmount", ()=> {
            this.controller = null;
        });

        dispatcher.on(EVENT.WEATHER_VIEWER_RIOT_UPDATE, (state)=> {
            this.state = state;
            this.update();
        });
    </script>

</weather-viewer>
