$(document).ready(function(){
  L.mapbox.accessToken = 'pk.eyJ1IjoiZ3JlZ2dhd2F0dCIsImEiOiJjaWppNGpzZm4wMnZxdHRtNWNuaHFsOWE5In0.XZJCOdDSALLBYWBt4bHmlw';
  var map = L.mapbox.map('map', 'mapbox.streets')
                    .setView([1, 36], 6)
  var unclustered = L.mapbox.featureLayer();
  var clustered = L.markerClusterGroup();
  var counties = ""

  var projectPerCounty = {}

  var myIcon = L.mapbox.marker.icon({
      'marker-size': 'large',
      'marker-color': '#fa0'
  })

  function popUp(element){
    return "<b>Project Title:</b> " + element["Project Title"] + "</br></br>" +
      "<b>Project Description:</b> " + element["Project Description"] + "</br></br>" +
      "<b>Project Objectives:</b> " + element["Project Objectives"] + "</br></br>"
  }

  function drawCounties(){
    $.ajax({
      type: "GET",
      url: "http://localhost:8080/data/counties.geojson",
      dataType: "text",
      success: function(data){
        counties = JSON.parse(data)
        L.geoJson(counties,  {
          style: getStyle,
        }).addTo(map);
      }
    });
  }


  function getStyle(feature) {
    return {
      weight: 2,
      opacity: 0.1,
      color: 'black',
      fillOpacity: 0.7,
      fillColor: getColor(projectPerCounty[feature.properties.COUNTY_NAM])
    };
  }

  function getColor(d) {
    return d > 300 ? '#8c2d04' :
        d > 200  ? '#cc4c02' :
        d > 100  ? '#ec7014' :
        d > 70  ? '#fe9929' :
        d > 50   ? '#fec44f' :
        d > 30   ? '#fee391' :
        d > 20   ? '#fff7bc' :
        '#ffffe5';
  }

  function getLegendHTML() {
    var grades = [0, 20, 30, 50, 70, 100, 200, 300],
    labels = [],
    from, to;

    for (var i = 0; i < grades.length; i++) {
      from = grades[i];
      to = grades[i + 1];

      labels.push(
        '<li><span class="swatch" style="background:' + getColor(from + 1) + '"></span> ' +
        from + (to ? '&ndash;' + to : '+')) + '</li>';
    }

    return '<span>Projects Per County</span><ul>' + labels.join('') + '</ul>';
  }


  function populateClusteredMap() {
      $.ajax({
      type: "GET",
      url: "http://localhost:8080/data/rows.csv",
      dataType: "text",
      success: function(data){
        projectPerCounty = {}
        locations = $.csv.toObjects(data);
        locations.forEach(function(element, index){
          if(typeof projectPerCounty[element["County"]] === 'undefined'){
            projectPerCounty[element["County"]] = 1
          } else {
            projectPerCounty[element["County"]] = 1 + projectPerCounty[element["County"]]
          }
          lat_long = element.Location2_Secondary.replace(/[()]/g, '').replace(/\s/g, '').split(',')
          if(typeof lat_long[0] === 'undefined' || typeof lat_long[1] === 'undefined'){
            console.log(element.EPGeoName + " does not have valid location data, skipping")
          } else {
            var marker = L.marker([lat_long[0], lat_long[1]], {
              icon: myIcon
            }).bindPopup(popUp(element))
            clustered.addLayer(marker)
          }
        });
        drawCounties()
        map.legendControl.addLegend(getLegendHTML());
        map.addLayer(clustered)
      }
    });
  }

  function populateUnclusteredMap() {
      $.ajax({
      type: "GET",
      url: "http://localhost:8080/data/rows.csv",
      dataType: "text",
      success: function(data){
        projectPerCounty = {}
        locations = $.csv.toObjects(data);
        locations.forEach(function(element, index){
          if(typeof projectPerCounty[element["County"]] === 'undefined'){
            projectPerCounty[element["County"]] = 1
          } else {
            projectPerCounty[element["County"]] = 1 + projectPerCounty[element["County"]]
          }
          lat_long = element.Location2_Secondary.replace(/[()]/g, '').replace(/\s/g, '').split(',')
          if(typeof lat_long[0] === 'undefined' || typeof lat_long[1] === 'undefined'){
            console.log(element.EPGeoName + " does not have valid location data, skipping")
          } else {
            var marker = L.marker([lat_long[0], lat_long[1]], {
              icon: myIcon
            }).bindPopup(popUp(element)).addTo(unclustered);
          }
        });
        map.legendControl.addLegend(getLegendHTML());
        map.addLayer(unclustered)
        drawCounties()
      }
    });
  }

  $("#button").click(function(){
    if(this.innerHTML == "Uncluster"){
      populateUnclusteredMap()
      map.removeLayer(clustered)
      this.innerHTML = "Cluster"
    } else {
      populateClusteredMap()
      map.removeLayer(unclustered)
      this.innerHTML = "Uncluster"
    }
  });

  populateClusteredMap()

});
