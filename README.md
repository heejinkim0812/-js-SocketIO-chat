# JS-SocketIO-Basic-Chat

Simple Chat Framework.  
Used NodeJS, ~~Websockets~~, SocketIO, Pug (Template Engine), and CSS/vanilla-JS.  
</br>
![1](https://user-images.githubusercontent.com/71063574/150482554-47286565-c9f3-498c-961c-c4a394ff4d6f.gif)
![2](https://user-images.githubusercontent.com/71063574/150482646-fa805ee6-753f-4a57-ad4f-b22a64d4993a.gif)

## Feature List

- Set nickname before user enter the room
- Sending/Receiving Texts
- Chat room (Groups of WebSockets)
- Show the existing room list when users choose which room to enter
  - Should eliminate the "private" rooms, having same name with the socketID (listed in `sids` Map), from the `rooms` Map.
- Show how many people in the room
- Admin Panel to monitor sockets, and rooms.

## What I Learn

- Basics of using [Pug](https://pugjs.org/api/getting-started.html), the template engine, with [express](http://expressjs.com/).
- [MVP CSS](https://andybrewer.github.io/mvp/), making default design of HTML elements look better.
- Using [nodemon](https://nodemon.io/) to automatically restart server when files changed.
- **WebSocket (wss)** clients first handshake with server.
  Once connection established, server and clients can send messages each other without requesting those.
  It is bi-directional connection.
  It knows whether the server/client is connected, closed, and sent message in real time.
  - Compare to the HTTP, client request and server response.
    It is stateless, meaining that the backend does not remember the state of client.
  - [**ws**](https://www.npmjs.com/package/ws) is used to build WebSocket server and to communicate with other WebSocket servers.
  - the browsers has [built-in client for WebSocket **(WebSocket API)**](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket).
- [**SocketIO**](https://socket.io/) is a library that enables real-time, bidrectional, and event-driven communication.
  - While WebSocket is standardized way (HTML5) to do real-time communication, SocketIO is not.
  - It support various methods to enable real-time communication, including WebSocket, Pooling, Streaming, Flash Socket, etc.
    When it initiate the communication, it establishes connection with the most suitable way.
    Therefore, though the browser does not support WebSocket, SocketIO enables the browser to communicate in bi-direction.
  - SocketIO has more advanced features (including room, broadcasting, etc.) than WebSocket.
    - Room is supported natively, using **Socket.join(\<room name>)** function.
      - List the rooms socket currently in: **Socket.rooms**.
      - On server, specify the recipient of message by using `Socket.to(<room name / socket ID>)`
        - Will send message except for the sender
        - Some other ways to specifiy recipient: [link](https://stackoverflow.com/questions/10058226/send-response-to-all-clients-except-sender)
  - Need to import a dedicated javascript file to use it from the web browser.
    - `<Server_Host_URL>/socket.io/socket.io.js`
    - The API documentation for `socketIO` can be found in https://socket.io/docs/v4/
  - Using SocketIO, we can send any events, while WebSocket only support `message` event.
    - No need to stringify object to generate string.
    - Able to pass as many arguments as we want when we emit a message
      - Able to trigger a functions on front-end (provided as the last argument while emit a message) from back-end (also able to pass arguments)
  - [**Adapter**](https://socket.io/docs/v4/adapter/) is syncronizing the real-time applications among different servers.
    - By default, Socket.IO uses In-Memory adapter.
      When server restarts, all room, message, and socket disappear.
    - Using clustered servers, they cannot share the same memory pool; therefore, to access to other connections in different server, we need to use other adapter rather than In-Memory.
    - Contain information about who is connected and how many rooms are created.
  - **Server.sockets.emit()** to notify everyone
- [**Map**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map): Holds key-value pairs and remember the insertion orders.
  Any value (either objects or primitive values) can be used as either key or a value
  - Iterating Map gives (value, map, key) pair. (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach)
- [**Set**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set): store **unique** values of any type.
- [**Optional chaining (?.)**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) is used to read value in the object, but check whether the reference is nullish or not.
  If nullish (`null` or `undefined`), the expression with return `undefined`.
