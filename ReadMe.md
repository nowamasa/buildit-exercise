## Setup
```
npm install
bash install-git-hooks
```
Git hooks install is optional - installs git hooks that run eslint on pre-commit and execute jasmine tests on pre-push.

## Scripts summary
Command | description
------- | -----------
npm start | Performs babel and sass compile and opens app in node express server. App can be viewed at http://localhost:3000
npm test | Executes jasmine unit tests

## Development notes
Developed on OSX and tested in Chrome 58
Please view in Chrome if possible (not yet tested in IE)

## TODOs

If had more time;

* Cross browser testing e.g. download IE Virtual box VMs and test in IE10+
* Complete unit tests
* Add e2e cucumber tests using protractor
* Display more data in each days weather summary
* Add package scripts to implement hot reloading on sass and js file changes
