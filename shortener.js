(function( exports, $ ) {

var store = exports.sessionStorage,
  $form = $('form').first(),
  $url = $form.find('#url'),
  $slug = $form.find('#slug'),
  $msg = $('.js-messaging').first(),
  $code = $('code').first(),
  api = 'http://tgam.ca/shorten/json/',
  path = '';

$form.on( 'submit', shorten.bind( $form ) );
$code.on( 'click', edit );

function cleanUrl( url ) {
  return $.trim( url.split('?')[0].split('#')[0] ) + path;
}

function edit( evt ) {
  var $thing = $(evt.currentTarget);
}

function shorten( e ) {
  e.preventDefault();
  var url = cleanUrl( $url.val() ),
      slug = $.trim( $slug.val() ),
      d = { url: url, slug: slug };

  if ( !url ) {
    return;
  }
  console.log(url);
  $.ajax( { dataType: 'jsonp', url: api, data: d } )
    .done( respond )
    .fail( facepalm );
}

function respond( resp ) {
  var d = resp.result;
  if ( d.success === 'false' ) {
    return facepalm();
  }
  return party( d.short_url );
}

function facepalm() {
 $msg
  .addClass( 'alert alert-error' )
  .html( '<p class="has-error">There was an error shortening that url. Please try again.</p>' );
}

function party( url ) {
  $url.val('');
  $slug.val('');
  $msg.addClass('alert alert-success').html('<p>Success! <strong>' + url + '</strong></p>');
}

})( window, window.jQuery);