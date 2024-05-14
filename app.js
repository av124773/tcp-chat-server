const net = require('net')
const server = net.createServer()
const port = 4000

const sockets = new Map()

server.on('connection', (socket) => {
    const userAddress = `${socket.remoteAddress}:${socket.remotePort}`
    let userName = null
    let user = { socket, userName }
    
    sockets.set(userAddress, user)

    console.log(`Got a new connection from ${userAddress}`)
    socket.write('Please Set Your Nickname:')

    socket.on('data', (data) => {
        const message = data.toString().trim()
        console.log(`Got data:${message}, from ${userAddress}`)

        if (!sockets.get(userAddress).userName) {
            userName = message
            sockets.get(userAddress).userName = userName

            socket.write(`Welcome to the chat ${userName}!\n\n`)
            broadcast(`ALL:${userName} JOIN\n`)
        } else {
            broadcast(`${userName}:${message}\n`)
        }
    })

    socket.on('end', () => {
        console.log(`${userAddress} disconnected`)
        broadcast(`ALL:${userName} EXIT\n`)
        sockets.delete(userAddress)
    })

    function broadcast(data) {
        for (let [address, user] of sockets) {
            if (user.socket !== socket && user.userName) {
                user.socket.write(data)
            }
        }
    }
})

server.on('error', (err) => {
    console.log('Server error:', err.message)
})

server.on('close', () => {
    console.log('Server closed')
})

server.listen(port, () => {
    console.log(`Server start listening in port ${port}`)
})
