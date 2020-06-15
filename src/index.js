import { EventSourcePolyfill } from 'event-source-polyfill';

const user = `user_${(new Date()).getMilliseconds()}`;
document.querySelector('#user').innerHTML = user;

const events = new EventSourcePolyfill(
  `http://localhost:3000/events/${user}`,
  {
    headers: {
      Authorization: 'Bearer Almafa'
    }
  }
);

document.querySelector('#instructions').innerHTML = `Send message by 
<a href="http://localhost:3000/events/${user}/emit/HelloWorld" target="_blank">clicking here</a>
or to <a href="http://localhost:3000/events/${user}/emit/HelloWorld?event=secondary" target="_blank">the secondary channel</a>`;

events.addEventListener('message', ({ data, lastEventId }) => {
  const element = document.createElement('p');
  element.innerHTML = `${lastEventId}(message): ${data}`;
  document.querySelector('#messages').appendChild(element);
});

events.addEventListener('secondary', ({ data, lastEventId }) => {
  const element = document.createElement('p');
  element.innerHTML = `${lastEventId}(secondary): ${data}`;
  document.querySelector('#messages').appendChild(element);
});

events.addEventListener('error', ({ error }) => {
  const element = document.createElement('p');
  element.innerHTML = error;
  document.querySelector('#errors').appendChild(element);
});
