import {Server} from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

const userSocketMap = {};

export const getReceiverSocketId = (userId) => {
    return userSocketMap[userId];
};

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);
  
    
    
    socket.on('disconnect', () => {
        console.log(`User Disconnected: ${socket.id}`);
        delete userSocketMap[socket.id];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
})

export {io, app, server};