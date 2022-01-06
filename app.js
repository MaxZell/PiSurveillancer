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
                }
            })
        })
    })
    // stop video stream
    sock.on('stop', (msg)=>{
        // client.destroy()
    })
})

// start tcp server
server.listen(server_port, () => console.log("\x1b[32m", "TCP server started", "\x1b[0m"))

// start frontend server
httpserver.listen(port, () => console.log("\x1b[32m", `Frontend listening on port ${port}`, "\x1b[0m"))
