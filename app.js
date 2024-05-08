const net = require('net')
const server = net.createServer()
const port = 4001

server.on('connection', (socket) => {
    console.log('Got a new connection')

    socket.on('data', (data) => {
        console.log('got data:', data)
    })
})

server.on('error', (err) => {
    console.log('Server error:', err.message)
})

server.on('close', () => {
    console.log('Server closed')
})

server.listen(port)
