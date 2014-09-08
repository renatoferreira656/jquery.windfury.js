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
        
    t.test("test get windfury errors when passing one template", function() {
        $.wf( [ 'template/not-found.html', 'template/not-found2.html' ], function() {
            t.start();
            ok(false);
        }, function(c1, c2) {
            t.start();
            equal('template/not-found.html', c1.url);
            equal('template/not-found2.html', c2.url);
            equal(404, c1.status);
            equal(404, c2.status);
            equal('Not Found', c1.msg);
            equal('Not Found', c2.msg);
        });
        t.stop();
	});
    
    t.test("test get windfury errors", function() {
		$.getWindfury('template/not-found.html', function(c1) {
			t.start();
			ok(false);
		}, function(c1) {
            t.start();
            equal('Not Found', c1.msg);
            $.getWindfury('template/not-found.html', function(c1) {
                t.start();
                ok(false);
            }, function(c1) {
                t.start();
                equal('Not Found', c1.msg);
            });
            t.stop();
        });
		t.stop();
	});

	
})(jQuery, QUnit);