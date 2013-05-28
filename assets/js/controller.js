define(['jquery'], function($){
    var contTitle = $('.controller-title'),
        contCon = $('.constroller-con');
    //一级分类切换
    contTitle.click(function(){
        $(this).next(".constroller-con").slideToggle("slow").siblings(".constroller-con:visible").slideUp("slow");
    });
    //二级切换
    var subCont = contCon.find('.controller-panel-nav');
    subCont.bind('click', function(){
        var self = $(this),
            oUL = self.parents('ul'),
            index = self.index() + 1,
            liItem = oUL.find('li:eq('+index+')');
        liItem.show().siblings(':not(:first)').hide();
        oUL.css("position","relative").animate({left: ~250, height: liItem.innerHeight()}, "slow");
    });
    //点击头部切换
    $('.controller-container-header').bind('click',function(){
        var oUL = $(this).parents('ul');
        oUL.css("position","relative").animate({left: 0, height: 120}, "slow");
    });
});