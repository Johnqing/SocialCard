/**
 * 配置文件
 */
require.config({
    baseUrl: '/js',
    paths: {
        jquery: 'jquery'
    }
});
/**
 * 主体
 */
require(['jquery','ctlchange','jeditor','drag','controller'], function($,ntpl){
    var layout = $('[data-type="layout"]'),
        controller = $('[data-type="controller"]');
    /**
     * 结构层
     */
    layout.drag({
        setArea: true,
        xEnd: $('body').width() - layout.innerWidth(),
        yStart : 32,
        yEnd:  $('body').height() - layout.innerHeight(),
        drag: layout,
        callback: function(){
            $.post("/layoutPage", {left: this.left,top: this.top});
        }
    });
    /**
     * 控制面板
     */
    controller.find('#controller-drag').drag({
        setArea: true,
        xEnd: $('body').width() - layout.innerWidth(),
        yStart : 32,
        yEnd:  $('body').height() - layout.innerHeight(),
        drag: controller,
        callback: function(){
            $.post("/controller", {left: this.left,top: this.top});
        }
    });
    /**
     * 自我简介
     */
    $('#information').editor({
        defaultIframeContent:'sjdjsds',
        ifWidth: 232,
        ifHeight: 158,
        menuObj: $('#informationSet'),
        toolCallback: function(obj){
            var des = obj.html();
            baseConfig['des'] = des;
            renderCard();
        },
        menu:[
            {'type':'bold','name':'B'},
            {'type':'italic','name':'I'},
            {'type':'underline','name':'U'},
            {'type':'justifycenter','name':'C'},
            {'type':'justifyleft','name':'L'},
            {'type':'justifyright','name':'R'},
            {'type':'createlink','name':'link'},
            {'type':'unlink','name':'unlink'}
        ],
        before: function(){
            var self = this;
            self.keyup = function(e){
                var des = $(e.target).html();
                baseConfig['des'] = des;
                renderCard();
            };
            self.blur = function(e){
                var des = $(e.target).html();
                baseConfig['des'] = des;
                renderCard();
            }
        }
    });
    /**
     * 模板生成
     */
    function renderCard(){
        var tpl = ntpl(baseConfig);
        $('#layout-page').html(tpl);
    }
    renderCard();
    //姓名渲染
    $('[name="username"]').bind('blur', function(){
        baseConfig['username'] = $(this).val();
        renderCard();
        $.post('/saveChange', { 'username': $(this).val() });
    });
    //标签
    $('[name="tags"]').bind('blur', function(){
        var tags = $(this).val().split(' ');
        tags = tags.length > 5 ? (tags.slice(0,5)) : tags;
        baseConfig['tags'] = tags;
        renderCard();
        $.post('/saveChange', { 'tags': tags });
    });
});
