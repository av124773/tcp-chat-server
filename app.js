const net = require('net')
const server = net.createServer()
const port = 4001

const sockets = []

server.on('connection', (socket) => {
    const userIp = `${socket.remoteAddress}:${socket.remotePort}`
    let userName = null
    
    let user = {
        userIp,
        socket,
        userName
    }
    sockets.push(user)

    console.log(`Got a new connection from ${userIp}`)
    socket.write('Please Set Your Nickname:')

    socket.on('data', (data) => {
        console.log('Got data:', data, 'from', userIp)

        if (!user.userName) {
            const index = sockets.findIndex((s) => s.socket === socket )
            userName = data.toString().trim()
            sockets[index].userName = userName

            socket.write(`Welcome ${userName}\n`)
            broadcast(`${userName} join\n`)
        } else {
            broadcast(`${userName}:${data}`)
        }
    })

    socket.on('end', () => {
        console.log(`${userIp} disconnected`)
        const index = sockets.findIndex((s) => s.userIp === userIp) 
        sockets.splice(index, 1)
    })

    function broadcast(data) {
        sockets.forEach(otherSocket => {
            if (otherSocket.socket !== socket && otherSocket.userName) {
                otherSocket.socket.write(data)
            }
        })
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
