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
require(['require','jquery','ctlchange','jeditor','drag'], function(require, $, renderCard){
    renderCard();
    require(['./controller']);
});
