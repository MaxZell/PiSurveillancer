const net = require('net')
const express = require('express')
const path = require('path')
const app = express()
const httpserver = require('http').createServer(app)
const io = require('socket.io')(httpserver)

const port = process.env.PORT || 8000;

// server data
const server_port = 8888

// join frontend path
app.use(express.static(path.join(__dirname, 'frontend')))
app.set('views', path.join(__dirname, 'frontend'))
app.set('view engine', 'ejs')

// serve views/index.ejs
app.get('/', (req, res, next)=>{
    res.render('index')
})

// tcp server
const server = net.createServer()

// on user connection
<<<<<<< HEAD
io.on('connection', (socket)=>{
    console.log(`user connected: <${socket.handshake.address}>`)
    socket.on('disconnect', ()=>{
        console.log(`user disconnected: <${socket.handshake.address}>`)
        client.destroy()
    })
    socket.on('start', (msg)=>{
        // connect to server
		client.connect(server_port, server_host, () => console.log('connected to TCP'))
        // get video from server
        let data = ""
        const separator = ","
        client.on('data', (chunk) => {
            data += chunk
            if(data.includes(separator)){
                // check png not broken
                if (data.substring(0,27) === "/9j/4AAQSkZJRgABAQAAAQABAAD") {
                    data = data.slice(0, -separator.length) // remove separator
                    io.emit('frame', `data:image/png;base64,${data}`) // send frame to frontend
=======
io.on('connection', (sock)=>{
    console.log("user connected")
    sock.on('disconnect', ()=>{
        console.log("user disconnected")
        // client.destroy()
    })
    sock.on('start', (msg)=>{
        console.log("start")
        server.on('connection', (socket) => {
            console.log("got camera connection")
            let data = ""
            const separator = ","
            socket.on('data', (chunk) => {
                data += chunk
                if(data.includes(separator)){
                    // check png not broken
                    if (data.substring(0,27) === "/9j/4AAQSkZJRgABAQAAAQABAAD") {
                        data = data.slice(0, -separator.length) // remove separator
                        io.emit('frame', `data:image/png;base64,${data}`) // send frame to frontend
                    }
                    // reset data
                    chunk = ""
                    data = ""
>>>>>>> afa5878b4859ba264c89fa4ad60c2b07d5eee065
                }
            })
        })
    })
    // stop video stream
    sock.on('stop', (msg)=>{
        // client.destroy()
    })
})

<<<<<<< HEAD
// close server connection
client.on('close', () => {
    console.log("\x1b[31m", 'TCP connection closed', "\x1b[0m")
})

// start frontend server
server.listen(port, () => console.log("\x1b[32m", `Frontend listening on port ${port}`, "\x1b[0m"))
=======
// start tcp server
server.listen(server_port, () => console.log("\x1b[32m", "TCP server started", "\x1b[0m"))

// start frontend server
httpserver.listen(port, () => console.log("\x1b[32m", `Frontend listening on port ${port}`, "\x1b[0m"))
>>>>>>> afa5878b4859ba264c89fa4ad60c2b07d5eee065
