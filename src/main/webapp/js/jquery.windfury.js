(function($) {

	function executeWindfury(text, callback) {
	}

	function getWindfury(url, data, callback) {
		if (typeof (data) == 'function') {
			callback = data;
			data = null;
		}
		return $.ajax({
			url : url,
			dataType : 'windfury',
			data : data,
			success : callback
		});
	}

	function readText(element) {
		var ret = [];
		$.each($(element).contents(), function(idx, child) {
			ret.push(readChildrenText(child));
		});
		return ret.join('');
	}

	function readChildrenText(element) {
		var ret = [];
		if (element.nodeType == 1) {
			// It is element
			ret.push('<', element.nodeName);
			var attrs = element.attributes;
			for ( var i = 0; i < attrs.length; i++) {
				var attr = attrs.item(i);
				ret.push(' ', attr.name, '="', attr.value, '"');
			}
			ret.push(">");
			ret.push(readText(element));
			ret.push("</", element.nodeName, ">");
		} else if (element.nodeType == 3 || element.nodeType == 4) {
			// It is text or cdata
			ret.push(element.data);
		}
		return ret.join('');
	}

	function parse(xml, callback) {
		xml = $(xml).children();
		if (!xml.is('.windfury')) {
			throw 'root node must be .windfury';
		}
		var scripts = xml.children('script');
		if (scripts.length != 1) {
			throw 'you must write one <script/>';
		}
		var scriptCode = readText(scripts);
		secureEval(scriptCode, xml, callback);
	}

	function secureEval(code, xml, callback) {
		var windfury = {};
		for ( var i in executeWindfury.spec) {
			var spec = executeWindfury.spec[i];
			windfury[i] = spec({
				wf : windfury,
				xml : xml,
				callback : callback
			});
		}

		eval(code);
	}

	function wfText(ctx) {
		return function(path) {
			return $.trim(readText(ctx.xml.children('section').filter(path)));
		}
	}

	function wfTemplate(ctx) {
		return function(path) {
			var code = ctx.wf.text(path);
			return function() {
				return code;
			};
		}
	}

	function wfDef(ctx) {
		return function(obj) {
			ctx.callback(obj);
		}
	}

	executeWindfury.spec = {};
	executeWindfury.spec.text = wfText;
	executeWindfury.spec.template = wfTemplate;
	executeWindfury.spec.def = wfDef;

	$.ajaxSetup({
		converters : {
			'xml windfury' : true
		}
	});

	$.ajaxPrefilter(function(options, originalOpts, jqXHR) {
		var dataType = originalOpts.dataType;
		if (dataType && dataType === 'windfury') {
			var callback = options.success;
			var wfCallback = function(doc) {
				parse(doc, function(obj) {
					callback(obj);
				});
			};
			options.success = wfCallback;
			return 'xml';
		}
	});

	$.windfury = executeWindfury;
	$.getWindfury = getWindfury;

})(jQuery);
