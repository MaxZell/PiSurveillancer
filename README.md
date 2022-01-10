# PiSurveillancer
Video surveillance system.
Created for Raspbian.

- [OpenCV Required](https://www.pyimagesearch.com/2018/09/26/install-opencv-4-on-your-raspberry-pi/)

## File Structure
```
PiSurveillancer
│   app.js
│   server.js
|   
└───frontend
│   
└───node_modules

```

- `server.js` --> Server
- `app.js` --> Web Client
- `/frontend` --> Client Files

## Install Server with Camera
- Install [npm](https://www.makersupplies.sg/blogs/tutorials/how-to-install-node-js-and-npm-on-the-raspberry-pi)
- Clone Code: `git clone https://github.com/MaxZell/PiSurveillancer.git`
- `cd PiSurveillancer`
- Install packages: `npm install`
- Install opencv4nodejs:
    - `npm i -g npm@6`
    - `npm i opencv4nodejs --save`
    - `npm i -g npm@latest`

## Start Server with Camera
`sudo node server`

## Start Server in Docker
- Install [npm](https://www.makersupplies.sg/blogs/tutorials/how-to-install-node-js-and-npm-on-the-raspberry-pi)
- Clone Code: `git clone https://github.com/MaxZell/PiSurveillancer.git`
- `cd PiSurveillancer`
- Install packages: `npm install`
- Build docker image: `sudo docker build -t nodecv .`
- Run Docker image with camera & port: `docker run --device=/dev/video0:/dev/video -p 1234:8888 nodecv`

## Stop Server Docker Image
-- `sudo docker ps`
-- get container id
-- `sudo docker kill <container-id>`

- If only one image running:
`sudo docker kill $(sudo docker ps -q)`


## Start Frontend
- Install [npm](https://www.makersupplies.sg/blogs/tutorials/how-to-install-node-js-and-npm-on-the-raspberry-pi)
- Clone Code: `git clone https://github.com/MaxZell/PiSurveillancer.git`
- `cd PiSurveillancer`
- Install packages: `npm install` or `yarn install`
- Start: `npm start` or `yarn start`
- Open in [npm](http://localhost:8000/)

# Author
[Maxim Zelensky](https://github.com/MaxZell)
