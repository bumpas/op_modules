$('.js-play').on("click", function(e) {
  var element = $(this);
  var vidId = $(element).data("vid-src");
  var youtube = '<div class="dialog__video"><iframe src="//www.youtube.com/embed/'+ vidId +'?autoplay=1&showinfo=0&modestbranding=1&rel=0&autohide=1" frameborder="0" allowfullscreen></iframe></div>';
  e.preventDefault();
  $(youtube).dialog({
  	dialogClass: 'dialog dialog--video',
  	width: '75%',
		resizable: false,
		draggable: false,
		modal: true,
		show: {
			effect: 'fadeIn',
			duration: 300
		},
		hide: {
			effect: 'fadeOut',
			duration: 300
	},
	open: function(event, ui) {
		// Close dialog when outside is clicked
		$('.ui-widget-overlay').bind('click', function(){
			$('.dialog__video').dialog('close');
		});
	},
	close: function () {
		// necessary as it stops the video when the dialog is closed
		$('.dialog__video').dialog('destroy');
		$('.ui-dialog-content').remove('iframe');
	}
  });
});