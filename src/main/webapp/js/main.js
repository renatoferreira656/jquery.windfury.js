(function($) {
	
	$(window).ready(function() {
		$.getWindfury('template/main.html', function(main) {
			$('#main').html(main);
		});
	});
	
})(jQuery);