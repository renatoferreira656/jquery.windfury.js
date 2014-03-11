(function($) {
	
	$(window).ready(function() {
		$.getWindfury('template/main.html', function(main) {
			console.info('x', main);
			$('#main').html(main);
		});
	});
	
})(jQuery);