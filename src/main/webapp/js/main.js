(function($) {
	
	$.wf.autoloads([ 'comp/base.html' ]);
    
    $(window).bind('hashchange', function() {
        var hash = $.trim(this.location.hash || '#');
        if (!hash || hash == '#') {
            this.location = '#Main';
            return;
        }
        hash = hash.substring(1).split('?')[0];
        $.wf([ 'page/' + hash + '.html' ], function(face) {
            face.open();
        });
    })

    $(window).trigger('hashchange');
    
})(jQuery)
