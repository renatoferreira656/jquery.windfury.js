(function($, t) {


	t.module("templateTest");

	t.test('template test', function() {
		var code = "<section class='windfury'> \
			<section class='text'>my text template</section> \
			<section class='dot'>my dot template: {{=it}}</section> \
			<script type='application/javascript'> \
				windfury.def({ \
					read: windfury.read('.text'), \
					text: windfury.text('.text'), \
					dot: windfury.doT('.dot') \
				}); \
			</script> \
		</section>";

		var obj = $.windfury(code);
		equal(obj.read, 'my text template');
		equal(obj.text(), 'my text template');
		equal(obj.dot(2), 'my dot template: 2');
	});

	t.test('template test with non xml attributes', function() {
		var code = "<section class='windfury'> \
			<section class='dot'>my dot template: {{=it}}</section> \
			<script type='text/javascript'> \
				function text(){ \
					var template = windfury.doT('.dot'); \
					return template('&'); \
				} \
				windfury.def({ \
					dot: text \
				}); \
			</script> \
		</section>";

		var obj = $.windfury(code);
		equal(obj.dot(), 'my dot template: &');
	});

	t.test('template test with dumb type', function() {
		var code = "<section class='windfury'> \
			<section class='dot'>my dot template: {{=it}}</section> \
			<script language='bla'> \
				function text(){ \
					var template = windfury.doT('.dot'); \
					return template('&'); \
				} \
				windfury.def({ \
					dot: text \
				}); \
			</script> \
		</section>";

		var obj = $.windfury(code);
		equal(obj.dot(), 'my dot template: &');
	});

	t.test('template test case insensitive', function() {
		var code = "<section class='windfury'> \
			<section class='dot'>my dot template: {{=it}}</section> \
			<SCrIPT language='bla'> \
				function text(){ \
					var template = windfury.doT('.dot'); \
					return template('&'); \
				} \
				windfury.def({ \
					dot: text \
				}); \
			</SCRIPT> \
		</section>";

		var obj = $.windfury(code);
		equal(obj.dot(), 'my dot template: &');
	});

})(jQuery, QUnit);
