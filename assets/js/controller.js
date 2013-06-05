define(['jquery','ctlchange','tpm','drag','colorPicker','tab'], function($, renderCard, Ntpl){
    if($('[data-type="controller"]').length<=0){return;}
    var layout = $('[data-type="layout"]'),
        controller = $('[data-type="controller"]'),
        contTitle = $('.controller-title'),
        contCon = $('.constroller-con');
    //一级分类切换
    contTitle.click(function(){
        var conNode = $(this).next(".constroller-con");
        conNode.slideToggle("slow").siblings(".constroller-con:visible").slideUp("slow");
        var h = conNode.find('li.active').height();
        conNode.find('ul').height(h);
    });
    //二级切换
    var subCont = contCon.find('.controller-panel-nav');
    subCont.bind('click', function(){
        var self = $(this),
            oUL = self.parents('ul'),
            index = self.index() + 1,
            liItem = oUL.find('li:eq('+index+')');
        liItem.addClass('active').show().siblings(':not(:first)').removeClass('active').hide();
        oUL.css("position","relative").animate({left: ~250, height: liItem.innerHeight()}, "slow");
    });
    //点击头部切换
    $('.controller-container-header').bind('click',function(){
        var oUL = $(this).parents('ul'),
            firstLiItem = oUL.find('li:eq(0)');
        oUL.css("position","relative").animate({left: 0, height: firstLiItem.height()}, "slow");
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
    //颜色控制
    $('#controller-design-colors a').colorPicker({
        callback: function(obj, color){
            obj.css({
                'background-color': color
            });
            var id = obj.attr('data-id') !== 'body' ? '#'+obj.attr('data-id') : 'body';
            if(id === 'body' || id === '#layout-page'){
                $(id).css({'background-color': color});
                return;
            }
            $(id).css({'color': color});
        },
        opacityCallBack: function(obj, text){
           var id = obj.attr('data-id') !== 'body' ? '#'+obj.attr('data-id') : 'body';
           if(id === 'body' || id === '#layout-page'){
               if(navigator.userAgent.indexOf("MSIE 6.0") > 0 || navigator.userAgent.indexOf("MSIE 7.0") > 0
                   || navigator.userAgent.indexOf("MSIE 8.0") > 0){
                    $(id).css({
                        'background-color': 'none',
                        'filter': 'progid:DXImageTransform.Microsoft.gradient(startColorstr='+ text.hex +',endColorstr='+ text.hex +');'
                    });
                   return;
               }
               $(id).css({'background-color': text.rgba});
               return;
           }
        }
    });
    //字体
    $('#fontSet').tab({
        target: '.tab-box span',
        contClass: 'tab-con'
    });
    //字体渲染
    var fontFamily = {
        tpl: function(){
            var tpl = '<% for(var i=0; i<data.length; i++){ %>'+
                    '<div class="familyName">'+
                        '<span><%= data[i].name %></span>'+
                        '<dl>'+
                        '<% for(var j=0, family=data[i].family; j<family.length; j++){ %>'+
                            '<dd class="<%= family[j].type %>"><%= family[j].name %></dd>'+
                        '<% } %>'+
                        '</dl>'+
                    '</div>'+
                '<% } %>';
            return tpl;
        },
        data: [
            {
                name: '姓名',
                family: [
                    {
                        name: '宋体',
                        type: '宋体'
                    },
                    {
                        name: '宋体+粗',
                        type: '宋体 bold'
                    },
                    {
                        name: '微软雅黑',
                        type: '微软雅黑'
                    },
                    {
                        name: 'Arial',
                        type: 'Arial'
                    },
                    {
                        name:  'Arial Bold',
                        type: 'Arial bold'
                    },
                    {
                        name: 'Arial Bold Italic',
                        type: 'Arial bold italic'
                    },
                    {
                        name: 'Arial Italic',
                        type: 'Arial italic'
                    }
                ]
            }
        ]
    };
    var familyTpl = Ntpl.tpl(fontFamily.tpl(),fontFamily);
    $('#fontFamily').html(familyTpl);
});