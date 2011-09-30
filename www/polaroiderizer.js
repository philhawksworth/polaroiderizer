var displayQueue = [];
var qPos = 0;
var timer = null;

// choose the transition effect based .
$.fn.transition = function() {
	var effect = $('#options a.selected').text();
	if(effect == 'polaroids'){
		this.polaroidScroll();
	} else if(effect == 'faders'){
			this.faders();	
	} else if(effect == 'plain'){
		this.plain();	
	}	
	return this;
};

$.fn.polaroidScroll = function() {
	
	$('#display div.plain').remove();
				
	var frame = $('<div class="polaroid"></div>').append(this);
	var photo = $(this).find('img');

	$('#display').append(frame);
		
	// resize the photo to fit the viewport
	if(photo.height() > 400) {
		photo.css({height:photo.height()*0.75, width:photo.width()*0.75});
	}
		
	// set starting point
	var x = 40 + Math.floor(Math.random() * ($('#display').width() - frame.width() - 80));
	var y = frame.height();
	frame.css({top: '-'+y+'px', left: x+'px'});

	// set opacity of photo
	photo.css({opacity: '0'});

	// animate photo opacity and into view.
	frame.animate({top:'15px'}, 400);
	photo.animate({opacity: '1'}, 2000, function(picture){
		// animate slowly out of view and opacity of entire object.
		frame.animate({top:$('#display').height()+'px', opacity:'0'}, 5000, function(){
			frame.remove();
		});	
	});
	return this;				
};

// fading animation effect
$.fn.faders = function() {
	
	$('#display div.plain').remove();
		
	var frame = $('<div class="fader"></div>').append(this);
	var photo = $(this).find('img');

	$('#display').append(frame);
	
	// resize the photo to fit the viewport
	if(photo.height() > 400) {
		photo.css({height:photo.height()*0.75, width:photo.width()*0.75});
	}
	
	var x = ($('#display').width() - frame.width()) /2;
	var y = ($('#display').height() - frame.height()) /2;
	frame.css({top: y+'px', left: x+'px', opacity: '0'});
	frame.animate({opacity: '1'}, 2000, function(pic){
		frame.animate({opacity:'0'}, 3000, function(){
			frame.remove();
		});				
	});
	return this;				
};

// simplest transition effect
$.fn.plain = function() {

	$('#display div.plain').remove();
	var frame = $('<div class="plain"></div>').append(this);
	$('#display').append(frame);
	
	// resize the photo to fit the viewport
	var photo = $(this).find('img');
	if(photo.height() > 400) {
		photo.css({height:photo.height()*0.75, width:photo.width()*0.75});
	}
	
	var x = ($('#display').width() - frame.width()) /2;
	var y = ($('#display').height() - frame.height()) /2;
	frame.css({top: y+'px', left: x+'px'});
	return this;				
};


// Get photos from the flickr API and add them to the display queue.
function getPhotos(tag) {
	var uri = 'http://api.flickr.com/services/rest/?method=flickr.photos.search' +
		'&api_key=0a346a54dbca829015b11fcac9e70c6f' +
		'&tags=' + tag +
		'&per_page=500' +
		'&format=json' +
	    '&jsoncallback=?';
	$.getJSON(uri, function(data){
		$.each(data.photos.photo, function(i,pic){
			$('#status').html('Hoorah! I founds some. Let\'s grab them and make a little slideshow...');
			//clear it out and start again...
			if (timer) {
				clearTimeout(timer);
				timer = null;
			}
			$('<img src="http://farm'+ pic.farm +'.static.flickr.com/'+pic.server+'/'+pic.id+'_'+pic.secret+'.jpg" title="'+ pic.title +'">').
				load(function(){
					var a = $('<a href="http://flickr.com/photos/'+pic.owner+'/'+ pic.id +'" target="_BLANK"></a>').append($(this).clone());					
					displayQueue.push(a);
				}).
				appendTo($('#staging'));
		});
		displayNext();
	});
}

// Iterate throught the images which are downloaded and ready to display.
function displayNext(){
	var i = displayQueue[qPos];
	if(i) {
		$(i).transition();
		var title = $(i).find('img').attr('title');
		var link = $(i).clone().empty().text(title);					
		$('#status').html(link);
	} 
	qPos++;
	if(qPos >= displayQueue.length) {
		qPos = 0;
	}
	timer = setTimeout(function() { displayNext(); }, 3000);				
};

$(document).ready(function() {

	// handle the form submission.
	$('form').submit(function(){
		var tag = $('#tag').val();
		$('#staging').empty();
		displayQueue = [];
		qPos = 0;
		getPhotos(tag);
		$('#status').html('checking flickr for photos tagged '+ tag + '...');
		window.location.hash = '#' + tag;
		return false;
	});
	
	// set the tag in the form if we find a tag in the uri.
	if(window.location.hash) {
		$('#tag').val(window.location.hash.split('#')[1]);
		$('form').submit();
	}

	// Animation option button handlers.
	$('#options a').click(function(){
		var target = $(this);
		if(!target.hasClass('selected')) {
			$('#options a').removeClass('selected');
			target.addClass('selected');
		}
		target.blur();
		return false;
	});
	
	// toggle fullscreen with the f key or a click.	
	$('a.toggleFullscreen').click(function(){
		toggleFullscreen();
	});
	$().keypress(function(e){
		if(!$(e.target).is('#tag')) {
			if(e.which == 102) {
				toggleFullscreen();
			}
		}
	});

});

function toggleFullscreen (argument) {
	var display = $('#display');
	$('h1, form, ul, #footer, span').toggle();
	$('body').toggleClass('kiosk');
	display.toggleClass('kiosk');
	if(display.hasClass('kiosk')) {
		var h = $(window).height() + 'px';
		display.height(h);		
	} else {
		display.height('500px');				
	}
}
