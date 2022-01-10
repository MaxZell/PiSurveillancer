const net = require('net')
const client = new net.Socket()
const express = require('express')
const path = require('path')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const port = process.env.PORT || 8000;

// server data
const server_host = '192.168.5.81'
const server_port = 8888

// join frontend path
app.use(express.static(path.join(__dirname, 'frontend')))
app.set('views', path.join(__dirname, 'frontend'))
app.set('view engine', 'ejs')

// serve index.ejs
app.get('/', (req, res, next)=>{
    res.render('index')
})

// close tcp connection
function closeTCP(addr) {
    client.destroy()
    console.log(`user disconnected: <${addr}>`)
}

// on user connection
io.on('connection', (socket)=>{
    console.log(`user connected: <${socket.handshake.address}>`)
    // on browser reload or close
    socket.on('disconnect', ()=>{
        closeTCP(socket.handshake.address)
    })
    // start button on frontend pressed
    socket.on('start', (msg)=>{
        // connect to server
		client.connect(server_port, server_host, () => console.log('connected to TCP'))
        // get video from server
        let data = ""
        let separator = ","
        client.on('data', (chunk) => {
            data += chunk
            if(data.includes(separator)){
                data = data.slice(0, -separator.length) // remove separator
                io.emit('frame', `data:image/png;base64,${data}`) // send frame
                // reset data
                chunk = ""
                data = ""
            }
        })
    })

    // stop button on frontend pressed
    socket.on('stop', (msg)=>{
        closeTCP(socket.handshake.address)
    })
})

// handle server connection error
client.on('error', () => {
    console.log("\x1b[31m", 'TCP connection error!', "\x1b[0m")
})

// close server connection
client.on('close', () => {
    console.log("\x1b[31m", 'TCP connection closed', "\x1b[0m")
})

// start frontend server
server.listen(port, () => console.log("\x1b[32m", `Frontend listening on port ${port}`, "\x1b[0m"))