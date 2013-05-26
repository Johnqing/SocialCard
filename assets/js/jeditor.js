/**
 * js editor
 * User: jonery
 * Date: 13-5-26
 * Time: 下午10:50
 * To change this template use File | Settings | File Templates.
 */
define(['jquery'], function($){
    var defaultConfig = {
        defaultIframeContent: '',
        ifWidth: 300,
        ifHeight: 400,
        menuObj: null,
        menu:[
            {'type':'bold','name':'B'},
            {'type':'italic','name':'I'},
            {'type':'underline','name':'U'},
            {'type':'justifycenter','name':'C'},
            {'type':'justifyleft','name':'L'},
            {'type':'justifyright','name':'R'},
            {'type':'outdent','name':'outdent'},
            {'type':'indent','name':'indent'},
            {'type':'insertunorderedlist','name':'ul'},
            {'type':'insertorderedlist','name':'ol'},
            {'type':'createlink','name':'link'},
            {'type':'insertimage','name':'img'},
            {'type':'html','name':'HTML'},
            {'type':'fontFamily','name':'fontFamily'},
            {'type':'fontSize','name':'fontSize'},
            {'type':'fontColor','name':'fontColor'}
        ],
        callback: function(){}
    };
    var Editor = function(target, opts){
        this.target = target;
        this.defaultIframeContent = opts.defaultIframeContent;
        this.ifWidth = opts.ifWidth;
        this.ifHeight = opts.ifHeight;
        this.menuObj = opts.menuObj;
        this.menu = opts.menu;
        this.callback = opts.callback;

        this.switchEditMode = true;

        this.init();
    }
    Editor.prototype = {
        init: function(){
            this.target.hide();
            this.createIframe();
            this.createMenu();
            this.bindEvent();
            this.callback.call(this);
        },
        createIframe: function(){
            var self = this;
            self.iframe = document.createElement("iframe");
            self.iframe.width = self.ifWidth;
            self.iframe.height = self.ifHeight;
            self.iframe.frameBorder = 0;
            self.target.before(self.iframe);
            self.iframeDocument = self.iframe.contentDocument || self.iframe.contentWindow.document;
            self.iframeDocument.designMode = "on";
            self.iframeDocument.open();
            var html = '<html><head><style type="text/css">body{ font-family:arial; font-size:13px;background:#f1f1f1 }</style>' +
                            '</head><body>'+self.defaultIframeContent+'</body></html>';
            self.iframeDocument.write(html);
            self.iframeDocument.close();
        },
        /**
         * 功能区
         */
        createMenu: function(){
            var newArr = [],
                self = this,
                len = self.menu.length,
                i = 0;
            for(; i < len; i++){
                newArr.push('<sub data-type="'+self.menu[i]['type']+'" class="nsEditor'+self.menu[i]['type']+'">'+self.menu[i]['name']+'</sub>');
            }
            self.menuObj.html(newArr.join(''));
        },
        /**
         * 事件绑定
         */
        bindEvent: function(){
            var self = this;
            self.menuObj.delegate('sub','click', function(){
                self.changeStyle($(this).attr('data-type'));
            });
        },
        /**
         * 给当前文档或者选中内容添加样式
         * @param command
         */
        changeStyle: function(command){
            var self = this;
            switch(command){
                case 'createlink':
                case 'image':
                    var value = prompt('请输入超链接:', 'http://');
                    self.iframeDocument.execCommand(command, false, value);
                    break;
                case "html"://查看源码
                    if(self.switchEditMode){//切换到textarea
                        self.cssRules(self.iframe, 'none');
                        self.cssRules(self.target, 'block');
                        self.target.val(self.iframeDocument.body.innerHTML);
                        self.target.focus();
                        self.switchEditMode = false;
                    }else{//切换到iframe
                        self.cssRules(self.iframe, 'block');
                        self.cssRules(self.target, 'none');
                        self.iframeDocument.body.innerHTML = self.target.val();
                        self.iframe.contentWindow.focus();
                        self.switchEditMode = true;
                    }
                    break;
                default:
                    self.iframeDocument.execCommand(command, false, '');
                    self.iframe.contentWindow.focus();
            }
        },
        cssRules: function(el, val){
            if(val === "none"){
                el.hide();
                return;
            }
            el.show();
        },
        /**
         * 简单的事件代理实现
         * @param e
         * @param tagName
         * @returns {*|Object}
         */
        proxy: function(e, tagName){
           // e = e || window.event;
            var oTarget = e.target || e.srcElement;
            oTarget.parentNode.tagName.toUpperCase() === tagName && (oTarget = oTarget.parentNode);
            return oTarget;
        }
    };
    $.fn.editor = function(opts){
        opts = $.extend(defaultConfig, opts);
        new Editor($(this), opts);
    }
});