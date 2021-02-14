import express from "express";
import * as socketio from "socket.io";
import { Server as httpServer} from "http";
import cors from "cors";

// Create a new express app instance
const app: express.Application = express();

app.set("port", process.env.PORT || 3000);

app.use(cors());

const http = new httpServer(app);
// set up socket.io and bind it to our
// http server.
const io = socketio.default(http, {
    origins: ["http://localhost:4200"],
});

const documents: any = {};

// whenever a user connects on port 4444 via
// a websocket, log that a user has connected
io.on("connection", (socket: any) => {
    console.log("a user connected");

    let previousId: any;
    const safeJoin = (currentId: any) => {
        socket.leave(previousId);
        socket.join(currentId, () => {
            console.log(`Socket ${socket.id} joined room ${currentId}`)
        });
        previousId = currentId;
    };

    socket.on("getDoc", (docId: any) => {
        safeJoin(docId);
        socket.emit("document", documents[docId]);
    });

    socket.on("addDoc", (doc: any) => {
        documents[doc.id] = doc;
        safeJoin(doc.id);
        io.emit("documents", Object.keys(documents));
        socket.emit("document", doc);
    });

    socket.on("editDoc", (doc: any) => {
        documents[doc.id] = doc;
        socket.to(doc.id).emit("document", doc);
    });

    io.emit("documents", Object.keys(documents));
    console.log(`Socket ${socket.id} has connected`);
});

http.listen(4444, () => {
    console.log('Socket is listening on port 4444!');
});

app.listen(3000, () => {
    console.log('App is listening on port 3000!');
});