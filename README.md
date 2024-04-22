# Get started with the GoMeddo JS SDK

[![Screenshot](./screenshot.png)](https://gomeddo.github.io/GoMeddo-Booking-Demo/)


This project uses the [GoMeddo JS SDK](https://github.com/gomeddo/js-sdk) to implement an application that lets a user book an appointment with you via [GoMeddo](https://gomeddo.com).


[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fgomeddo%2FGoMeddo-Booking-Demo&env=REACT_APP_API_KEY,REACT_APP_B25_RESOURCES,REACT_APP_TIMESLOT_LENGTH&envDescription=Description%20of%20the%20environment%20variables%20can%20be%20found%20in%20the%20repository%20readme&envLink=https%3A%2F%2Fgithub.com%2Fgomeddo%2FGoMeddo-Booking-Demo%23environment-variables)

## Demo

You can find a demo [here](https://gomeddo.github.io/GoMeddo-Booking-Demo/).


## Environment variables

| Var                       | Description                                                                                                                              |
|---------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| REACT_APP_ENVIRONMENT     | The environment to use. Can be one of the following: DEVELOP, ACCEPTANCE, STAGING, PRODUCTION. Default: PRODUCTION                       |
| REACT_APP_API_KEY         | The api key of your GoMeddo Landingpage environment. Can be configured via [https://welcome.gomeddo.com](https://welcome.gomeddo.com) |
| REACT_APP_B25_RESOURCES   | The resources you want to generate timeslots for. List of Salesforce ids seperated by a semicolon (;)                                    |
| REACT_APP_TIMESLOT_LENGTH | The length of the timeslots in minutes                                                                                                   |


## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.