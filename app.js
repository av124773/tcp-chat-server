const net = require('net')
const server = net.createServer()
const port = 4001

const sockets = new Map()

server.on('connection', (socket) => {
    const userAddress = `${socket.remoteAddress}:${socket.remotePort}`
    let userName = null
    let user = { socket, userName }
    
    sockets.set(userAddress, user)

    console.log(`Got a new connection from ${userAddress}`)
    socket.write('Please Set Your Nickname:')

    socket.on('data', (data) => {
        console.log('Got data:', data, 'from', userAddress)

        if (!sockets.get(userAddress).userName) {
            userName = data.toString().trim()
            sockets.get(userAddress).userName = userName

            socket.write(`Welcome ${userName}\n`)
            broadcast(`${userName} is join\n`)
        } else {
            broadcast(`${userName}:${data}`)
        }
    })

    socket.on('end', () => {
        console.log(`${userAddress} disconnected`)
        broadcast(`${userName} is exit`)
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
