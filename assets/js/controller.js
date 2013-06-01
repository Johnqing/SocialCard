define(['jquery','ctlchange','drag'], function($, renderCard){
    if($('[data-type="controller"]').length<=0){return;}
    var layout = $('[data-type="layout"]'),
        controller = $('[data-type="controller"]'),
        contTitle = $('.controller-title'),
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
    //

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
        defaultIframeContent: baseConfig['des'],
        ifWidth: 232,
        ifHeight: 158,
        menuObj: $('#informationSet'),
        toolCallback: function(obj){
            var des = obj.html();
            baseConfig['des'] = des;
            renderCard();
            $.post('/saveChange', { 'des': des });
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
                des = des.replace(/\'/ig,"&quot;");
                console.log(des);
                baseConfig['des'] = des;
                renderCard();
            };
            self.blur = function(e){
                var des = $(e.target).html();
                baseConfig['des'] = des;
                renderCard();
                $.post('/saveChange', { 'des': des });
            }
        }
    });
    /**
     * 模板生成
     */
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
        tags = tags.join(' ');
        baseConfig['tags'] = tags;
        renderCard();
        $.post('/saveChange', { 'tags': tags });
    });
});