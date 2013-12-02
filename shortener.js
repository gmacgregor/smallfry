
(function( exports, $ ) {

'use strict';

var module = {};
var api = 'http://tgam.ca/shorten/json/',
  defaultPath = '?click=tglobe',
  store = exports.localStorage,
  storeKey = 'tgamca:shorten';

var $form = $('form').first(),
  $url = $('#url'),
  $slug = $('#slug'),
  $msg = $('.js-messaging').first(),
  $code = $('code').first(),
  $ok = $code.find(' ~ button').first();

function init() {
    $code
      .text( path() )
      .on( 'click', edit )
      .on( 'keydown', wiretap );
    $ok.on( 'click', save );
    $form.on( 'submit', shorten.bind( $form ) );
}

module = { init: init };
return module;

function path( val ) {
  if ( !val ) {
    return store.getItem( storeKey ) || defaultPath;
  }
  console.log('Saving: ', val);
  store.setItem( storeKey, val );
}

function cleanUrl() {
  return $.trim( $url.val().split('?')[0].split('#')[0] ) + path();
}

function wiretap( e ) {
  if ( e.keyCode === 13 )  {
    // user has pressed enter
    e.preventDefault();
    e.stopPropagation();
    save();
    return false;
  }
  return true;
}

function edit( e ) {
  $code
    .attr('contenteditable', true)
    .focus();
  $ok.removeClass('hidden');
}

function save() {
  $code.attr('contenteditable', false);
  var val = $.trim( $code.text() );
  $ok.addClass('hidden');
  if ( val === '' ) {
    val = defaultPath;
    $code.text( val );
  }
  path( val );
}

function shorten( e ) {
  e.preventDefault();
  var editing = ( $code.attr('contenteditable') == 'true' ),
    defaultBehaviour = ( path() == defaultPath ),
    noUrl = $.trim( $url.val() ) === '';

  if ( noUrl || editing || defaultBehaviour ) {
    return;
  }

  var url = cleanUrl(),
    slug = $.trim( $slug.val() ),
    data = { url: url, slug: slug };

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
 var html = '<p class="has-error">There was an error shortening that url. Please try again.</p>';
 $msg
  .addClass( 'alert alert-error' )
  .html( html );
}

function party( url ) {
  $url.val('');
  $slug.val('');
  var html = '<p><span class="glyphicon glyphicon-ok"></span> Success! <strong>{{ url }}</strong></p>';
  $msg
    .addClass('alert alert-success')
    .html( html.replace('{{ url }}', url) );
}

})( window, window.jQuery).init();
