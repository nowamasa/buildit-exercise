## Setup
```
npm install
bash install-git-hooks.sh
```
Git hooks install is optional - installs git hooks that run eslint on pre-commit and execute jasmine tests on pre-push.

## Scripts summary
Command | description
------- | -----------
npm start | Performs babel and sass compile and opens app in node express server. App can be viewed at http://localhost:3000
npm test | Executes jasmine unit tests

## Development notes
* Node v10.6.3
* Developed on OSX and tested in Chrome 59
* Please view in Chrome if possible (not yet tested in IE)

## TODOs

* Cross browser testing e.g. download IE Virtual box VMs and test in IE10+
* A few more unit tests for higher coverage
* Show day of week in forecast date headers
* Display further weather data e.g. detailed views when clicking on time forecast
* Add package scripts to implement hot reloading on sass and js file changes
* Minify js compile (via a webpack.prod.config) and scss compile. Add script to package.json to run minified build
* Add functional browser tests using, for example cucumber and protractor
