<a name="top"/>
# Introduction

* [Introduction](README.md#top)
  * [How It Works](README.md#intro)
  * [Development](README.md#development)
  * [Building for Production](README.md#build)
  * [Running Tests](README.md#test)
  * [Additional Commands](README.md#more)

<a name="intro"/>
### How it works

The Demo App is a web application written in React with a Node.js Express server to serve the app as well as provide an authentication token (more on this later). The app uses the MWSL API to grab data for display as well as sending API requests to update or create Mines.

To use the app we must login using an IDIR account. If we are not logged in the app will redirect to the login screen and upon return parse the returned jwt token.

We use the [fetch api](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) and pass an OAUTH authentication token with the request to grab data from MWSL. Our token is fetched from the express server when we log into the app using the jwt token grabbed when we logged in.

<a name="development"/>
### Development

To start developing you need node.js >= 8.4, an npm client, and a git client.
All the commands shown below use [yarn](https://yarnpkg.com/en/) but [npm](https://www.npmjs.com/) works as well using `npm run <command>`

1. Checkout the code from github (you will want to create a fork if you plan on submitting a pull request).
> `git clone <repo>``

2. Install dependencies
> `yarn`

3. Run the development server
> `yarn dev`

This starts an express server on port 5000 and the webpack dev server on port 3000. Local requests from the webpack server are proxied to the express server so there is no need to send requests to port 5000. This mimics the production setup where we only use one server to serve all the resources.

Both servers run in watch mode so any changes to the source code is immediately built and deployed!

<a name="build"/>
### Building for Production

To make a production ready build
> `yarn build`

This creates a [bundle](https://github.com/facebook/create-react-app#npm-run-build-or-yarn-build)* with trimmed down dependencies and production versions of the libraries we use.

To start the app in production mode
> `yarn start`

\* without the service worker

<a name="test"/>
### Running Tests

Unit tests are run with [Jest](https://facebook.github.io/jest/) and use [Enzyme](http://airbnb.io/enzyme/) for rendering components.

To run the test suite
> `yarn test`

By default this runs all the tests and exits

Tests can also be run in watch mode (useful for development)
> `yarn test:watch`

Some tests are done by comparing [snapshots](https://facebook.github.io/jest/docs/en/snapshot-testing.html). The snapshots need to be updated when the UI changes. To do so run the tests in watch mode and hit `u` for update.

<a name="more"/>
### Additional Commands

Check out `package.json` for more commands. Anything in the `scripts` section can be run with
>`yarn <script>`

or
>`npm run <script>`