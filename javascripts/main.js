(function($) {

	$(window).ready(function() {
		$.getWindfury('page/home.html', function(main) {
			$('#content').html(main);
		});
	});

})(jQuery);