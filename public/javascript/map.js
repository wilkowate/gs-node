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
     

     var map = new ol.Map({
    	    target: 'map',
    	    layers: [
    	      new ol.layer.Tile({
    	            source: new ol.source.OSM()
    	        }),
    	        vectorLayer,
    	      new ol.layer.Tile({
    	        title: 'Global Imagery',
    	        source: new ol.source.TileWMS({
    	         // url: 'http://demo.opengeo.org/geoserver/wms',
    	          url: 'http://gs.hamptondata.com/geoserver/hds/wms?service=WMS',
    	          params: {LAYERS: 'hds:wells_eom_WI', VERSION: '1.1.0'}
    	          //params: {LAYERS: 'nasa:bluemarble', VERSION: '1.1.1'}
    	        })
    	      })

    	    ],
    	    view: new ol.View({
    	      projection: 'EPSG:4326',
    	      center: [50, 50],
    	      zoom: 3,
    	      maxResolution: 0.703125
    	    })  })
    	    
    	 //  var canvas = document.createElement('canvas');
    	 //  var render = ol.render.toContext(canvas.getContext('2d'),  { size: [100, 100] });
    	   //  render.setFillStrokeStyle(new ol.style.Fill({ color: '#00f' }));
    	  //   render.drawPolygon(    new ol.geom.Polygon([[[0, 0], [100, 100], [200, 10], [0, 2]]]));

	 
 });