//var mymap = L.map('map').setView([45.51, -122.68], 13);


var maxBounds = L.latLngBounds(
    L.latLng(.1, -189.276413), //SW
    L.latLng(75.162102, -20.233040) //NE
);

//L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);

var map = L.map('map', {
    center: [33.5, -97.2],
    zoom: 4,
    minZoom: 4,
    maxZoom: 6,
    maxBounds: maxBounds
});



//base layer 
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
    //    bounds = new L.LatLngBounds(new L.LatLng(alaskaLayer), new L.LatLng(statesLayer))
}).addTo(map);

//AUTHORIZATION AND CLIENT OBJECT
var client = new carto.Client({
    apiKey: 'M8WXEDHIEj6821MJnAmsuw',
    username: 'sonnyrae'
});


//dataset vars
var noShows = new carto.source.Dataset("dead0shows")

var usStates = new carto.source.Dataset("deadshowscontig");

var hawaii = new carto.source.Dataset("hawaii");

var alaska = new carto.source.Dataset("alaska");

//layer styles

var noShowsStyle = new carto.style.CartoCSS(`

#layer {
  polygon-fill: #928f9c;
  polygon-opacity: 0.9;
}
#layer::outline {
  line-width: 1;
  line-color: #FFFFFF;
  line-opacity: 0.5;
}
#layer::labels {
  text-name: [state];
  text-face-name: 'DejaVu Sans Book';
  text-size: 10;
  text-fill: #FFFFFF;
  text-label-position-tolerance: 0;
  text-halo-radius: 0;
  text-halo-fill: #6F808D;
  text-dy: 0;
  text-allow-overlap: true;
  text-placement: point;
  text-placement-type: dummy;
}
`);

var statesStyle = new carto.style.CartoCSS(`

#layer {
  polygon-fill: ramp([num_shows], (#facccc, #f59999, #f06666, #eb3131, #e60000),
  (10, 30, 55, 101, 300), "=<" );
}
#layer::outline {
  line-width: 1;
  line-color: #FFFFFF;
  line-opacity: 0.5;
}
#layer::labels {
  text-name: [state];
  text-face-name: 'DejaVu Sans Book';
  text-size: 10;
  text-fill: #FFFFFF;
  text-label-position-tolerance: 0;
  text-halo-radius: 0;
  text-halo-fill: #6F808D;
  text-dy: 0;
  text-allow-overlap: true;
  text-placement: point;
  text-placement-type: dummy;
}
`);


//layers vars
var noShowsLayer = new carto.layer.Layer(noShows, noShowsStyle);
var statesLayer = new carto.layer.Layer(usStates, statesStyle, {
    featureOverColumns: ["name", "num_shows"]
});


var hawaiiLayer = new carto.layer.Layer(hawaii, statesStyle);
var alaskaLayer = new carto.layer.Layer(alaska, statesStyle);

client.addLayers([statesLayer, hawaiiLayer, alaskaLayer, noShowsLayer]);

//client.addLayer(statesLayer);

client.getLeafletLayer().addTo(map);

//
//
//var legend = L.control({
//    position: 'bottomright'
//});
//
//legend.onAdd = function (map) {
//
//    var div = L.DomUtil.create('div', 'info legend'),
//        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
//        labels = [];
//
//    // loop through our density intervals and generate a label with a colored square for each interval
//    for (var i = 0; i < grades.length; i++) {
//        div.innerHTML +=
//            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
//            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
//    }
//
//    return div;
//};
//
//legend.addTo(map);


//popup object
var popup = L.popup({
    closeButton: false
});

//popup logic when mouse over feature
statesLayer.on('featureOver', featureEvent => {

    //content HTML string
    var popupContent = `
        <h4><i><div id="textpopti">${featureEvent.data.name}</div></i></h4>
        <div id="textpop">Number of Shows: ${featureEvent.data.num_shows}</div>
        `
    //add position, content and open on the map
    popup.setLatLng(featureEvent.latLng);
    popup.setContent(popupContent);
    popup.openOn(map);

});


//remove popup on mouse out of feature
statesLayer.on('featureOut', featureEvent => {
    popup.removeFrom(map);
});



////////////////////////////////////////////////////////////////////////
///TESTING
//function openPopup(featureEvent) {
//    let content = '<div class="widget">';
//
//    if (featureEvent.data.name) {
//        content += `<h2 class="h2">${feature.Event.data.name}</h2>`;
//    }
//
//    if (featureEvent.data.num_shows) {
//        content += `<ul>`;
//
//        if (featureEvent.data.num_shows) {
//            content += `<li><h3>${featureEvent.data.num_shows}</h3></li>`
//        }
//
//        content += `</ul>`;
//    }
//
//    content += `</div>`;
//
//    pop.setContent(content);
//    popup.setLatLng(feature.Event.latLng);
//    if (!popup.isOpen()) {
//        popup.openOn(map);
//    }
//
//}
//
//function closePopup(featureEvent) {
//    popup.removeFrom(map);
//}
//
//function setPopupsHover() {
//    statesLayer.on('featureOver', openPopup);
//    statesLayer.on('featureOut', closePopup);
//}


// first attempt popup - not complete

//var popup = L.popup({
//    closeButton: false
//});
//statesLayer.on(carto.layer.events.FEATURE_OVER, featureEvent => {
//    //    console.log(featureEvent)
//    popup.setLatLng(featureEvent.latLng);
////        console.log(popup)
//    if (!popup.isOpen()) {
//        console.log(featureEvent.data.num_shows)
//        popup.setContent(featureEvent.data.num_shows);
//        popup.openOn(map);
//    }
//});
//
//statesLayer.on(carto.layer.events.FEATURE_OUT, featureEvent => {
//    popup.removeFrom(map);
//});



//console.log(hawaiiLayer)




//function hightlightFeature(e) {
//    var layer = e.target;
//    
//    layer.setStyle({
//        weight: 5,
//        color: "#666",
//        dashArray: '',
//        fillOpacity: 0.7
//    });
//}
//
//function resetHighlight(e) {
//    layer.resetStyle(e.target);
//}
//
//function onEachFeature(feature, layer) {
//    layer.on({
//        mouseover: highlightFeature,
//        mouseout: resetHighlight,
//    });
//}


//function style(states) {
//    return {
//        fillColor: "red",
//        weight: 2,
//        opacity: 1,
//        color: 'white'
//    }
//    
//}

//L.geoJson(states).addTo(map);

//var mymap = L.map('map', {
//    center: [45.51, -122.68],
//    zoom: 4
//});

//original statesLayer fill
//#layer {
//  polygon-fill: ramp([num_shows], (#facccc, #f59999, #f06666, #ed4c4c, #e60000), quantiles)
//}

//attempt at turbo, manual
//#layer {
//polygon-fill: ramp([num_shows], (#facccc, #f59999, #f06666, #ed4c4c, #e60000),
//10, 30, 55, 101, 300, "=<" );
//}
//
//
////legend testing
//
//function getColor(d) {
//    return d = < 10 ? '#facccc' :
//        return d = < 30 ? '#f59999' :
//            return d = < 55 ? '#f06666' :
//                return d = < 101 ? '#eb3131' :
//                    return d = < 300 ? '#e60000';
//}
//
//var info = L.control();
//
//info.onAdd = function (map) {
//    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
//    this.update();
//    return this._div;
//};
//
//var legend = L.control({
//    position: 'bottomright'
//});
//
//legend.onAdd = function (map) {
//    var div = L.DomUtil.create('div', 'info legend'),
//        grades = [0, 10, 55, 101, 300],
//        labels - [];
//
//    for (var i = 0; i < grades.length; i++) {
//        div.innerHTML += '< i style = "background:' + getColor(grades[i] + 1) + '" > < /i> ' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
//    }
//    return div;
//};
//
//legend.addTo(map);
