/**
 * 模板渲染
 * User: liuqing
 * Date: 13-5-28
 * Time: 上午10:26
 * To change this template use File | Settings | File Templates.
 */
define(['tpm'], function(nTpl){
    var tpl = function(data, callback){
        var Name = '<div id="userpage-layout-about-header">'+
                        '<div id="name_custom_font">'+
                        '<h1 id="userpage-layout-about-name"><%= aboutname %></h1>'+
                        '</div>'+
                    '</div>';
        var Tag = '<div id="userpage-layout-tag-container">'+
                        '<% for(var i=0; i<abouttag.length; i++){ %>'+
                        '<span><a href="/search?tag=<%= abouttag[i] %>"><%= abouttag[i] %></a></span>'+
                        '<% } %>'+
                   '</div>';
        var Des = '<div id="userpage-layout-about-description"><%= aboutdes %></div>';
        tplHTML= Name + Tag + Des;
        return nTpl.tpl(tplHTML, data);
    };
    return tpl;
});