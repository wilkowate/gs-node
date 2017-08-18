mapLayers = new Map();

$( document ).ready(function() {

	glLayerSources = [];
	//glLayersCluster = [];
	glWMSLayerSources = [];
 	vectorLayers = [];
 	layerIds = [];
	
	var geojsonFormat = new ol.format.GeoJSON();
	
    window.loadFeatures1 = function(response) {
    	var layerName = "";
    	if(typeof response.features[0].properties.layer !== "undefined"){
    		layerName = response.features[0].properties.layer.trim()+"_webview";
    	} else {
    		layerName = response.features[0].properties.Layer.trim()+"_webview";
    	}
    	//alert('layerName'+layerName);
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
				
				
				mapLayers.set(layerName.toLowerCase(), layer);
				
				var imgVisible = "images/icons/layer-layer-on.png";
				sessionStorage.setItem("visLayer"+layerName.toLowerCase(),"1");
				if(!layer.webVisible){
					imgVisible = "images/icons/layer-layer-off.png";
					sessionStorage.setItem("visLayer"+layerName.toLowerCase(),"0");
				}
				
				var imgLabelsVisible = "images/icons/layer-labels-on.png";
				sessionStorage.setItem("visLabels"+layerName.toLowerCase(),"1");
				if(!layer.labelsVisible){
					sessionStorage.setItem("visLabels"+layerName.toLowerCase(),"0");
					imgLabelsVisible = "images/icons/layer-labels-off.png";
				}
								
				$('<div class="layer" style=" margin:5px; border:0px solid #000900;">').append(
					$('<input data-layerId="'+layerName.toLowerCase()+'" type="checkbox">').html(layer.layerName),
					'&nbsp;&nbsp;&nbsp;',
					$('<label>').text(layer.layerName),'<br />',
					$('<input data-layerId="'+layerName.toLowerCase()+'"  type="image" src="'+imgVisible+'" >').text('&nbsp;&nbsp;'),
					'&nbsp;&nbsp;&nbsp;',
					$('<input data-layerId="'+layerName.toLowerCase()+'"  type="image" src="'+imgLabelsVisible+'" >').text(' '),
					'&nbsp;&nbsp;&nbsp;',
					$('<input data-layerId="'+layerName.toLowerCase()+'"  type="image" src="images/icons/layer-wms-on.png" >').text('&nbsp;&nbsp;'),
					'&nbsp;&nbsp;&nbsp;',
					$('<input  type="image" src="images/icons/layer-legend-on.png" >').text('  '),
					$('<p><canvas class="layerCanvas'+i+'" style="width:150px;height:65px; padding:0px; border:0px;"></p>')
			    	    // add a cell to the row with the todo title
			    	    // and another cell with the due date
				).appendTo('#layersDiv');
						    	  
			    var vectorSource_wells = new ol.source.Vector({
			    	loader: function(extent, resolution, projection) {
			             var url = 'http://192.168.1.162:8080/geoserver/cite/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cite:'+layer.geoServerLayerName+'&maxFeatures=60&outputFormat=text/javascript&format_options=callback:loadFeatures1';
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
				       
				vectorLayers[layerName.toLowerCase()] = vector;
				
				//if(layer.webVisible){
					//alert(layer.wmsVisibilityZoomLevel);
					if(layer.wmsVisibilityZoomLevel > 0){
						map.addLayer(wmsSource);
						sessionStorage.setItem("layerType"+layerName.toLowerCase(),"wms");
					} else {
						map.addLayer(vector);
						sessionStorage.setItem("layerType"+layerName.toLowerCase(),"vector");
					}
				//}
					 
				var ctx = $(".layerCanvas"+i)[0].getContext("2d");
				//ctx.moveTo(50,50);
				ctx.fillStyle = "#"+layer.color;
				ctx.fillRect(6,6,90,50);
				ctx.strokeStyle = "#000000";
				ctx.lineWidth=1;
				ctx.strokeRect(5,5,92,52);

				//ctx.fillRect(0,60,90,50);
			});

			$( ".layer" ).find( 'input' ).click(function() {
				
				if($(this).attr('type')=='checkbox'){
					//alert($(this).attr('checked'));
					sessionStorage.setItem("selectedLayer"+$(this).attr('data-layerId'),"1");
				} 
				
				if($(this).attr('src')=='images/icons/layer-layer-off.png'){
					$(this).attr('src','images/icons/layer-layer-on.png');
					vectorLayers[$(this).attr('data-layerId')].setVisible(true);
					glWMSLayerSources[$(this).attr('data-layerId')].setVisible(true);
					sessionStorage.setItem("visLayer"+$(this).attr('data-layerId'),"1");
				} else if($(this).attr('src')=='images/icons/layer-layer-on.png'){
					$(this).attr('src','images/icons/layer-layer-off.png');
					vectorLayers[$(this).attr('data-layerId')].setVisible(false);
					glWMSLayerSources[$(this).attr('data-layerId')].setVisible(false);
					sessionStorage.setItem("visLayer"+$(this).attr('data-layerId'),"0");
				}
				
				if($(this).attr('src')=='images/icons/layer-labels-off.png'){
					$(this).attr('src','images/icons/layer-labels-on.png');
					sessionStorage.setItem("visLabels"+$(this).attr('data-layerId'),"1");
					vectorLayers[$(this).attr('data-layerId')].changed();
					
					
				} else if($(this).attr('src')=='images/icons/layer-labels-on.png'){
					$(this).attr('src','images/icons/layer-labels-off.png');
					sessionStorage.setItem("visLabels"+$(this).attr('data-layerId'),"0");
					vectorLayers[$(this).attr('data-layerId')].changed();
				}
				
				if($(this).attr('src')=='images/icons/layer-wms-off.png'){
					$(this).attr('src','images/icons/layer-wms-on.png');
					map.addLayer(vectorLayers[$(this).attr('data-layerId')]);
					map.removeLayer(glWMSLayerSources[$(this).attr('data-layerId')]);
				} else if($(this).attr('src')=='images/icons/layer-wms-on.png'){
					$(this).attr('src','images/icons/layer-wms-off.png');
					map.removeLayer(vectorLayers[$(this).attr('data-layerId')]);
					map.addLayer(glWMSLayerSources[$(this).attr('data-layerId')]);
				}
				
				if($(this).attr('src')=='images/icons/layer-legend-off.png'){
					//alert('removecluser');
					$(this).attr('src','images/icons/layer-legend-on.png');
					map.addLayer(vectorLayers[$(this).attr('data-layerId')]);
					//map.removeLayer(glLayersCluster[$(this).attr('data-layerId')]);
				} else if($(this).attr('src')=='images/icons/layer-legend-on.png'){
					$(this).attr('src','images/icons/layer-legend-off.png');
					map.removeLayer(vectorLayers[$(this).attr('data-layerId')]);
					//map.addLayer(glLayersCluster[$(this).attr('data-layerId')]);
				}
			});
		}); 
		
		//map.removeLayer(vectorLayers["fields_wgs84_webview"]);
		//map.addLayer(glWMSLayerSources["fields_wgs84_webview"]); 
	});
	////////////////////////////////////// end loading layers //////////////////////////////////////
	
	
	
	var getStyle = function(feature, resolution){
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