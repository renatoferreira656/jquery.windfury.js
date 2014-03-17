(function($, t) {

	t.module("wfTest");

	t.test("wf basic test", function() {
		$.wf.loads = [];
		$.wf('template/counter1.html', function(c1) {
			t.start();
			equal(0, c1.inc());
			equal(1, c1.inc());
			$.wf('template/counter1.html', function(c2) {
				equal(2, c2.inc());
				equal(3, c2.inc());
				equal(4, c1.inc());
				equal(5, c2.inc());
			});
		});
		t.stop();
	});

	t.test("wf twice test", function() {
		$.wf.loads = [];
		var started = false;
		$.wf([ 'template/counter2.html', 'template/counter2.html' ], function(c1, c2) {
			if (!started) {
				started = true;
				t.start();
			}
			equal(c1.inc(), 0);
			equal(c2.inc(), 1);
			equal(c1.inc(), 2);
			equal(c2.inc(), 3);
		});
		$.wf([ 'template/counter2.html', 'template/counter1.html' ], function(c2, c1) {
			if (!started) {
				started = true;
				t.start();
			}
			equal(c2.inc(), 4);
			equal(c1.inc(), 0);
		});
		t.stop();
	});
	
})(jQuery, QUnit);