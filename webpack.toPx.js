/**
 * Created by Administrator on 2018/12/13 0013.
 */
const fs = require('fs-extra');
const pathTo = require('path');
const pluginName = 'webpack.toRem';
const hasPluginInstalled = fs.existsSync('./web/plugin.js');
/**
 * webpack插件开发采用'动态原型模式'
 * 插件开发，最重要的两个对象：compiler、compilation
 * @param options
 * @constructor
 */
function Multipage(options) { // 根据 options 配置你的插件

}
Multipage.prototype.replaceFileContent = function (filePath, math, tostr) {
    return new Promise((r, j) => {
        fs.readFile(filePath, 'utf8', function (err, files) {
            let result = files.replace(math, tostr);
            fs.outputFileSync(filePath, result);
            if (err) {
                j(err);
            } else {
                console.warn('replaceFileContent:' + filePath + ' toStr' + tostr);
                r();
            }

        })
    })
};
Multipage.prototype.copyFile = function (sourceFile, destPath) {
    fs.createReadStream(sourceFile);
    const readStream = fs.createReadStream(sourceFile);
    const writeStream = fs.createWriteStream(destPath);
    readStream.pipe(writeStream);
    return new Promise((r, j) => {
        writeStream.on('finish', function (e) {
            console.warn('copyFile:' + sourceFile + ' to:' + destPath + ' ok');
            r(e);
        });
        writeStream.on('error', function (err) {
            j(err);
        });
    })
};
Multipage.prototype.rem2px = function (numRem) {
    // return numPx*320/375/12/2;
    return Math.round(numRem*2*12*375/320)
}

Multipage.prototype.contentPx2Rem = function (content) {
    let result = content,whileRet,self = this;
    while(whileRet = result.match(/(\d+)(px)/)){
        console.log(whileRet[0] + ':' + whileRet[1] + ':' + whileRet[2]);
        result = result.replace(new RegExp('('+whileRet[1]+')(px)'), self.px2rem(whileRet[1]) + 'rem');
    }
    return result;
}

Multipage.prototype.handleRem2Px = function (filePath) {
    console.log('handlePx2Rem:'+filePath);
    var self = this;
    return new Promise((r, j) => {
        fs.readFile(filePath, 'utf8', function (err, files) {
            let result = files,whileRet;
            while(whileRet = result.match(/(\d+\.*\d*)(rem)/)){
                // console.log(whileRet[0] + ':' + whileRet[1] + ':' + whileRet[2]);
                result = result.replace(new RegExp('('+whileRet[1]+')(rem)'), self.rem2px(whileRet[1]) + 'px');
            }
            fs.outputFileSync(filePath, result);
            if (err) {
                j(err);
            } else {
                // console.warn('handlePx2Rem:' + filePath + ' toStr');
                r();
            }

        })
    })
}

Multipage.prototype.handlePx2Rem = function (filePath) {
    console.log('handlePx2Rem:'+filePath);
    var self = this;
    return new Promise((r, j) => {
        fs.readFile(filePath, 'utf8', function (err, files) {
            let result = files,whileRet;
            while(whileRet = result.match(/(\d+)(px)/)){
                // console.log(whileRet[0] + ':' + whileRet[1] + ':' + whileRet[2]);
                result = result.replace(new RegExp('('+whileRet[1]+')(px)'), self.px2rem(whileRet[1]) + 'rem');
            }
            fs.outputFileSync(filePath, result);
            if (err) {
                j(err);
            } else {
                // console.warn('handlePx2Rem:' + filePath + ' toStr');
                r();
            }

        })
    })
}
const vueWebTemp = 'temp';
var isWin = /^win/.test(process.platform);


// apply方法是必须要有的，因为当我们使用一个插件时（new somePlugins({})），webpack会去寻找插件的apply方法并执行
Multipage.prototype.apply = function (compiler) {
    // compiler是什么？compiler是webpack的'编译器'引用


    // compiler.plugin('***')和compilation.plugin('***')代表什么？
    // document.addEventListener熟悉吧？其实是类似的
    // compiler.plugin('***')就相当于给compiler设置了事件监听
    // 所以compiler.plugin('compile')就代表：当编译器监听到compile事件时，我们应该做些什么

    // compiler.hooks.run.tap(pluginName, compilation => {
    //     console.log('The webpack build process is starting!!!');
    // });

    // compiler.plugin("before-compile", async (params) => {
    //     await this.run();
    // });

    // compile（'编译器'对'开始编译'这个事件的监听）
    // compiler.plugin("before-run", async (compiler, callback) => {
    //     console.warn("The before-run is starting to handle...");
    //     callback();
    // });
    //
    // compiler.plugin("environment",(arguments)=>{
    //     // console.log('environment:'+JSON.stringify(arguments));
    // });
    //
    // compiler.plugin('run',(arguments)=>{
    //     // console.log('run:'+JSON.stringify(arguments));
    // });
    // compiler.plugin('invalid',(arguments)=>{
    //     console.log('invalid:'+JSON.stringify(arguments));
    // });

    // compiler.plugin("make", (compilation, callback) => {
    //     callback();
    // });

    // compiler.plugin("entry-option", async (context, entry) => {
    //     //webpack Entry 动态
    //     return true;
    // });

    var self = this;

    compiler.plugin("this-compilation",(compilation)=>{
        // console.log('this-compilation:'+JSON.stringify(compilation.compiler.options));
    });

    // compilation（'编译器'对'编译ing'这个事件的监听）
    compiler.plugin("compilation", function (compilation) {
        console.warn("The compiler is starting a new compilation...");
        // 在compilation事件监听中，我们可以访问compilation引用，它是一个代表编译过程的对象引用
        // 我们一定要区分compiler和compilation，一个代表编译器实体，另一个代表编译过程
        // optimize('编译过程'对'优化文件'这个事件的监听)
        compilation.plugin("optimize", function () {
            console.warn("The compilation is starting to optimize files...");
        });
    });

    // emit（'编译器'对'生成最终资源'这个事件的监听）
    compiler.plugin("emit", function (compilation, callback) {
        console.warn("The compilation is going to emit files...");

        // compilation.chunks是块的集合（构建后将要输出的文件，即编译之后得到的结果）
        compilation.chunks.forEach(function (chunk) {
            // chunk.modules是模块的集合（构建时webpack梳理出的依赖，即import、require的module）
            // 形象一点说：chunk.modules是原材料，下面的chunk.files才是最终的成品
            chunk.modules.forEach(function (module) {
                // module.fileDependencies就是具体的文件，最真实的资源【举例，在css中@import("reset.css")，这里的reset.css就是fileDependencie】
                module.fileDependencies.forEach(function (filepath) {
                    // 到这一步，就可以操作源文件了
                    if(filepath.indexOf('app.vue') > -1
                        || filepath.indexOf('seamlessScroll.vue') > -1
                        || filepath.indexOf('withdraw.vue') > -1
                        || filepath.indexOf('toast.css') > -1
                        || filepath.indexOf('withdrawInWeixin.vue') > -1
                        || filepath.indexOf('goodConfirm.vue') > -1
                        || filepath.indexOf('loading.vue') > -1
                        || filepath.indexOf('newPeopleAward.vue') > -1
                        || filepath.indexOf('notBindCellHint.vue') > -1
                        || filepath.indexOf('bindCellPhone.vue') > -1){
                        // self.copyFile(filepath,filepath+'.bak'+Date.now());
                        self.handleRem2Px(filepath);
                    }
                   // self.handlePx2Rem(filepath);
                });
            });

            // 最终生成的文件的集合
            chunk.files.forEach(function (filename) {
                // source()可以得到每个文件的源码
                var source = compilation.assets[filename].source();
                // console.log(source);
            });
        });

        // callback在最后必须调用
        callback();
    });
};

// 以上compiler和compilation的事件监听只是一小部分，详细API可见该链接http://www.css88.com/doc/webpack2/api/plugins/

module.exports = Multipage;

// Multipage.prototype.apply = function(compiler) {
//     var _this = this;
//     if (compiler === undefined) {
//         return _this.run();
//     } else {
//         // To check which version of webpack is used
//         var hooks = compiler.hooks;
//         if (_this.options.watch) {
//             var compile = function(params) {
//                 _this.run();
//             }
//             if (hooks) {
//                 hooks.compile.tap(pluginName, compile);
//             } else {
//                 compiler.plugin("compile", compile);
//             }
//         } else if (_this.options.beforeEmit && !compiler.options.watch) {
//
//             var emit = function(compilation, callback) {
//                 _this.run();
//                 callback();
//             };
//
//             if (hooks) {
//                 hooks.emit.tapAsync(pluginName, emit);
//             } else {
//                 compiler.plugin("emit", emit);
//             }
//         } else {
//             return _this.run();
//         }
//     }
// };
//
// module.exports = Multipage;