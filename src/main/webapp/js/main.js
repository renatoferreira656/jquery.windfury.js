(function($) {
	
	$(window).ready(function() {
//		$.getWindfury('template/main.html', function(main) {
//			console.info('x', main);
//			$('#main').html(main);
//		});
		$.ajax({
			url: 'template/main.html',
			dataType: 'windfury',
			success: function(main) {
				$('#main').html(main);	
			},
			error: function() {
				console.info('error', arguments);
			}
		})
	});
	
})(jQuery);