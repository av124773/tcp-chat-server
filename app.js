const net = require('net')
const server = net.createServer()
const port = 4001

const sockets = []

server.on('connection', (socket) => {
    console.log('Got a new connection')

    sockets.push(socket)

    socket.on('data', (data) => {
        console.log('got data:', data)
        sockets.forEach(otherSocket => {
            if (otherSocket !== socket) {
                otherSocket.write(data)
            }
        })
    })

    socket.on('end', () => {
        console.log('connection closed')
        const index = sockets.indexOf(socket)
        sockets.splice(index, 1)
    })
})

server.on('error', (err) => {
    console.log('Server error:', err.message)
})

server.on('close', () => {
    console.log('Server closed')
})

server.listen(port)
