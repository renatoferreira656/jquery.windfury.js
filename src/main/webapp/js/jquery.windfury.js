(function($) {

	function executeWindfury(text, callback) {
		var doc = $.parseXML(text);
		return parse(doc, callback);
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
			if (ctx.callback) {
				ctx.callback(obj);
			}
		}
	}

	executeWindfury.spec = {};
	executeWindfury.spec.read = wfRead;
	executeWindfury.spec.text = wfText;
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
					if (callback) {
						callback(obj);
					}
				});
			};
			options.success = wfCallback;
			return 'xml';
		}
	});

	function wf(names, callback) {
		if (typeof (names) == 'string') {
			return wf([ names ], callback);
		}
		if (!names || !names.length) {
			return;
		}

		var map = {};
		for (var i = 0; i < names.length; i++) {
			var name = names[i];
			map[name] = wf.loads[name] || {
				name : name,
				loading : true
			};
		}

		function makeCallback(map, callback) {
			if(!callback) {
				return;
			}
			var resps = [];
			for ( var name in map) {
				var entry = map[name];
				resps.push(entry.obj);
			}
			callback.apply(window, resps);
		}

		function setSuccess(entry) {
			return function(obj) {
				entry.obj = obj;
			}
		}

		function setError(entry) {
			return function(error, type, msg) {
				console.info('error', arguments);
				entry.error = {
					error : error,
					type : type,
					msg : msg
				};
			}
		}

		function checkComplete(map) {
			for ( var name in map) {
				var entry = map[name];
				if (entry.loading) {
					return;
				}
			}
			makeCallback(map, callback);
		}

		function setComplete(entry, map) {
			return function() {
				entry.loading = false;
				wf.loads[entry.name] = entry;
				checkComplete(map);
			}
		}

		function process(map) {
			var isLoading = false;
			for ( var name in map) {
				var entry = map[name];
				if (entry.loading) {
					$.ajax({
						url : entry.name,
						dataType : 'windfury',
						success : setSuccess(entry),
						complete : setComplete(entry, map),
						error : setError(entry)
					});
					isLoading = true
				}
			}
			if (!isLoading) {
				makeCallback(map, callback);
			}
		}

		process(map);

	}
	wf.loads = {};

	$.wf = wf;
	$.windfury = executeWindfury;
	$.getWindfury = getWindfury;

})(jQuery);
