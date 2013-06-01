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
require(['jquery','ctlchange','jeditor','drag','controller'], function($,renderCard){
    var layout = $('[data-type="layout"]');
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
    renderCard();
});
