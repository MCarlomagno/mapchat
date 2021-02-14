import express from "express";
import { Server as SocketIOServer } from "socket.io";
import { Server as httpServer} from "http";

// Create a new express app instance
const app: express.Application = express();

app.set("port", process.env.PORT || 3000);

const http = new httpServer(app);
// set up socket.io and bind it to our
// http server.
const io = new SocketIOServer(http);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on("connection", (socket: any) => {
    // tslint:disable-next-line:no-console
    console.log("a user connected");

    let previousId: any;
    const safeJoin = (currentId: any) => {
        socket.leave(previousId);
        socket.join(currentId, () => {
            // tslint:disable-next-line:no-console
            console.log(`Socket ${socket.id} joined room ${currentId}`)
        });
        previousId = currentId;
    };
});

app.listen(3000, () => {
    // tslint:disable-next-line:no-console
    console.log('App is listening on port 3000!');
});