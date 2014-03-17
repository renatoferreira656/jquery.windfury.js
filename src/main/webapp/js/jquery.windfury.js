(function($) {

	function readChildrenText(element) {
		var ret = [];
		if (element.nodeType == 1) {
			// It is element
			ret.push('<', element.nodeName);
			var attrs = element.attributes;
			for (var i = 0; i < attrs.length; i++) {
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

	function readText(element) {
		var ret = [];
		$.each($(element).contents(), function(idx, child) {
			ret.push(readChildrenText(child));
		});
		return ret.join('');
	}

	function secureEval(code, xml, success) {
		var windfury = {};
		for ( var i in parseWindfury.spec) {
			var spec = parseWindfury.spec[i];
			windfury[i] = spec({
				wf : windfury,
				xml : xml,
				success : success
			});
		}

		eval(code);
	}

	function parse(xml, success) {
		xml = $(xml).children();
		if (!xml.is('.windfury')) {
			throw 'root node must be .windfury';
		}
		var scripts = xml.children('script');
		if (scripts.length != 1) {
			throw 'you must write one <script/>';
		}
		var scriptCode = readText(scripts);
		secureEval(scriptCode, xml, success);
	}

	function parseWindfury(doc, success) {
		if (typeof (doc) == 'string') {
			doc = $.parseXML(doc);
		}
		parse(doc, success);
	}
	
	function wfRead(ctx) {
		return function(path) {
			return $.trim(readText(ctx.xml.children('section').filter(path)));
		}
	}

	function wfText(ctx) {
		return function(path) {
			var code = ctx.wf.read(path);
			return function() {
				return code;
			};
		}
	}

	function wfDef(ctx) {
		return function(obj) {
			if (ctx.success) {
				ctx.success(obj);
			}
		}
	}
	
	function getWindfury(url, data, success) {
		if (typeof (data) == 'function') {
			success = data;
			data = null;
		}
		return $.ajax({
			url : url,
			dataType : 'xml',
			data : data,
			success : function(xml) {
				$.windfury(xml, success);
			}
		});
	}

	parseWindfury.spec = {};
	parseWindfury.spec.read = wfRead;
	parseWindfury.spec.text = wfText;
	parseWindfury.spec.def = wfDef;
	
	$.windfury = parseWindfury;
	$.getWindfury = getWindfury;

})(jQuery);
