var username = $('#username');
var UserNameBlock = $('#UserNameBlock');
var chatBox = $('#chatBox');
var userNameForm = $('#userNameForm');

UserNameBlock.show();
chatBox.hide();


userNameForm.submit(() => {
  if (username.val().length > 0) {
    UserNameBlock.hide();
    chatBox.show();
  } else {
    alert('Please enter a name')
  }
  return false;
});