define(['jquery'], function($){
    var contTitle = $('.controller-title'),
        contCon = $('.constroller-con');
    //一级分类切换
    contTitle.click(function(){
        $(this).next(".constroller-con").slideToggle("slow").siblings(".constroller-con:visible").slideUp("slow");
    });
});