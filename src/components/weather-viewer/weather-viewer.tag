import riot from "riot";
import dispatcher from "../../dispatcher";
import EVENT from "../../events";
import WeatherViewer from "./weather-viewer";

<weather-viewer>
    <div>I am weather viewer</div>
    <div class="weather-viewer-component">
        <div class="day-weather-forecast">
            <img src="http://openweathermap.org/img/w/10d.png" alt="cloudy weather icon"/>
        </div>
        <div class="days-container">
            <a href="#" rel="nofollow">
                <h3>Sat</h3>
                <span></span>
            </a>
        </div>
    </div>

    <script>
        this.controller = null;
        this.state = {};

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
