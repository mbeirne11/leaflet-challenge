// Creating the map object
var myMap = L.map("map", {
    center: [0,0],
    zoom: 2
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // Use this link to get the GeoJSON data.
  var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  function getColor(c) {
    return c > 200 ? '#800026' :
           c > 100  ? '#BD0026' :
           c > 50  ? '#E31A1C' :
           c > 20  ? '#FC4E2A' :
                      '#FD8D3C';
}
  // Getting our GeoJSON data
  d3.json(link).then(function(data) {
    // Creating a GeoJSON layer with the retrieved data
    let features = data.features;
    features.forEach(element => {
        L.circle([element.geometry.coordinates[1],element.geometry.coordinates[0]], {
            radius: Math.pow(element.properties.mag*75,2),
            color: getColor(element.geometry.coordinates[2]),
            
        }).addTo(myMap)
        .bindPopup(`<h3>${element.properties.place}<br></h3><p>Magnitude: ${element.properties.mag}<br>
        <p>Depth: ${element.geometry.coordinates[2]}<br></br>`)
        
        
    });
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [20, 50, 100, 200],
            labels = [];
            div.innerHTML +=
            'Earthquake Depth </br>';
            div.innerHTML +=
            '<i style="background-color:' + getColor(grades[0]) + ';' +'"></i> ' +
            '<' + grades[0] + '</br>';
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
    
        return div;
    };
    
    legend.addTo(myMap);
  });
  