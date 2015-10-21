(function($, t) {

	var code = '';
	code += '<section class="windfury">';
	code += '<section class="text">my text template</section>';
	code += '<section class="dot">my dot template: {{=it}}</section>';
	code += '<script>windfury.def({';
	code += 'read: windfury.read(".text"),';
	code += 'text: windfury.text(".text"),';
	code += 'dot: windfury.doT(".dot")';
	code += '});</script></section>';

	t.module("templateTest");

	t.test('template test', function() {
		var obj = $.windfury(code);
		equal(obj.read, 'my text template');
		equal(obj.text(), 'my text template');
		equal(obj.dot(2), 'my dot template: 2');
	});

})(jQuery, QUnit);