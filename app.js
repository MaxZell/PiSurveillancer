const net = require('net')
const client = new net.Socket()
const express = require('express')
const path = require('path')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const port = process.env.PORT || 8000;

// let server = net.createServer()


// server data
const server_host = '192.168.5.81'
const server_port = 8888

// join frontend path
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// serve views/index.ejs
app.get('/', (req, res, next)=>{
    res.render('index')
})

// on user connection
io.on('connection', (socket)=>{
    console.log("user connected")
    socket.on('disconnect', ()=>{
        console.log("user disconnected")
        client.destroy()
    })
    socket.on('start', (msg)=>{
        // connect to server
		client.connect(server_port, server_host, () => console.log('Connected'))
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
                }
                // reset data
                chunk = ""
                data = ""
            }
        })
    })
    // stop video stream
    socket.on('stop', (msg)=>{
        client.destroy()
    })
})

// close server connection
client.on('close', () => console.log('Connection closed'))

// handle errors
client.on('error', (err) => console.error(err.code))

// start server
server.listen(port, () => console.log(`Listening on port ${port}`))