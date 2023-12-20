![Peers](assets/images/banner.png)

# Peers

A platform to securely transfer files between 2 peers, built with Nuxt.js & Socket.io.

## Build Setup

```bash
# install dependencies
$ npm install

# install socket server's dependencies
$ cd server
$ npm install

# return to root folder
cd ../

# serve with hot reload at localhost:3000 (default)
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start
```

By default, the Nuxt.js server and the socket server run in the same session, on ports 3000 and 5000 respectively.
This can be overriden by environment variables - `PORT` for the Nuxt.js server, `SOCKET_PORT` for the socket server.

Example:

```bash
# serving web app on localhost:3001 & socket server on localhost:3002
$ PORT=3001 SOCKET_PORT=3002 npm run dev

# Alternatively, you can use an .env file

# .env
PORT=3001
SOCKET_PORT=3002

# Serve as usual
$ npm run dev
```

### Using docker

You can also use Docker to run this project.

```bash
$ docker build -t peers-app .
$ docker-compose up
```

## Screenshots

![Main screen](/assets/images/screenshots/screenshot-1.png)
![Uploading files](/assets/images/screenshots/screenshot-2.png)
![Files transfer progress](/assets/images/screenshots/screenshot-3.png)
