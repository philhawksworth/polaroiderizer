var poldzr = {};			// let's not clutter the global namespace.
poldzr.effect = "sprinkle";	// animation effect: sprinkle | simple | crossfade | none 
poldzr.requestQueue = [];	// image uris that we need to request.
poldzr.readyQueue = [];		// image uris which have been preloaded.


poldzr.init = function() {
	poldzr.events();
	// poldzr.getPhotos();
	
	// for offline dev and testing:
	poldzr.requestQueue.push("dummy/1.jpg");
	poldzr.requestQueue.push("dummy/2.jpg");
	poldzr.showPhoto();	
	//
};


poldzr.events = function() {
	
	// $("div.photo").live("click", function() {
	// 	if($(this).hasClass("displayed")){
	// 		$(this).removeClass("displayed").addClass("focus");
	// 	} else if ($(this).hasClass("focus")) {
	// 		$(this).removeClass("focus").addClass("displayed");
	// 	} else {
	// 		$(this).addClass("displayed");			
	// 	}
	// 	return false;
	// });
	

	// tidy up after the transition has completed.
	$("div.photo").live('webkitTransitionEnd', function(event){
		
		var photo = $(event.originalEvent.srcElement);

		if(photo.hasClass("animating")){
			photo.removeClass("animating");
		}

		if(event.originalEvent.propertyName == 'top') {
			poldzr.showPhoto();
			// poldzr.requestQueue.push($(event.target).find("img").attr("src")); // add the image back into the queue so we can go around again.
			$(event.target).remove(); // remove it from the DOM.
		}
	});
	
	
	// toggle fullscreen with the f key or a click.
	$("a#toggleFullscreen").click(function() {
		poldzr.toggleFullscreen();
	});
	$('body').keypress(function(ev){
		if(!$(ev.target).is('#tag')) {
			var keyCode = ev.keyCode || ev.which;
			if(keyCode == 102) {
				poldzr.toggleFullscreen();
			}
		}
	});
};



poldzr.getPhotos = function() {
	var yql = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20flickr.photos.interestingness(50)&format=json&?";
	$.getJSON(yql, function(json){
		$(json.query.results.photo).each(function(index) {
			poldzr.requestQueue.push("http://farm"+ this.farm +".static.flickr.com/"+this.server+"/"+ this.id+"_"+this.secret+".jpg");
		});
		poldzr.showPhoto();
	});
};


// get the next photo from the queue and display it after ensuring that it is completely loaded.
poldzr.showPhoto = function() {
	
	// a random place on the x axis to start the diaplay.
	var x = 40 + Math.floor(Math.random() * ($('#display').width() - 210 - 80));
	
	var src = poldzr.requestQueue.shift();
	var img = new Image();	
	$(img).attr("src", src).load(function() {
		$("<div class='photo thumb'><a href='#'><img src='"+ src +"'></a></div>").appendTo("#display").css({left: x, display:"none"}).fadeIn(1000, function(ev){
			$(this).addClass("displayed", "animating");
		});
	});
	
};


// preload n images from flickr so that they are ready for a speed display.
poldzr.preloadImages = function(n, callback) {

	var src = poldzr.requestQueue.shift();
	var img = new Image();
	$(img).attr("src", src).load(function() {
		poldzr.readyQueue.push(src);
	});
	
	// preload another image or execute the callback if there is one.
	if (n) {
		n--;
		poldzr.preloadImages(n, callback);
	} else if (callback){
		callback();		
	} else {
		return false;
	}
};



poldzr.toggleFullscreen = function() {
	$('header, span, ul, footer').toggle();
	$('body').toggleClass('kiosk');
	if($('body').hasClass('kiosk')) {
		poldzr.fillScreen();
	} else {
		$('#display').height('500px');				
	}
};


poldzr.fillScreen = function() {
	var h = $(window).height() + 'px';
	$('#display').height(h);
};




// establish which animation effect to use according to the user preference.
poldzr.setEffect = function() {
	var effect = $("#effects a.active").text();
	$("#display").removeClass().addClass(effect);
};


// Giddy up.
$(document).ready(function(){
	poldzr.init();		
});	
