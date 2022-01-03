const cv = require('opencv4nodejs')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const socket = require('socket.io')(server)
const net = require('net');

const host = '192.168.5.161'
const port = 8888
const fps = 24

// opencv camera
const camera = new cv.VideoCapture(0)
camera.set(cv.CAP_PROP_FRAME_WIDTH, 640)
camera.set(cv.CAP_PROP_FRAME_HEIGHT, 480)

// tcp server
const myserver = net.createServer()

/*
USE SOCKET.IO NOT TCP ?????
FIX MEMORY FILL PROBLEM -> STOP CAMERA OR INTERVAL
USE RASPICAMERA PACKAGE, NOT OPENCV ?????
*/

// on client connection
myserver.on('connection', (socket) => {
    setInterval(() => {
        const frame = camera.read()
        const image = cv.imencode('.jpg', frame).toString('base64')
        // console.log("Image length: ", image.length) // commit after testing
	socket.write(image + ","/*, ()=>{console.log("sent data")}*/) // comma is not base64 character
	/*
        if(image.length >= 26000){
            console.log("image ist to big")
            let chunks = image.match(/.{1,26000}/g)
            chunks.forEach((part) => {
                socket.write(part, ()=>{console.log("sent data")})
                console.log(part.length)
            })
            socket.write("sep@r@t0r")
        }
	*/
        //socket.on('error', (err) => {
        //    console.log(err.stack)
        //})
    }, 1000 / fps)
})


// why it doesnt work?
//myserver.on('error', (err) => {
//    console.log("Maxim error: " + err.message)
//})

// comment later?
process.on('uncaughtException', (err) => {
       console.log(err)
   // camera.release()
   // process.exit()
});

// start server
myserver.listen(port, () => {
    console.log("server started")
})

/*
app.get('/', (req, res) => {
    console.log("user connected")
    // const frame = camera.read()
    // const image = cv.imencode('.jpg', frame).toString('base64')
    // res.send(image)
    // res.setHeader('Content-Type', 'txt/html')
    setInterval(() => {
         const frame = camera.read()
         const image = cv.imencode('.jpg', frame).toString('base64')
         res.send(image)
         //socket.emit('image', image)
    }, 1000 / fps)
})

app.listen(port, () => {console.log("hello server")})
*/
