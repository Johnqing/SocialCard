define(['jquery'], function($) {
    var defaultConfig = {
        drag: null,
        setArea: false,
        xStart: 0,
        xEnd: 300,
        yStart: 0,
        yEnd: 300,
        callback: function(){}
    }
    /**
     * @class
     * @param  {[Object]} opts 参数
     * @参数说明
     * drag 拖动元素
     * setArea 是否限制区域(true/false),默认false
     * xStart 限制区域横向起始位置
     * xEnd  限制区域横向结束位置
     * yStart 限制区域纵向起始位置
     * yEnd 限制区域纵向结束位置
     * backup 备用参数可配置
     * callback 回调函数
     * @return {[Object]}
     */
    var Drag = function(target, opts){
        this.target = target;
        this.drag = opts.drag;
        this.setArea = opts.setArea;
        this.xStart = opts.xStart;
        this.xEnd = opts.xEnd;
        this.yStart = opts.yStart;
        this.yEnd = opts.yEnd;
        this.backup = opts.backup;
        this.callback = opts.callback;

        this.stopX = false;
        this.stopY = false;

        this.pos = null;//计数器
        this.flag = false;//阀门
        this.oldX = 0;
        this.oldY = 0;

        this.left = 0;
        this.top = 0;

        this.init();
    }
    Drag.prototype = {
        init: function(){
            var self = this;
            self.target.bind('mousedown', function(e){
                self.flag = true;
                /**
                 * 记录鼠标按下位置
                 * @type {[type]}
                 */
                self.pos = self.getMousePos(e);
                self.oldX = self.pos.x - $(this).offset().left;
                self.oldY = self.pos.y - $(this).offset().top;
            });
            $('body').bind('mousemove',  function(e){
                self.move(e);
            });
            $('body').bind('mouseup',  function(){
                self.flag = false;
            });
        },
        move: function(e){
            var self = this;
            //self.stopSlect();
            //阀门
            if(self.flag){
                self.pos = self.getMousePos(e);
                self.areaBlock();
                self.cssRules();
                self.callback.call(this);
            }
        },
        cssRules: function(){
            var self = this,
                left = null,
                top = null;
            if(!self.stopX){
                left = self.pos.x - self.oldX;
            }else{
                left = self.drag.offsetLeft;
            }
            if(!self.stopY){
                top = self.pos.y - self.oldY;
            }else{
                top = self.drag.offsetTop;
            }
            self.top = top;
            self.left = left;
            self.drag.css({
                left: left,
                top: top
            });
        },
        areaBlock: function(){
            var self = this;
            if(self.setArea){
                if((self.pos.x - self.oldX) < self.xStart){
                    self.oldX = self.pos.x - self.xStart;
                }
                if((self.pos.x - self.oldX) > self.xEnd){
                    self.oldX = self.pos.x - self.xEnd;
                }
                if((self.pos.y - self.oldY) < self.yStart){
                    self.oldY = self.pos.y - self.yStart;
                }
                if((self.pos.y - self.oldY) > self.yEnd){
                    self.oldY = self.pos.y - self.yEnd;
                }
                if(self.pos.x < self.xStart
                    || self.pos.x > (self.xEnd + self.drag.offsetWidth)
                    || self.pos.y < self.yStart
                    || (self.yEnd + self.drag.offsetHeight) < self.pos.y){
                    self.flag=false;
                }
            }
        },
        /**
         * 获取坐标位置
         * @param  {[Object]} e
         * @return {[Object]}   x y
         */
        getMousePos: function (e){
            var bdy = $('body')[0];
            if(e.pageX || e.pageY){
                 return {x:e.pageX, y:e.pageY};
            }
            return {
                x:e.clientX + bdy.scrollLeft - bdy.clientLeft,
                y:e.clientY + bdy.scrollTop - bdy.clientTop
            };
        },
        stopSlect: function(){
            var win = window;
            win.getSelection ? win.getSelection().removeAllRanges() : win.document.selection.empty();
        }
    }
    /**
     * 对外接口
     * @return {[type]} [description]
     */
    $.fn.drag = function(opts){
        opts = $.extend({},defaultConfig, opts);
        new Drag($(this), opts);
    };
});
