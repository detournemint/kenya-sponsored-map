$(document).ready(function(){
  L.mapbox.accessToken = 'pk.eyJ1IjoiZ3JlZ2dhd2F0dCIsImEiOiJjaWppNGpzZm4wMnZxdHRtNWNuaHFsOWE5In0.XZJCOdDSALLBYWBt4bHmlw';
  var myIcon = L.mapbox.marker.icon({
      'marker-size': 'large',
      'marker-color': '#fa0'
  })

  var popUp = function(element){
    return "<b>Project Title:</b> " + element["Project Title"] + "</br></br>" +
    "<b>Project Description:</b> " + element["Project Description"] + "</br></br>" +
    "<b>Project Objectives:</b> " + element["Project Objectives"] + "</br></br>"
  }

  var map = L.mapbox.map('map', 'mapbox.streets')
                    .setView([1, 36], 6)
  $.ajax({
    type: "GET",
    url: "http://localhost:8080/data/counties.geojson",
    dataType: "text",
    success: function(data){
      counties = JSON.parse(data)
      map.featureLayer.setGeoJSON(counties);
    }
  })


  $.ajax({
    type: "GET",
    url: "http://localhost:8080/data/rows.csv",
    dataType: "text",
    success: function(data){
      locations = $.csv.toObjects(data);
      var markerClusters = L.markerClusterGroup();
      locations.forEach(function(element, index){
        lat_long = element.Location2_Secondary.replace(/[()]/g, '').replace(/\s/g, '').split(',')
        if(typeof lat_long[0] === 'undefined' || typeof lat_long[1] === 'undefined'){
          console.log(element.EPGeoName + " does not have valid location data, skipping")
        } else {
          var marker = L.marker([lat_long[0], lat_long[1]], {
            icon: myIcon
          }).bindPopup(popUp(element))
          markerClusters.addLayer(marker)
        }
      });
      map.addLayer(markerClusters)
    }
  });
});
