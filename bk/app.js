const net = require('net')
const client = new net.Socket()
const express = require('express')
const path = require('path')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
var fs = require('fs');
const port = process.env.PORT || 8000;

const pi_host = '192.168.5.161'
const pi_port = 1234

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', (req, res, next)=>{
    res.render('index')
})

io.on('connection', (socket)=>{
    console.log("a user connected via socket!")
    socket.on('disconnect', ()=>{
        console.log("a user disconnected!")
    })
    socket.on('start', (msg)=>{
        // console.log("Message: "+msg)
        // connect to raspi
        // var imageAsBase64 = fs.readFileSync('./image.png', 'base64');
        // console.log(imageAsBase64.length)
		client.connect(pi_port, pi_host, () => {
			console.log('Connected')
		})

        let data = ""
        let separator = ","
        client.on('data', (chunk) => {
            chunk = chunk.toString()
            data += chunk
            if(data.includes(separator)){
                data = data.slice(0, -separator.length)
                // 5500 chunk size
                // io.emit('frame', `image/png;base64,${data}`)
                chunk = ""
                data = ""
                client.destroy()
            }
        })
    })
})

// close raspi connection
client.on('close', () => {
    console.log('Connection closed')
})

server.listen(port, ()=>{
    console.log("Server listening on port "+port+"!")
})