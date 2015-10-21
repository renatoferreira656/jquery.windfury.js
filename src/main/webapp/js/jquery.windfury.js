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

	function parse(xml, script, success) {
		var scriptCode = readText(script);
		secureEval(scriptCode, xml, success);
	}

	function getTagScript(text){
		var script = text.match(new RegExp('<script\\s*type=".*/javascript">(.*\\s*)*<\/script>', "g"));
		if (!script) {
			throw 'you must write one <script/>';
		}
		script = script[0];
		return script;
	}

function parseWindfury(doc, success) {
		var xml = $.parseHTML(doc);
		xml = $(xml);
		xml = xml.filter('.windfury');
		if (!xml.size()) {
			throw 'root node must be .windfury';
		}

		var script = getTagScript(doc);

		var ret;
		parse(xml, script, function(obj) {
			if (success) {
				success(obj);
			}
			ret = obj;
		});
		return ret;
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

	function getWindfury(url, data, success, error) {
		if (typeof (data) == 'function') {
			error = success;
			success = data;
			data = null;
		}
		return $.ajax({
			url : url,
			dataType : 'text',
			data : data,
			success : function(xml) {
				$.windfury(xml, success);
			},
			error : function(err) {
				if (error) {
					error({
						status : err.status,
						msg : err.statusText,
						responseText : err.resoponseText,
						url : url
					})
				}
			}
		});
	}

	function Load(url) {
		this.url = url;
		this.callbacks = [];
		this.status = 'created';
	}
	Load.prototype.callback = function(callback) {
		this.callbacks.push(callback);
	}

	Load.prototype.dispatch = function() {
		function getResult(load) {
			return function(result) {
				load.result = result;
				load.status = 'loaded';
				load.dispatch();
			}
		}

		function getError(load) {
			return function(error) {
				load.error = true;
				load.result = error;
				load.status = 'loaded';
				load.dispatch();
			}
		}

		if (this.status == 'created') {
			this.status = 'loading';
			$.getWindfury(this.url, getResult(this), getError(this));
		} else if (this.status == 'loading') {
		} else if (this.status == 'loaded') {
			while (this.callbacks.length) {
				this.callbacks.shift()(this);
			}
		} else {
			throw 'unknown status: ' + this.status;
		}
	}

	function requireWindfury(urls, success, error) {
		var loads = requireWindfury.loads;
		var myloads = {};

		function check(myloads) {
			return function(load) {
				myloads[load.url] = 'loaded';
				var results = [];

				for (var i = 0; i < urls.length; i++) {
					var url = urls[i];
					if (myloads[url] != 'loaded') {
						return;
					}

					if (loads[url].error) {
						myloads.__error = true;
					}
					results.push(loads[url].result);
				}

				if (error && myloads.__error && !myloads.__called) {
					myloads.__called = true;
					error.apply(window, results);
					return;
				}

				if (!myloads.__called) {
					myloads.__called = true;
					success.apply(window, results);
				}
			}
		}

		function init() {
			for (var i = 0; i < urls.length; i++) {
				var url = urls[i];
				if (!loads[url]) {
					loads[url] = new Load(url);
				}
				myloads[url] = 'loading';
				loads[url].callback(check(myloads));
			}
		}

		function dispatch() {
			for (var i = 0; i < urls.length; i++) {
				var url = urls[i];
				loads[url].dispatch();
			}
		}

		if (typeof (urls) == 'string') {
			urls = [ urls ];
		}

		if (urls.length == 0) {
			success.apply(window);
		}

		init();
		dispatch();

	}

	function wfReq(ctx) {
		return function(modules, callback) {
			mods = wfReq.autoloads.concat(modules);
			$.wf(mods, function() {
				var loads = $.makeArray(arguments);
				callback.apply(window, [ $, ctx.wf ].concat(loads));
			});
		}
	}

	requireWindfury.autoloads = function(array) {
		wfReq.autoloads = array || [];
	}

	if (!$.doT) {
		$.doT = window.doT;
	}
	function wfDot(ctx) {
		return function(path) {
			var text = ctx.wf.read(path);
			return $.doT.compile(text);
		}
	}

	wfReq.autoloads = [];
	requireWindfury.loads = {};

	parseWindfury.spec = {};
	parseWindfury.spec.req = wfReq;
	parseWindfury.spec.read = wfRead;
	parseWindfury.spec.text = wfText;
	parseWindfury.spec.doT = wfDot;
	parseWindfury.spec.def = wfDef;

	$.windfury = parseWindfury;
	$.getWindfury = getWindfury;
	$.wf = requireWindfury;

})(jQuery);
