 $( document ).ready(function() {  
	 

	 
var canvas = document.createElement('canvas');
     var context = canvas.getContext('2d');
     

     
     var pixelRatio = ol.has.DEVICE_PIXEL_RATIO;
     
     var getStackedStyle = function(feature, resolution) {
         var id = feature.getId();
        // fill.setColor(id > 'J' ? gradient(feature, resolution) : pattern);
         fill.setColor( pattern);
         return style;
       };
     
     
     var vectorLayer = new ol.layer.Vector({
         source: new ol.source.Vector({
           url: 'https://openlayers.org/en/v4.1.1/examples/data/geojson/countries.geojson',
           format: new ol.format.GeoJSON()
         }),
         style: getStackedStyle
       });
     
//     function patola(feature, resolution) {
//    	 ///alert('canvasw '+canvas.width);
//         var extent = feature.getGeometry().getExtent();
//         // Gradient starts on the left edge of each feature, and ends on the right.
//         // Coordinate origin is the top-left corner of the extent of the geometry, so
//         // we just divide the geometry's extent width by resolution and multiply with
//         // pixelRatio to match the renderer's pixel coordinate system.
//         var img = new Image();
//         img.src = 'https://mdn.mozillademos.org/files/222/Canvas_createpattern.png';
//         
//         context.fillStyle = 'white';
//         context.fillRect(0, 0, 5, 5);
//         // outer circle
//         context.fillStyle = 'rgba(102, 0, 102, 0.5)';
//         context.beginPath();
//         context.arc(5 * pixelRatio, 5 * pixelRatio, 4 * pixelRatio, 0, 2 * Math.PI);
//         context.fill();
//         // inner circle
//         context.fillStyle = 'rgb(55, 0, 170)';
//         context.beginPath();
//         context.arc(5 * pixelRatio, 5 * pixelRatio, 2 * pixelRatio, 0, 2 * Math.PI);
//         context.fill();
//         
//         var pattern = context.createPattern(canvas, 'repeat');
//         //context.fillStyle = pattern;
//        // context.fillRect(0, 0, 400, 400);
//         //var grad = context.createLinearGradient(0, 0,
//           //  ol.extent.getWidth(extent) / resolution * pixelRatio, 0);
//         
//         
//         return pattern;
//       }
     
     function gradient(feature, resolution) {
         var extent = feature.getGeometry().getExtent();
         // Gradient starts on the left edge of each feature, and ends on the right.
         // Coordinate origin is the top-left corner of the extent of the geometry, so
         // we just divide the geometry's extent width by resolution and multiply with
         // pixelRatio to match the renderer's pixel coordinate system.
         var grad = context.createLinearGradient(0, 0,
             ol.extent.getWidth(extent) / resolution * pixelRatio, 0);
         grad.addColorStop(0, 'red');
         grad.addColorStop(1 / 6, 'orange');
         grad.addColorStop(2 / 6, 'yellow');
         grad.addColorStop(3 / 6, 'green');
         grad.addColorStop(4 / 6, 'aqua');
         grad.addColorStop(5 / 6, 'blue');
         grad.addColorStop(1, 'purple');
         return grad;
       }
     

 
     var pattern = (function() {

         canvas.width = 41 * pixelRatio;
         canvas.height = 41 * pixelRatio;
         // white background
         context.fillStyle = 'white';
         context.fillRect(0, 0, canvas.width, canvas.height);
         // outer circle
         context.fillStyle = 'rgba(102, 0, 102, 0.5)';
         context.beginPath();
         context.arc(5 * pixelRatio, 5 * pixelRatio, 24 * pixelRatio, 0, 1 * Math.PI);
         context.fill();
         // inner circle
         context.fillStyle = 'rgb(55, 0, 170, 0.5)';
         context.beginPath();
         context.arc(5 * pixelRatio, 5 * pixelRatio, 32 * pixelRatio, 0, 1 * Math.PI);
        // context.lineTo(5 * pixelRatio, 5 * pixelRatio);
         context.fill();
         return context.createPattern(canvas,'no-repeat');
       }());
     
     var pattern12 = (function() {
    	 context.beginPath();
    	 context.arc(100, 55, 50, 0, 0.5 * Math.PI);
    	 context.lineTo(100,55);
    	 context.fill();
    	 context.stroke();
         return context.createPattern(canvas,'no-repeat');
       }());
     
     var fill = new ol.style.Fill();
     var style = new ol.style.Style({
       fill: fill,
       stroke: new ol.style.Stroke({
         color: '#333',
         width: 2
       })
     });
     
     var vectorSource = new ol.source.Vector({
         url: 'https://openlayers.org/en/v4.2.0/examples/data/geojson/countries.geojson',
         format: new ol.format.GeoJSON()
       });
     
     
       var vector = new ol.layer.Vector({
         source: vectorSource,
         style: new ol.style.Style({
           stroke: new ol.style.Stroke({
             color: 'rgba(0, 0, 255, 1.0)',
             width: 2
           })
         })
       });
       
/////////////////////// google map: //////////////////////////////////////////////  
       var gmap = new google.maps.Map(document.getElementById('gmap'), {
    	   disableDefaultUI: true,
    	   keyboardShortcuts: false,
    	   draggable: false,
    	   disableDoubleClickZoom: true,
    	   scrollwheel: false,
    	   streetViewControl: false
    	 });

    	 var view = new ol.View({
    	   // make sure the view doesn't go beyond the 22 zoom levels of Google Maps
    	   maxZoom: 21
    	 });
    	 view.on('change:center', function() {
    	   var center = ol.proj.transform(view.getCenter(), 'EPSG:3857', 'EPSG:4326');
    	   gmap.setCenter(new google.maps.LatLng(center[1], center[0]));
    	 });
    	 view.on('change:resolution', function() {
    	   gmap.setZoom(view.getZoom());
    	 });

    	 var olMapDiv = document.getElementById('olmap');
    	  map = new ol.Map({
    	   layers: [vector],
    	   interactions: ol.interaction.defaults({
    	     altShiftDragRotate: false,
    	     dragPan: false,
    	     rotate: false
    	   }).extend([new ol.interaction.DragPan({kinetic: null})]),
    	   target: olMapDiv,
    	   view: view
    	 });
    	 view.setCenter([0, 0]);
    	 view.setZoom(1);

    	 olMapDiv.parentNode.removeChild(olMapDiv);
    	 gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(olMapDiv);
    	 
/////////////////////// end google map //////////////////////////////////////////////      	 
    	    
/////////////////////// OSM: //////////////////////////////////////////////    	 
//         map = new ol.Map({
//     	    target: 'map',
//     	    layers: [
//     	      new ol.layer.Tile({
//     	            source: new ol.source.OSM()
//     	        }),
//
//     	    ],
//     	    view: new ol.View({
//     	      projection: 'EPSG:4326',
//     	      center: [50, 50],
//     	      zoom: 3,
//     	      maxResolution: 0.703125
//     	    }) 
//      })
/////////////////////// end OSM //////////////////////////////////////////////      	 
    	 
    	 
    	 
     
     // a normal select interaction to handle click
     var select = new ol.interaction.Select();
     map.addInteraction(select);

     selectedFeatures = select.getFeatures();

     // a DragBox interaction used to select features by drawing boxes
     var dragBox = new ol.interaction.DragBox({
       condition: ol.events.condition.platformModifierKeyOnly
     });

     map.addInteraction(dragBox);

     dragBox.on('boxend', function() {
    	
       // features that intersect the box are added to the collection of
       // selected features
       var extent = dragBox.getGeometry().getExtent();
       
       vector.setVisible(false);

       glLayerSources["wells_eom_wgs84_webview"].forEachFeatureIntersectingExtent(extent, function(feature) {
    	   selectedFeatures.push(feature);
       });
       
       glWMSLayerSources["wells_eom_wgs84_webview"].forEachFeatureIntersectingExtent(extent, function(feature) {
           selectedFeatures.push(feature);
       });
       
       glLayerSources["fields_wgs84_webview"].forEachFeatureIntersectingExtent(extent, function(feature) {
           selectedFeatures.push(feature);
       });
       
       glLayerSources["basins_webview"].forEachFeatureIntersectingExtent(extent, function(feature) {
           selectedFeatures.push(feature);
       });
       
     });

     // clear selection when drawing a new box and when clicking on the map
     dragBox.on('boxstart', function() {
       selectedFeatures.clear();
     });

     var infoBox = document.getElementById('info');

     selectedFeatures.on(['add', 'remove'], function() {
       var names = selectedFeatures.getArray().map(function(feature) {
         return feature.get('Object');
       });
       if (names.length > 0) {
         infoBox.innerHTML = names.join(', ');
       } else {
         infoBox.innerHTML = 'No countries selected';
       }
     });
     
     var ghostZoom = map.getView().getZoom();
     map.on('moveend', (function() {
         if (ghostZoom != map.getView().getZoom()) {
             ghostZoom = map.getView().getZoom();
             console.log('zoomend '+ghostZoom);
             
             for (let key of mapLayers.keys()) {
            	    console.log(key);
            	    //alert(mapLayers.get(key).webLabelZoomLevel);
            	}
             
             map.getLayers().forEach(function(el) {
            	 // if (el.get('name') === 'my_layer_name') {
            	    console.log(el.get('name'));
            	 // }
            	})
            // alert(JSON.stringify(map.getLayers()));
             
            if(ghostZoom > 7){
            	map.addLayer(vectorLayers["wells_eom_wgs84_webview"]);
				map.removeLayer(glWMSLayerSources["wells_eom_wgs84_webview"]);
            } else {
				map.removeLayer(vectorLayers["wells_eom_wgs84_webview"]);
				map.addLayer(glWMSLayerSources["wells_eom_wgs84_webview"]); 
            }
         }
     }));
     
    // map.on("zoomend", map, function(){
         
    //	 alert("zoomend");
    	 //var lyr = map.getLayersByName('vectorLayer')[0];
         //map.removeLayer(lyr);
   // });

	 
 });