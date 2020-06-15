'use strict';
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');
const Stream = require('stream');

const app = new Koa();
const router = new Router();

const EventEmitter = require('eventemitter3');
const emitter = new EventEmitter();

router.get('/', context => {
  context.status = 200;
  context.body = 'Hello World!';
});

router.get('/events/:user/emit/:message', context => {
  console.log(`Emitting message to ${context.params.user}`);

  emitter.emit(
    'event',
    {
      user: context.params.user,
      message: context.params.message,
      event: context.query.event || 'message'
    }
  );

  context.status = 200;
  context.body = 'Emitted';
});

router.get('/events/:user', context => {
  context.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  context.status = 200;

  console.log(`Connected to ${context.params.user}`);

  const stream = new Stream.PassThrough();
  context.body = stream;

  const heartBeat = setInterval(() => stream.write('\n'), 15000);

  const listener = data => {
    if (data.user === context.params.user) {
      console.log(`Sending message to ${context.params.user}`);

      stream.write(`id: ${context.params.user}_${(new Date()).getTime()}\n`);
      stream.write(`event: ${data.event}\n`);
      stream.write(`data: ${data.message}\n\n`);
    }
  };
  emitter.on('event', listener);

  context.req.on('close', () => {
    console.log(`Disconnecting ${context.params.user}`);
    emitter.removeListener('event', listener);
    clearInterval(heartBeat);
    stream.end();
  });
});

app.use(cors());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, () => console.log('Listening on port 3000'));
