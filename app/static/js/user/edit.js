/* global google:true */
/* jshint camelcase:false */
(function(){
  'use strict';

  $(document).ready(function(){
    $('form').submit(getLocation);
  });
  function getLocation(e){
    var lat = $('#locationLat').val();
    if(!lat){
      var name = $('#location').val();
      geocode(name);
      e.preventDefault();
    }
  }

  function geocode(address){
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({address:address}, function(results, status){
      var loc  = results[0].formatted_address,
          lat  = results[0].geometry.location.lat(),
          lng  = results[0].geometry.location.lng();
      $('#location').val(loc);
      $('#locationLat').val(lat);
      $('#locationLng').val(lng);
      $('form').submit();
      console.log(name, lat, lng);
    });
  }

})();
