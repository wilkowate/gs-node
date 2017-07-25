 $( document ).ready(function() {

	glLayerSources = [];
	//glLayersCluster = [];
	glWMSLayerSources = [];
 	layers = [];
 	layerIds = [];
	
	var geojsonFormat = new ol.format.GeoJSON();
	
    window.loadFeatures1 = function(response) {
 	   
 	   
 	 // alert('layer:'+JSON.stringify(response.features[0].properties.layer));
 	  
 	 //alert('Layer:'+JSON.stringify(response.features[0].properties.Layer));
    	var layerName = "";
    	if(typeof response.features[0].properties.layer !== "undefined"){

    		layerName = response.features[0].properties.layer.trim()+"_webview";
    	} else {
    		//alert(JSON.stringify(response.features[0].properties.Layer));
    		layerName = response.features[0].properties.Layer.trim()+"_webview";
    	}

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
						//layer.layerName == 'fields_WGS84' || 
						layer.layerName == 'fields'){
					return true;
				}
					 
				var layerName = layer.layerName+"_webview";
				layerIds.push(layerName.toLowerCase());
				
				$('<div class="layer" style=" margin:15px; border:0px solid #000900;height:150px;width:400px;">').append(
					$('<input type="checkbox">').html(layer.layerName),
					$('<label>').text(layer.layerName),
					$('<input data-layerId="'+layerName.toLowerCase()+'"  type="image" src="images/icons/layer-layer-on.png" >').text('&nbsp;&nbsp;'),
					$('<input data-layerId="'+layerName.toLowerCase()+'"  type="image" src="images/icons/layer-labels-on.png" >').text(' '),
					$('<input data-layerId="'+layerName.toLowerCase()+'"  type="image" src="images/icons/layer-wms-on.png" >').text('&nbsp;&nbsp;'),
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
			             var url = 'http://192.168.1.162:8080/geoserver/cite/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cite:'+layer.geoServerLayerName+'&maxFeatures=600000&outputFormat=text/javascript&format_options=callback:loadFeatures1';
			             // use jsonp: false to prevent jQuery from adding the "callback" parameter to the URL
			             $.ajax({url: url, dataType: 'jsonp', jsonp: false});
			           },
			        strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
			             maxZoom: 19
			        }))
			    });
			    
	       	    var wmsSource =  new ol.layer.Tile({
	       	    	title: 'Global Imagery',
	         	    source: new ol.source.TileWMS({
	         	    url: 'http://192.168.1.162:8080/geoserver/cite/wms?service=WMS',
	         	    params: {LAYERS: 'cite:'+layer.geoServerLayerName, VERSION: '1.1.0'}
	         	          //params: {LAYERS: 'nasa:bluemarble', VERSION: '1.1.1'}
	         	    })
	       	    });
				     
				glLayerSources[layerName.toLowerCase()] = vectorSource_wells;
				glWMSLayerSources[layerName.toLowerCase()] = wmsSource;

				var vector = new ol.layer.Vector({
					source: vectorSource_wells,
				    style: getStyle//getStyle(layer.shapeType, layer.color)
				});
				       
				layers[layerName.toLowerCase()] = vector;
				
				if(layerName.toLowerCase()=="wells_eom_wgs84_webview" ||
						layerName.toLowerCase()== 'fields_wgs84_webview'){
					map.addLayer(wmsSource);
				}else {
				       
					map.addLayer(vector);
				}
						 
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
				if($(this).attr('src')=='images/icons/layer-layer-off.png'){
					$(this).attr('src','images/icons/layer-layer-on.png');
					layers[$(this).attr('data-layerId')].setVisible(true);
					glWMSLayerSources[$(this).attr('data-layerId')].setVisible(true);
					sessionStorage.setItem("visLayer"+$(this).attr('data-layerId'),"1");
				} else if($(this).attr('src')=='images/icons/layer-layer-on.png'){
					$(this).attr('src','images/icons/layer-layer-off.png');
					layers[$(this).attr('data-layerId')].setVisible(false);
					glWMSLayerSources[$(this).attr('data-layerId')].setVisible(false);
					sessionStorage.setItem("visLayer"+$(this).attr('data-layerId'),"0");
				}
				
				if($(this).attr('src')=='images/icons/layer-labels-off.png'){
					$(this).attr('src','images/icons/layer-labels-on.png');
					sessionStorage.setItem("visLabels"+$(this).attr('data-layerId'),"1");
				} else if($(this).attr('src')=='images/icons/layer-labels-on.png'){
					$(this).attr('src','images/icons/layer-labels-off.png');
					sessionStorage.setItem("visLabels"+$(this).attr('data-layerId'),"0");
				}
				
				if($(this).attr('src')=='images/icons/layer-wms-off.png'){
					$(this).attr('src','images/icons/layer-wms-on.png');
					map.addLayer(layers[$(this).attr('data-layerId')]);
					map.removeLayer(glWMSLayerSources[$(this).attr('data-layerId')]);
				} else if($(this).attr('src')=='images/icons/layer-wms-on.png'){
					$(this).attr('src','images/icons/layer-wms-off.png');
					map.removeLayer(layers[$(this).attr('data-layerId')]);
					map.addLayer(glWMSLayerSources[$(this).attr('data-layerId')]);
				}
				
				if($(this).attr('src')=='images/icons/layer-legend-off.png'){
					//alert('removecluser');
					$(this).attr('src','images/icons/layer-legend-on.png');
					map.addLayer(layers[$(this).attr('data-layerId')]);
					map.removeLayer(glLayersCluster[$(this).attr('data-layerId')]);
				} else if($(this).attr('src')=='images/icons/layer-legend-on.png'){
					$(this).attr('src','images/icons/layer-legend-off.png');
					map.removeLayer(layers[$(this).attr('data-layerId')]);
					map.addLayer(glLayersCluster[$(this).attr('data-layerId')]);
				}
			});
					
				//  ctx.stroke();
				  
		}); 
		
		//map.removeLayer(layers["fields_wgs84_webview"]);
		//map.addLayer(glWMSLayerSources["fields_wgs84_webview"]); 
	});
	
	
	 var getStyle = function(feature, resolution){

		// alert(feature.getProperties());
		// alert(feature.getProperties().LookupColour+"]");
		var hexColor = "#"+feature.getProperties().LookupColour;
		var color = ol.color.asArray(hexColor);
		color = color.slice();
		color[3] = 0.2;
		
		var textStroke = new ol.style.Stroke({
		     color: '#fff',
		     width: 3
		   });
		var textFill = new ol.style.Fill({
		    color: '#000'
		});
		
		var textLabel = function(){
	    	var layerName = "";
	    	if(typeof feature.getProperties().layer !== "undefined"){
	    		layerName = feature.getProperties().layer.trim()+"_webview";
	    	} else {
	    		layerName = feature.getProperties().Layer.trim()+"_webview";
	    	}
			 var vis =  sessionStorage.getItem("visLabels"+layerName);
			 if(vis == 1){
				 return feature.get('DisplayName');
			 } else {
				 return '';
			 }
		}();
		
		 
		  
		  // alert('vis '+vis);
		var polygonStyles = [
		     new ol.style.Style({
		    	 fill: new ol.style.Fill({color: color}),
		    	 stroke: new ol.style.Stroke({color: 'black', width: 1}),
		    	 text: new ol.style.Text({
		             font: '12px Calibri,sans-serif',
		             text: textLabel,
		             fill: textFill,
		             stroke: textStroke
		           })
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
		
		//alert(feature.getGeometry().getType());
		
		if(feature.getGeometry().getType()=="Point"){
			return pointStyles;
		} else {
			return polygonStyles;
		}
	}
  
});