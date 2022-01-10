const cv = require('opencv4nodejs')
const net = require('net');

const port = 8888
const fps = 24

// opencv camera
let camera = null

// tcp server
const server = net.createServer()

/**
 * @todo:
 * USE socket.io NOT TCP(net) ?????
 * USE pi-camera PACKAGE, NOT OPENCV ?????
 * ADD multiple clients and cameras support
 * THINK: do pi(camera computer) need to be server (DNS-problem)
*/

let cameraInterval = null

// on client connection
server.on('connection', (socket) => {
    console.log("user connected");
    // start camera
    camera = new cv.VideoCapture(0)
    camera.set(cv.CAP_PROP_FRAME_WIDTH, 640)
    camera.set(cv.CAP_PROP_FRAME_HEIGHT, 480)

    cameraInterval = setInterval(() => {
        const frame = camera.read()
        const image = cv.imencode('.jpg', frame).toString('base64')
	socket.write(image + ",") // comma is not base64 character
    }, 1000 / fps)

    socket.on('end', () => {
	clearInterval(cameraInterval)
	camera.release()
        socket.destroy()
        console.log("\x1b[33m", "client disconnected!", "\x1b[0m")
    })
})

// errors handling
process.on('uncaughtException', (err) => {
	clearInterval(cameraInterval)
	camera.release()
	if(err.message == "read ECONNRESET"){
		console.log("\x1b[33m", "client disconnected", "\x1b[0m")
	} else{
		console.error(err.message)
	}
})

// start server
server.listen(port, () => console.log("\x1b[32m", "server started", "\x1b[0m"))
