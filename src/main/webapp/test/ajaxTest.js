(function($, t) {

	t.module("ajaxTest");
	
	t.test("test get windfury", function() {
		$.getWindfury('template/counter1.html', function(c1) {
			t.start();
			equal(0, c1.inc());
			equal(1, c1.inc());
			$.getWindfury('template/counter1.html', function(c2) {
				t.start();
				equal(2, c1.inc());
				equal(0, c2.inc());
				equal(3, c1.inc());
				equal(1, c2.inc());
			});
			t.stop();
		});
		t.stop();
	});

})(jQuery, QUnit);