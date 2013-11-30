
(function( exports, $ ) {

'use strict';

var store = exports.localStorage,
  $form = $('form').first(),
  $url = $('#url'),
  $slug = $('#slug'),
  $msg = $('.js-messaging').first(),
  $code = $('code').first(),
  $ok = $code.find(' ~ button').first(),
  api = 'http://tgam.ca/shorten/json/',
  defaultPath = '?edit=me';

var _path = function() {
  return store.getItem('TheCodes') || defaultPath;
};
$code.text( _path() );
$form.on( 'submit', shorten.bind( $form ) );
$code.on( 'click', edit );
$ok.on( 'click', save );

function cleanUrl( url ) {
  return $.trim( url.split('?')[0].split('#')[0] ) + _path();
}

function edit() {
  $code
    .attr('contenteditable', true)
    .focus();
  $ok.removeClass('hidden');
}

function save() {
  $code.attr('contenteditable', false);
  $ok.addClass('hidden');
  var codes = $code.text();
  if ( $.trim( codes ) === '' ) {
    codes = defaultPath;
    $code.text( defaultPath );
  }
  console.log('Saving: ', codes);
  store.setItem('TheCodes', codes);
}

function shorten( e ) {
  e.preventDefault();
  var url = cleanUrl( $url.val() ),
      slug = $.trim( $slug.val() ),
      data = { url: url, slug: slug },
      editing = ( $code.attr('contenteditable') === true );

  if ( editing || _path() === defaultPath ) {
    return;
  }

  $.ajax( { dataType: 'jsonp', url: api, data: data } )
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