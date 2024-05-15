const net = require('net')
const server = net.createServer()
const port = 4000

const sockets = new Map()

// Start the server and listen on the port
server.listen(port, () => {
    console.log(`Server start listening in port ${port}`)
})

// Listening for new client connections
server.on('connection', (socket) => {
    const userAddress = `${socket.remoteAddress}:${socket.remotePort}`
    const user = { socket, userName: null }
    
    // Store the new client connection in the sockets map
    sockets.set(userAddress, user)

    console.log(`Got a new connection from ${userAddress}`)
    socket.write('Please Set Your Nickname:')

    socket.on('data', (data) => onData(data, userAddress))
    socket.on('end', () => onEnd(userAddress))

})

// Listening for server errors
server.on('error', (err) => {
    console.log('Server error:', err.message)
})

// Listening for server closed event
server.on('close', () => {
    console.log('Server closed')
})

function onData(data, userAddress) {
    const message = data.toString().trim()
    const user = sockets.get(userAddress)
    console.log(`Got data:${message}, from ${userAddress}`)

    // Check if the user has set a nickname
    if (!user.userName) {
        user.userName = message

        user.socket.write(`Welcome to the chat ${user.userName}!\n\n`)

        // Broadcast a message to all users that a new user has joined
        broadcast(`ALL:${user.userName} JOIN\n`, user.socket)
    } else {
        // Broadcast the user's message to all other users
        broadcast(`${user.userName}:${message}\n`, user.socket)
    }
}

function onEnd(userAddress) {
    const user = sockets.get(userAddress)
    console.log(`${userAddress} disconnected`)

    // Broadcast a message to all other that a user has left
    broadcast(`ALL:${user.userName} EXIT\n`)

    // Remove the user from the socket map
    sockets.delete(userAddress)
}

// Function to broadcast a message to all connected clients excetp teh sender
function broadcast(data, socket) {
    for (let user of sockets.values()) {
        if (user.socket !== socket && user.userName) {
            user.socket.write(data)
        }
    }
}
