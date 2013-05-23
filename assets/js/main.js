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
require(['jquery','drag'], function($){
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
            $.post("/layoutPage",
                {left: this.left,top: this.top},
                function (data, textStatus){

                },
            "json");
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
            console.log(this.left + " " + this.top);
        }
    });
});
