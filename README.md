# server-sent-events-showcase
[![Dependency Status](https://david-dm.org/blacksonic/server-sent-events-showcase.svg)](https://david-dm.org/blacksonic/server-sent-events-showcase)

Basic setup for Server Sent Events (SSE) with Koa server.

```
npm install

npm start // run frontend, available on http://localhost:8080
npm run start-server // run backend, available on http://localhost:3000

// Send message to specific user, actual user is printed to frontend
http://localhost:3000/events/:user/emit/:message?event=eventType
http://localhost:3000/events/user_123/emit/HelloMessage
http://localhost:3000/events/user_123/emit/HelloMessage?event=secondary
```
