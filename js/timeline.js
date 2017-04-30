function Timeline(id) {
  this.id = id;
  this.draw = SVG(id);
  this.timeline = this.draw.line(0, 100, this.width(), 100).stroke({ width: 4, color: '#f7dddb', opacity: 0.5 });

  this.points = $('.js-pre-timeline li').map(function() {
    return {
      year: $(this).children('[data-role="year"]').html(),
      company: $(this).children('[data-role="company"]').html(),
      title: $(this).children('[data-role="title"]').html(),
      desc: $(this).children('[data-role="desc"]').html(),
      logo: {
        url: $(this).children('[data-role="logo"]').attr('src'),
        width: $(this).children('[data-role="logo"]').attr('width'),
        height: $(this).children('[data-role="logo"]').attr('height')
      }
    };
  }).get();

  this.title = $('.timeline h2').html();
  this.i18n = {
    title: $('.timeline h2').data('title'),
    company: $('.timeline h2').data('company')
  };

  var self = this;
  this.points.forEach(function(point, index) {
    point.text = {
      year: self.draw.text(point.year.toString())
    };
    point.svg = {
      bg: self.draw.circle(32).fill('#c95b52'),
      border: self.draw.circle(18).stroke({
        color: '#000',
        opacity: 0.1,
        width: 6
      }).fill('none'),
      fill: self.draw.circle(12).fill('#fff'),
      line: self.draw.line(0, 120, 0, 250 + (index - 1) * 90).stroke({
        color: '#fff',
        width: 4
      }),
      logo: self.draw.image(point.logo.url, point.logo.width, point.logo.height)
    };
    point.dom = $('<div class="arrow">&gt;</div>').appendTo('#' + self.id);
  });

  this.resize();

  this.draw.mousemove(function(e) {
    var left = e.pageX - $('#' + id).offset().left;
    var minValue, minIndex;
    self.points.forEach(function(point, index) {
      if (typeof minValue === 'undefined' || minValue > Math.abs(point.x - left)) {
        minValue = Math.abs(point.x - left);
        minIndex = index;
      }
    });
    self.points.forEach(function(point, index) {
      if (index === minIndex) {
        // point.svg.fill.size(18, 18);
        point.svg.line.opacity(1);
        point.svg.logo.opacity(1);
        point.dom.css('opacity', 1);
      } else {
        // point.svg.fill.size(12, 12);
        point.svg.line.opacity(0.5);
        point.svg.logo.opacity(0.5);
        point.dom.css('opacity', 0.5);
      }
    });
  });

  this.draw.click(function(e) {
    var left = e.pageX - $('#' + id).offset().left;
    var minValue, minIndex;
    self.points.forEach(function(point, index) {
      if (typeof minValue === 'undefined' || minValue > Math.abs(point.x - left)) {
        minValue = Math.abs(point.x - left);
        minIndex = index;
      }
    });
    var point = self.points[minIndex];
    var $detail = $('.timeline').addClass('detail').find('.detail');
    $('.timeline h2').fadeOut(250, function() {
      $(this).html(self.i18n.company + '<span>' + point.company + '</span>').fadeIn(250);
    });
    $('.timeline .detail h3').html(self.i18n.title + '<span>' + point.title + '</span>');
    $('.timeline .detail .desc').html(point.desc);
  });

  $('.timeline .detail').click(function() {
    $('.timeline').removeClass('detail');
    $('.timeline h2').fadeOut(250, function() {
      $(this).html(self.title).fadeIn(250);
    });
  });
}

Timeline.prototype.width = function() {
  return $('#' + this.id).width();
};

Timeline.prototype.resize = function() {
  var self = this;
  var width = this.width();
  var startX = 39;
  var endX = width - 39 * 2;
  var yearGap;
  if (width > 400) {
    yearGap = (endX - startX) /
      (this.points[this.points.length - 1].year - this.points[0].year);
  } else {
    yearGap = (endX - startX) / (this.points.length - 1);
  }

  this.points.forEach(function(point, index) {
    var x;
    if (width > 400) {
      x = (point.year - self.points[0].year) * yearGap;
    } else {
      x = index * yearGap;
    }
    point.x = x + 38;
    point.text.year.move(x + 38, 62).fill('#fff');
    point.svg.bg.move(x + 39, 84);
    point.svg.border.move(x + 46, 91);
    point.svg.fill.move(x + 49, 94);
    point.svg.line.x(x + 55);
    point.svg.logo.move(x, 270 + (index - 1) * 90);
    var offsetX = 0, offsetY = 0;
    if (index === 1) {
      offsetX = 5;
    } else if (index === 2) {
      offsetY = -2;
    }
    point.dom.css({
      left: x + 110 + offsetX,
      top: 265 + (index - 1) * 90 + offsetY
    });
  });
};
