(function(){
  'use strict';

  $(document).ready(function(){
    $('#location').blur(geocode);
  });
  function geocode(){
      var location = $('#location').val();
      geocode(location, function(loc, lat, lng){
         // Update origin before submit
        $('#location').val(loc);
        $('#locationLat').val(lat);
        $('#locationLng').val(lng);
      });
    }
})();
