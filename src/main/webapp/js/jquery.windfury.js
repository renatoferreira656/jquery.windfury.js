(function($) {

	function windfury(text, callback) {
	}
	
	function getWindfury(url, data, callback) {
		if(typeof(data) == 'function') {
			callback = data;
			data = null;
		}
		return $.ajax({
			url : url,
			dataType : 'windfury',
			data: data,
			success : callback
		});
	}

	$.windfury = windfury;
	$.getWindfury = getWindfury;

})(jQuery);