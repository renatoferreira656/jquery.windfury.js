(function($, t) {

	t.module("wfTest");

	t.test("wf test", function() {
		$.wf([ 'template/counter.html' ], function(c1) {
			t.start();
			equal(0, c1.inc());
			equal(1, c1.inc());
			$.wf([ 'template/counter.html' ], function(c2) {
				equal(2, c2.inc());
				equal(3, c2.inc());
				equal(4, c1.inc());
				equal(5, c2.inc());
			});
		});
		t.stop();
	});

})(jQuery, QUnit);