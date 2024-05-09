const net = require('net')
const server = net.createServer()
const port = 4001

const sockets = []

server.on('connection', (socket) => {
    const userIp = `${socket.remoteAddress}:${socket.remotePort}`
    console.log(`Got a new connection from ${userIp}`)

    sockets.push({ userIp, socket })

    socket.on('data', (data) => {
        console.log('Got data:', data, 'from', userIp)
        sockets.forEach(otherSocket => {
            if (otherSocket.socket !== socket) {
                otherSocket.socket.write(data)
            }
        })
    })

    socket.on('end', () => {
        console.log(`${userIp} disconnected`)
        const index = sockets.findIndex((sockets) => sockets.userIp === userIp) 
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
