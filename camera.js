const cv = require('opencv4nodejs')
const net = require('net');
const client = new net.Socket()

const fps = 24

const server_host = ''
const server_port = 8888

let camera = null
let cameraInterval = null

// on client connection
client.connect(server_port, server_host, () => {
    console.log("connected to hub")
    console.log("start camera stream...");
    // start camera
    camera = new cv.VideoCapture(0)
    camera.set(cv.CAP_PROP_FRAME_WIDTH, 640)
    camera.set(cv.CAP_PROP_FRAME_HEIGHT, 480)

    cameraInterval = setInterval(() => {
        const frame = camera.read()
        const image = cv.imencode('.jpg', frame).toString('base64')
	    client.write(image + ",") // comma is not base64 character
    }, 1000 / fps)
})