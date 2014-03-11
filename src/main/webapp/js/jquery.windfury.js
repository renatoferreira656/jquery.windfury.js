(function($) {

	function windfury(text) {
		return function() {
			return text;
		}
	}
	
	$.windfury = windfury;
	
})(jQuery);