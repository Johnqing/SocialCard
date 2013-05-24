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
            index = self.index() + 1;
        oUL.find('li:eq('+index+')').show().siblings(':not(:first)').hide();
        oUL.css("position","relative").animate({left: ~250}, "slow");
    });
});