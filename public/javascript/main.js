	 	var vis = function(id){
			alert( "H) called."+id);
			layers[id].setVisible(false);
		}
	 	
	 	layers = [];
	 	
	 	
/**
 * http://usejsdoc.org/
 */
 $( document ).ready(function() {
	 
	 $('#left_top_panel').resizable({
		  handles: 'n, e, s, w, ne, se, sw, nw',
		  alsoResizeReverse: '#right_top_panel'
		});

		$('#left_bottom_panel').resizable({
		  handles: 'e',
		  alsoResizeReverse: '#right_bottom_panel'
		});
		
	 sessionStorage.setItem('selecteCatId',617);
	 
     var oTable = $('#docs').dataTable( {
         "bProcessing": true,
         "sAjaxSource": "/documents/search",
         "bServerSide": true,
         "aoColumns": [
             { "mData": "name" },
             { "mData": "id" }

         ]
     } );

	$(function() {
		 var parameters = { search: $(this).val(), id:1 };
		 $.get( '/layers/loadActiveLayers',parameters, function(data) {
			 $.each(data.layers, function(i, layer) {
				 
				 //PROCESS EACH LAYER
				 
				 if(layer.layerName == 'imagesDB'){
					 return true;
				 }
				 
				 $('<div class="layer" style=" margin:15px; border:0px solid #000900;height:150px;width:400px;">').append(
						 $('<input type="checkbox">').html(layer.layerName),
						 $('<label>').text(layer.layerName),
						 $('<input onclick = vis("'+layer.layerName+'"); data-layer_id="'+layer.layerName+'"  type="image" src="images/icons/layer-layer-on.png" >').text('&nbsp;&nbsp;'),
						 $('<input data-layer_id="'+layer.layerName+'"  type="image" src="images/icons/layer-labels-on.png" >').text(' '),
						 $('<input data-layer_id="'+layer.layerName+'"  type="image" src="images/icons/layer-wms-on.png" >').text('&nbsp;&nbsp;'),

						 $('<input  type="image" src="images/icons/layer-legend-on.png" >').text('  '),
						 $('<canvas class="layerCanvas'+i+'" style="width="100px";height=100px; margin:5px; border:1px solid #000900;">')
		    	        // add a cell to the row with the todo title
		    	        // and another cell with the due date
	    	      ).appendTo('#layersDiv');
				 
				 //var canvas = document.getElementsByTagName('canvas')[0];
				 //canvas.width  = 300;
				 //canvas.height = 100;
		    	  
			     var vectorSource = new ol.source.Vector({
			         url: 'https://openlayers.org/en/v4.2.0/examples/data/geojson/countries.geojson',
			         format: new ol.format.GeoJSON()
			       });
			     
			     
			     var hexColor = "#"+layer.color;
			     var color = ol.color.asArray(hexColor);
			     color = color.slice();
			     color[3] = 0.2;
			     
			       var vector = new ol.layer.Vector({
			         source: vectorSource,
			         style: new ol.style.Style({
			           stroke: new ol.style.Stroke({
			             color: "#"+layer.color,
			             width: 20-i*2
			           }),
			         fill : new ol.style.Fill(
			                 {
			                   color : color
			                 })
			         })
			       });
			       
			       layers[layer.layerName] = vector;
			       
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
					  alert( "Handler for .click() called."+$(this).attr('data-layer_id') );
					  $(this).attr('src','images/icons/layer-legend-off.png');
					  
					  
					});
				
			//  ctx.stroke();
			  
		   });   
	});
	 
	 
     $("#categories_table tbody").on("mousedown", "tr", function() {

    	 $(".selected").not(this).removeClass("selected");
    	 $(this).toggleClass("selected");
    });
     
     $("#categories_table").on("onNodeExpand", function(){
    	 alert('d');
         var node = this;
         var rowobject = node.row;
         // do some stuff with the row or ...
     }
    );

	 
 });
