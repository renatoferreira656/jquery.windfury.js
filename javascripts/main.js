(function($) {

	$(window).ready(function() {
		$.getWindfury('page/main.html', function(main) {
			$('#content').html(main);
		});
	});

})(jQuery);