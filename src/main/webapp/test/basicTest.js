(function($, t) {

	t.module("basicTest");

	var codeSyncCounter = '<section class="windfury"><script type="text/javascript">';
	codeSyncCounter += 'var i = 0; windfury.def({inc: function() {return i++;}});';
	codeSyncCounter += '</script></section>';

	var codeAsyncCounter = '<section class="windfury"><script type="text/javascript">(function(wf) {';
	codeAsyncCounter += 'var i = 0; setTimeout(function() {';
	codeAsyncCounter += 'windfury.def({inc: function() {return i++;}}) }';
	codeAsyncCounter += ', 1);';
	codeAsyncCounter += '})(windfury)</script></section>';

	t.test("$.windfury errors test", function() {
		t.throws(function() {
			$.windfury();
		}, 'root node must be .windfury', 'root node must be .windfury');
		t.throws(function() {
			$.windfury('');
		}, 'root node must be .windfury', 'root node must be .windfury');
		t.throws(function() {
			$.windfury(null);
		}, 'root node must be .windfury', 'root node must be .windfury');
		t.throws(function() {
			$.windfury('<section class="other"><script type="text/javascript"></script></section>');
		}, 'root node must be .windfury', 'root node must be .windfury');
		t.throws(function() {
			$.windfury('<section class="windfury"></section>');
		}, 'you must write one <script/>', 'you must write one <script/>');
		t.throws(function() {
			$.windfury('<section class="windfury"></section>');
		}, 'you must write one <script/>', 'you must write one <script/>');
		t.throws(function() {
			$.windfury('<section class="windfury"><script type="text/javascript">throw "myerror";</script></section>');
		}, 'myerror', 'myerror');
	});

	t.test("$.windfury return test", function() {
		var sync = null;
		var ret = $.windfury(codeSyncCounter, function(counter) {
			sync = counter;
		});
		equal(ret, sync, 'sync parser should return the result');
		var async = null;
		var ret = $.windfury(codeAsyncCounter, function(counter) {
			async = counter;
		});
		ok(!async, 'async parser will not return the result');
	});

	t.test("$.windfury success sync test", function() {
		$.windfury(codeSyncCounter, function(c1) {
			$.windfury(codeSyncCounter, function(c2) {
				equal(0, c1.inc());
				equal(1, c1.inc());
				equal(0, c2.inc());
				equal(1, c2.inc());
				equal(2, c1.inc());
			});
		});
	});

	t.test("$.windfury success async test", function() {
		$.windfury(codeAsyncCounter, function(c1) {
			t.start();
			equal(0, c1.inc());
			$.windfury(codeAsyncCounter, function(c2) {
				t.start();
				equal(1, c1.inc());
				equal(2, c1.inc());
				equal(0, c2.inc());
				equal(1, c2.inc());
				equal(3, c1.inc());
			});
			t.stop();
		});
		t.stop();
	});

})(jQuery, QUnit);