const net = require('net')
const client = new net.Socket()
const express = require('express')
const path = require('path')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const port = process.env.PORT || 8000;

// server data
const server_host = '192.168.5.161'
const server_port = 1234

// join frontend path
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// serve index.ejs
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
})

// close server connection
client.on('close', () => {
    console.log('Connection closed')
})

// start server
server.listen(port, () => console.log(`Listening on port ${port}`))