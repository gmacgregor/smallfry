(function( exports, $ ) {

  var $form = $('form').first(),
    $url = $form.find('#url'),
    $slug = $form.find('#slug'),
    $msg = $('.js-messaging').first();

  $form.on('submit', shorten.bind( $form ));

  function shorten( e ) {
    e.preventDefault();
    var url = $.trim($url.val()),
        slug = $.trim($slug.val());

    if ( !url ) {
      return;
    }

    $.ajax({
      dataType: 'jsonp',
      url: 'http://tgam.ca/shorten/json/',
      data: {
        url: url,
        slug: slug
      }
    })
    .done( respond )
    .fail( function() {
      alert('Dammit!');
    });
  }

  function respond( resp ) {
    $msg.html( resp.result.short_url );
  }

})( window, window.jQuery);