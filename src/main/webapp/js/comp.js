define([ 'jquery!', 'js/ext/doT' ], function($, doT) {

	$.fn.dot = function() {
		var template = $(this).html();
		return doT.compile(template);
	}

	function secureCall(script, template, def) {
		function execute(func) {
			func($, template, def);
		}
		eval(script);
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
	
	return {
		load : function(name, req, onload, config) {
			
			function trimmed(f) {
				return function() {
					var ret = f.apply(this, arguments);
					if(typeof(ret) == 'string') {
						ret = $.trim(ret);
					}
					return ret;
				}
			}
			
			function template(xml, compileds) {
				return function(path) {
					var ret = compileds[path];
					if (!ret) {
						var code = readText(xml.children('section').filter(path) );
						code = $.trim(code);
						ret = doT.compile(code);
						ret = trimmed(ret);
						compileds[path] = ret;
					}
					return ret;
				}
			}

			function parse(text) {
				var xml = $.parseXML(text);
				xml = $(xml).children();
				if (!xml.is('.poly')) {
					throw 'root node must be .poly: ' + name;
				}
				var scripts = xml.children('script');
				if (scripts.length != 1) {
					throw 'you must write one <script/>: ' + name;
				}
				var scriptCode = readText(scripts);
				secureCall(scriptCode, template(xml, {}), function(obj) {
					onload(obj);
				});
			}

			$.ajax({
			    url : name + '.html',
			    dataType : 'text',
			    success : function(text) {
				    parse(text);
			    }
			});
		}
	}
});