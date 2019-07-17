var client = io();
var username = $('#username');
var UserNameBlock = $('#UserNameBlock');
var btnSendMsg = $('#btnSendMsg');
var userMessage = $('#userMessage');
var messages = $('#messages');
var msgForm = $('#msgForm');
var userNameForm = $('#userNameForm');

let myUserName;
userNameForm.submit(() => {
  myUserName = username.val();
  client.emit('myUserName', myUserName);
});

msgForm.submit(() => {
  const message = userMessage.val();

  // console.log(message.trim().length)
  if (message.trim().length > 0) {
    client.emit('message', userMessage.val());
    messages.append(messageBuilder('right', 'You', userMessage.val()));
  }
  userMessage.val('');
  return false;
});

var typingTimeout = () => {
  client.emit('stopTyping');
  emittedTyping = false;
};

let typingTimeoutFn;
const setupTimeOutForStopTyping = () => {
  if (!typingTimeoutFn) clearTimeout(typingTimeoutFn);
  typingTimeoutFn = setTimeout(typingTimeout, 3000);
};

let emittedTyping = false;
userMessage.keypress(() => {
  setupTimeOutForStopTyping();

  if (emittedTyping) return;
  emittedTyping = true;

  client.emit('typing');
});

client.on('typing', data => {
  const usernames = data.filter(name => name !== myUserName);
  if (usernames.length > 0) {
    $('#status').text(
      usernames + (usernames.length > 1 ? ' are' : ' is') + ' typing...'
    );
  }
});

client.on('stopTyping', () => $('#status').text(''));

client.on('chatMessage', data => {
  messages.append(messageBuilder('left', data.username, data.message));
});

const messageBuilder = (direction, sender, message) => `
<li class="message ${direction} appeared">
  <div class="avatar">
    <h4> ${sender} </h4>
  </div>
  <div class="text_wrapper">
    <div class="text"> ${message} </div>
  </div>
</li>`;
