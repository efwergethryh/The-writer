const socketIo = require('socket.io');
const express = require('express');
const http = require('http');

const app = express();

const server = http.createServer(app);


const io = socketIo(server);



// Export the io object
module.exports = io;
