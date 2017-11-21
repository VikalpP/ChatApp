var client = io();
var username = $('#username');
var UserNameBlock = $('#UserNameBlock');
var btnSendMsg = $('#btnSendMsg');
var userMessage = $('#userMessage');
var username = $('#username');
var messages = $('#messages');
var msgForm = $('#msgForm');
var userNameForm = $('#userNameForm');

userNameForm.submit(() => {
  client.emit('myUserName', username.val());
});


// btnSendMsg.click(() => {
msgForm.submit(() => {

  client.emit('message', {
    username: username.val(),
    message: userMessage.val()
  });

  messages.append(`
    <li class="message right appeared">
      <div class="avatar">
        <h4><b>` + `You` + `<b></h4>
      </div>
      <div class="text_wrapper">
        <div class="text">` + userMessage.val() + `</div>
      </div>
    </li>
  `);
  userMessage.val('');
  return false;
});

userMessage.keypress(() => {
  client.emit('typing', username.val() + ' is typing...');
  if (typingTimeoutFn != 'undefined') clearTimeout(typingTimeoutFn);
  var typingTimeoutFn = setTimeout(typingTimeout, 4000);
});

client.on('typing', (data) => {
  $('#status').text(data);
  // if (typingTimeoutFn != 'undefined') clearTimeout(typingTimeoutFn);
  // var typingTimeoutFn = setTimeout(typingTimeout, 4000);
});

var typingTimeout = () => {
  client.emit('typing', '');
  // $('#status').text('');
};

client.on('chatMessge', (data) => {
  $('#status').text('');

  messages.append(`
    <li class="message left appeared">
      <div class="avatar">
        <h4><b>` + data.username + `<b></h4>
      </div>
      <div class="text_wrapper">
        <div class="text">` + data.message + `</div>
      </div>
    </li>
  `);
});