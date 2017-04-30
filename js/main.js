var timeline = new Timeline('timeline');

function autolayout() {
  var height = $(window).height();
  $('.js-main-header').height(height);
  timeline.resize();
}

$(window).resize(autolayout);
autolayout();

var titles = $('.js-pre-titles li').map(function() {
  return $(this).html();
}).get();

function updateTitle() {
  var title = titles.pop();
  titles.unshift(title);
  $('.js-elements').append('<div class="js-title title">' + title + '</div>');
  setTimeout(function() {
    $('.js-title').remove();
  }, 3000);
}

setInterval(updateTitle, 3500);
updateTitle();

$(window).scroll(function(e) {
  var top = $(window).scrollTop();
  if (top > 100) {
    var diff = top - 100;
    $('.js-godown').css('opacity', 10 / diff);
  } else {
    $('.js-godown').css('opacity', 1);
  }
});

$('.js-godown').click(function() {
  $('html, body').animate({ scrollTop: $(window).height() }, 600);
});

window.addEventListener('deviceorientation', function(eventData) {
  // Retrieving the front/back tilting of the device and moves the
  // background in the opposite way of the tilt
  var yTilt = -Math.round((-eventData.beta) * (0.2));

  // Retrieve the side to side tilting of the device and move the
  // background the opposite direction.

  var xTilt = -Math.round(-eventData.gamma * (0.2));

  // Thi 'if' statement checks if the phone is upside down and corrects
  // the value that is returned.
  // if (xTilt > 0) {
  //   xTilt = -xTilt;
  // } else if (xTilt < -40) {
  //   xTilt = -(xTilt + 80);
  // }

  $('.js-elements').css({
    transform: 'translate(' + xTilt + 'px, ' + yTilt + 'px)'
  });

}, false);

// i18n
var userLang = $.cookie('language') || navigator.language || navigator.userLanguage || '';

var isChinese = userLang.indexOf('zh') === 0;

if (isChinese && $('body').hasClass('en')) {
  location.href = 'index.html';
} else if (!isChinese && $('body').hasClass('zh')) {
  location.href = 'index_en.html';
}


// Wechat share
var data = {
  img: 'http://yach.me/images/avatar.jpg',
  link: 'http://yach.me',
  desc: '',
  title: '刘亚晨的简历'
};
wechat('friend', data);
wechat('timeline', data);
