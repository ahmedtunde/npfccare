import Noty from 'noty';
// const Noty = require('noty');

const notify = (msg, type, done) => {//alert, success, warning, error, info/information
  new Noty({
    type: type,
    layout: 'topRight',
    theme: 'nest',
    text: msg,
    timeout: '5000',
    progressBar: true,
    closeWith: ['click'],
    killer: true,
    callbacks: {
      beforeShow: function () {
        // console.log('beforeend', 'Preparing... ⏱<br/>');
      },
      onShow: function () {
        // console.log('beforeend', 'Showed ✨<br/>');
      },
      onHover: function () {
        // console.log('beforeend', 'Hovered 👀<br/>');
      },
      onClick: function () {
        // console.log('beforeend', 'Clicked ✅<br/>');
      },
      onClose: function () {
        // console.log('beforeend', 'Bye 👋🏻<br/>');
        if (done) return done.call();
      }
    },
  }).show();
};

export default notify;