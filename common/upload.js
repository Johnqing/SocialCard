var fs = require('fs')
    , config = require('../config');

var upload = {
    upfile: function(req, res, next) {//用户上传图片
        fs.readdir(config.source, function (err, files) {
            var count = files.length+1;
            if(req.files.addImage.size==0)//判断用户上传的内容是否为空
            {
                res.redirect('http://localhost:3000/upload');
    //            res.send("<br>"+"<br>"+"<br>"+"请选择需要上传的文件！！！");
            }
            else{
                var tmp_path = req.files.addImage.path; // 获得文件的临时路径
                var target_path = config.source +req.files.addImage.name;// 指定文件上传后的目录
                fs.rename(tmp_path, target_path, function(err) { // 移动文件
                    if (err) throw err;
                    fs.unlink(tmp_path, function() {// 删除临时文件夹文件,
                        if (err) throw err;
                        res.redirect('http://localhost:3000');
                        res.end();
                    });
                });}
        });
    },
    sendDate: function(req,res){ //向客户端传送服务器图片信息
        fs.readdir("./public/images/", function (err, files) {//读取文件夹下文件
            var count = files.length,
                results =new Array() ;
            files.forEach(function (filename) {
                fs.readFile(filename, function (data) {
                    var tmpResult={};
                    tmpResult["imageName"]=filename;
                    tmpResult["imagePath"] = config.source + filename;
                    results[count-1]=tmpResult ;
                    count--;
                    if (count <= 0) {
                        console.log(results);
                        res.send(results);
                        res.end();//向客户端传送服务器图片信息（json数据格式）
                    }
                });
            });
        });
    },
    show: function(req,res){
        var ima=req.params.imaNames;
        fs.readFile(config.source + ima, "binary", function(error, file) {
            if(error) {
                res.writeHead(500, {"Content-Type": "text/plain"});
                res.write(error + "\n"); res.end();
            }
            else
            {
                res.writeHead(200, {"Content-Type": "image/png"});
                res.write(file, "binary"); res.end();
            }
        });
    },
    delete: function(req,res){//删除图片
        var fileName=req.params.id;
        fs.unlink(config.source + fileName);
        res.redirect('http://localhost:3000');
    }
};
module.exports = upload;