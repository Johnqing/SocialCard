define(['jquery'], function($){
    var defaultConfig = {
        target: null,
        class: 'select',
        contClass: 'content'
    };
    /**
     *  class: 'select'
     *  contClass: 'content'
     * @param opts
     */
    $.fn.tab = function(opts){
        opts = $.extend({}, defaultConfig, opts);
        var self = $(this),
            target = self.find(opts.target);
        target.bind('click', function(){
            var i = $(this).index();
            console.log(i);
            $(this).addClass(opts.class).siblings('.'+opts.class).removeClass(opts.class);
            self.find('.'+opts.contClass).eq(i).show().siblings('.'+opts.contClass).hide();
        });
    }
});