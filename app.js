const net = require('net')
const server = net.createServer()
const port = 4000

const sockets = new Map()

// Listening for new client connections
server.on('connection', (socket) => {
    const userAddress = `${socket.remoteAddress}:${socket.remotePort}`
    let userName = null
    let user = { socket, userName }
    
    // Store the new client connection in the sockets map
    sockets.set(userAddress, user)

    console.log(`Got a new connection from ${userAddress}`)
    socket.write('Please Set Your Nickname:')

    // Listening for receiving data from the client
    socket.on('data', (data) => {
        const message = data.toString().trim()
        console.log(`Got data:${message}, from ${userAddress}`)

        // Check if the user has set a nickname
        if (!sockets.get(userAddress).userName) {
            userName = message
            sockets.get(userAddress).userName = userName

            socket.write(`Welcome to the chat ${userName}!\n\n`)
            // Broadcast a message to all users that a new user has joined
            broadcast(`ALL:${userName} JOIN\n`)
        } else {
            // Broadcast the user's message to all other users
            broadcast(`${userName}:${message}\n`)
        }
    })

    // Listening for client disconnections
    socket.on('end', () => {
        console.log(`${userAddress} disconnected`)
        // Broadcast a message to all other that a user has left
        broadcast(`ALL:${userName} EXIT\n`)
        // Remove the user from the socket map
        sockets.delete(userAddress)
    })

    // Function to broadcast a message to all connected clients excetp teh sender
    function broadcast(data) {
        for (let [address, user] of sockets) {
            if (user.socket !== socket && user.userName) {
                user.socket.write(data)
            }
        }
    }
})

// Listening for server errors
server.on('error', (err) => {
    console.log('Server error:', err.message)
})

// Listening for server closed event
server.on('close', () => {
    console.log('Server closed')
})

// Start the server and listen on the port
server.listen(port, () => {
    console.log(`Server start listening in port ${port}`)
})
