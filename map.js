//var mymap = L.map('map').setView([45.51, -122.68], 13);


var maxBounds = L.latLngBounds(
    L.latLng(.1, -189.276413), //SW
    L.latLng(75.162102, -20.233040) //NE
);

var map = L.map('map', {
    center: [33.5, -86.8],
    zoom: 4,
    minZoom: 4,
    maxZoom: 5,
    maxBounds: maxBounds,
    gestureHandling: 'cooperative'
});



//layer = 
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
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


//vars
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
  polygon-fill: ramp([num_shows], (#facccc, #f59999, #f06666, #ed4c4c, #e60000), quantiles)
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


const popup = L.popup({
    closeButton: false
});

function openPopup(featureEvent) {
    let content = '<div class="widget">';

    if (featureEvent.data.name) {
        content += `<h2 class="h2">${featureEvent.data.name}</h2>`;
    }

    if (featureEvent.data.num_shows) {
        content += `<ul>`;

        if (featureEvent.data.num_shows) {
            content += `<li><h3>Max:</h3><p class="open-sans">${featureEvent.data.num_shows}</p></li>`;
        }

//        if (featureEvent.data.num_shows) {
//            content += `<li><h3>Min:</h3><p class="open-sans">${featureEvent.data.num_shows}</p></li>`;
//        }

        content += `</ul>`;
    }

    content += `</div>`;

    popup.setContent(content);
    popup.setLatLng(featureEvent.latLng);
    if (!popup.isOpen()) {
        popup.openOn(map);
    }
}

function closePopup(featureEvent) {
    popup.removeFrom(map);
}

function setPopupsHover() {
    populatedPlacesLayer.off('featureClicked');
    populatedPlacesLayer.on('featureOver', openPopup);
    populatedPlacesLayer.on('featureOut', closePopup);
}




//// second attempt at popup
//
//var popup = L.popup({
//    closeButton: false
//});
//
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
//    //    console.log(popup)
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
//


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
