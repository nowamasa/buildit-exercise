import riot from "riot";
import dispatcher from "../../dispatcher";
import EVENT from "../../events";
import WeatherViewer from "./weather-viewer";

<weather-viewer>
    <div class="weather-viewer-component">
        <h2>{state.city}</h2>
        <p>{state.showLoadingMsg.toString()}</p>
        <div class="loading-msg" hide="{state.showLoadingMsg === false}">
            Loading weather...
        </div>
        <div class="error-msg" show="{state.errorMessage}">
            {state.errorMessage.message}
        </div>
        <section if="{state.days}">
            <div each="{key, value in state.days}">
                <h3><strong>Date</strong> {key}</h3>
                <div>{value.length.toString()}</div>
                <div each="{weatherObject in value}">
                    <div>Time: {weatherObject.time}</div>
                    <div>{weatherObject.shortDescription}</div>
                    <img src="{weatherObject.iconUrl}" alt="{weatherObject.shortDescription} icon"/>
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
            console.log("tag satte = ", this.state);
            this.update();
        });

    </script>

</weather-viewer>
