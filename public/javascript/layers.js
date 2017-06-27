 $( document ).ready(function() {

	glLayerSources = [];
	
	var geojsonFormat = new ol.format.GeoJSON();
	
    window.loadFeatures1 = function(response) {
 	   //alert(JSON.stringify(response));
    	
    	var layerName = response.features[0].properties.layer.trim()+"_webview";
    	//alert("L:"+layerName+"|");
    	glLayerSources[layerName.toLowerCase()].addFeatures(geojsonFormat.readFeatures(response));
    	//vectorSource_wells.addFeatures(geojsonFormat.readFeatures(response));
    };
	 
	//loading active layers
	$(function() {
		var parameters = { search: $(this).val(), id:1 };
		$.get( '/layers/loadActiveLayers',parameters, function(data) {
			
			$.each(data.layers, function(i, layer) {
				//PROCESS EACH LAYER
					 
				if(layer.layerName == 'imagesDB' || 
						layer.layerName == 'russia_01' || 
						layer.layerName == 'wells_EOM' || 
						layer.layerName == 'fields'){
					return true;
				}
					 
				var layerName = layer.layerName+"_webview";
				
				$('<div class="layer" style=" margin:15px; border:0px solid #000900;height:150px;width:400px;">').append(
					$('<input type="checkbox">').html(layer.layerName),
					$('<label>').text(layer.layerName),
					$('<input data-layer_id="'+layerName+'"  type="image" src="images/icons/layer-layer-on.png" >').text('&nbsp;&nbsp;'),
					$('<input data-layer_id="'+layerName+'"  type="image" src="images/icons/layer-labels-on.png" >').text(' '),
					$('<input data-layer_id="'+layerName+'"  type="image" src="images/icons/layer-wms-on.png" >').text('&nbsp;&nbsp;'),
					$('<input  type="image" src="images/icons/layer-legend-on.png" >').text('  '),
					$('<canvas class="layerCanvas'+i+'" style="width="100px";height=100px; margin:5px; border:1px solid #000900;">')
			    	    // add a cell to the row with the todo title
			    	    // and another cell with the due date
				).appendTo('#layersDiv');
					 
					 //var canvas = document.getElementsByTagName('canvas')[0];
					 //canvas.width  = 300;
					 //canvas.height = 100;
				
			    	  
			    var vectorSource_wells = new ol.source.Vector({
			    	loader: function(extent, resolution, projection) {
			             var url = 'http://192.168.1.162:8080/geoserver/cite/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cite:'+layer.geoServerLayerName+'&maxFeatures=5000&outputFormat=text/javascript&format_options=callback:loadFeatures1';
			             			//http://localhost:8080/geoserver/topp/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=topp:states&maxFeatures=50&outputFormat=application%2Fjson';
			             // use jsonp: false to prevent jQuery from adding the "callback"
			             // parameter to the URL
			             $.ajax({url: url, dataType: 'jsonp', jsonp: false});
			           },
			        strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
			             maxZoom: 19
			        }))
			    });
				     
				glLayerSources[layerName.toLowerCase()] = vectorSource_wells;
				//alert("s"+layerName+"|");
				     

				     
				var vector = new ol.layer.Vector({
					source: vectorSource_wells,
				    style: getStyle(layer.shapeType, layer.color)
				    });
				       
				layers[layerName] = vector;
				       
				map.addLayer(vector);
						 
					// map.addLayer(new ol.layer.Vector({
					//     source: vectorSource
					//}));
					 
					 
					  var ctx = $(".layerCanvas"+i)[0].getContext("2d");
					  ctx.moveTo(0,0);
					  
					  ctx.fillStyle = "#"+layer.color;
					  ctx.fillRect(0,0,50,30);
			    	     // alert('layer'+$('#layersDiv').html());
			});

			$( ".layer" ).find( 'input' ).click(function() {
				  //alert( "Handler for .click() called."+$(this).attr('data-layer_id') );
				if($(this).attr('src')=='images/icons/layer-layer-off.png'){
					$(this).attr('src','images/icons/layer-layer-on.png');
					layers[$(this).attr('data-layer_id')].setVisible(true);
				} else{
					$(this).attr('src','images/icons/layer-layer-off.png');
					layers[$(this).attr('data-layer_id')].setVisible(false);
				}
			});
					
				//  ctx.stroke();
				  
			   });   
	});
	
	function getStyle(shapeType, colorTxt){
		
		var hexColor = "#"+colorTxt;
		var color = ol.color.asArray(hexColor);
		color = color.slice();
		color[3] = 0.2;
		
		var polygonStyles = [
		     new ol.style.Style({
		    	 fill: new ol.style.Fill({color: color}),
		    	 stroke: new ol.style.Stroke({color: 'black', width: 1})
		     })
		];
		
		var pointStyles = [
		     new ol.style.Style({
	          	 image: new ol.style.Circle({
	                  radius: 10,
	                  fill: new ol.style.Fill({color: '#66ccff'}),
	                  stroke: new ol.style.Stroke({color: '#000', width: 1})
	             })
		     })
		];
		
		if(shapeType==1){
			return pointStyles;
		} else {
			return polygonStyles;
		}
	}
  
});