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

Multipage.prototype.handlePx2Rpx= function (filePath) {
    console.log('handlePx2Rpx:'+filePath);
    var self = this;
    return new Promise((r, j) => {
        fs.readFile(filePath, 'utf8', function (err, files) {
            let result = files,whileRet;
            while(whileRet = result.match(/(\d+)(px)/)){
                // console.log(whileRet[0] + ':' + whileRet[1] + ':' + whileRet[2]);
                result = result.replace(new RegExp('('+whileRet[1]+')(px)'), whileRet[1] + 'rpx');
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

Multipage.prototype.joinRegExpRet = function(ret,indexList){
    var i,result = '';
    for(i = 1;i<ret.length;i++){
        if(!indexList || indexList.indexOf(i) > -1){
            if(ret[i] !== undefined){
                result += ret[i];
            }   
        }
    }
    return result;
};

Multipage.prototype.handleReplaceCss = function ( filePath) {
    console.log('handleReplaceCss:'+filePath);
    var self = this;
    return new Promise((r, j) => {
        fs.readFile(filePath, 'utf8', function (err, files) {
            let result = files,whileRet;
            // h4 2  [ele-attr="h4"] h1,h2 h3 h4;h5,h6,i,p,section
            while(whileRet = result.match(/\s((h|i|p|section|span|div|footer|img|ul|li)\d*)(\s*)(\{|:)/)){
                whileRet[1] = '.'+whileRet[1]+'';
                result = result.replace(whileRet[0],self.joinRegExpRet(whileRet,[1,3,4]));
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

Multipage.prototype.handleReplace = function (filePath) {
    console.log('handleReplace:'+filePath);
    var self = this;
    return new Promise((r, j) => {
        fs.readFile(filePath, 'utf8', function (err, files) {
            let result = files,whileRet;
            //list 2 scroll-view
            while(whileRet = result.match(/(\d+\.*\d*)(rem)/)){
                // console.log(whileRet[0] + ':' + whileRet[1] + ':' + whileRet[2]);
                result = result.replace(new RegExp('('+whileRet[1]+')(rem)'), self.rem2px(whileRet[1]) + 'rpx');
            }
            while(whileRet = result.match(/<list/)){
                result = result.replace('<list','<scroll-view');
            }
            while(whileRet = result.match(/<\/list>/)){
                result = result.replace('</list>','</scroll-view>');
            }
            while(whileRet = result.match(/@scroll/)){
                result = result.replace('@scroll','bindscroll');
            }
            //cell 2 div
            while(whileRet = result.match(/<cell/)){
                result = result.replace('<cell','<div');
            }
            while(whileRet = result.match(/<\/cell>/)){
                result = result.replace('</cell>','</div>');
            }
            //<text 2 <span
            while(whileRet = result.match(/<text/)){
                result = result.replace('<text','<span');
            }
            while(whileRet = result.match(/<\/text>/)){
                result = result.replace('</text>','</span>');
            }
            //@click 2 @tap
            while(whileRet = result.match(/@click/)){
                result = result.replace('@click','@tap');
            }
            //<scroller 2 <scroll-view
            while(whileRet = result.match(/<scroller/)){
                result = result.replace('<scroller','<scroll-view');
            }
            while(whileRet = result.match(/<\/scroller>/)){
                result = result.replace('</scroller>','</scroll-view>');
            }
            //scroll-direction="horizontal" 2 scroll-x="true"
            while(whileRet = result.match(/scroll-direction="horizontal"/)){
                result = result.replace('scroll-direction="horizontal"','scroll-x="true"');
            }
            //<slider 2 <swiper
            while(whileRet = result.match(/<slider/)){
                result = result.replace('<slider','<swiper');
            }
            while(whileRet = result.match(/<\/slider>/)){
                result = result.replace('</slider>','</swiper>');
            }
            //auto-play="true" 2 autoplay="true"
            while(whileRet = result.match(/auto-play="true"/)){
                result = result.replace('auto-play="true"','autoplay="true"');
            }
             //auto-play="true" 2 autoplay="true"
             while(whileRet = result.match(/mounted/)){
                result = result.replace('mounted','onShow');
            }
            //lang="scss" 2 lang="less"
            while(whileRet = result.match(/lang="scss"/)){
                result = result.replace('lang="scss"','lang="less"');
            }

            //import HourMinute from "./components/HourMinute.vue";
            while(whileRet = result.match(/import(\s+)(\w+)(\s+)from(\s+)["|'](.\/components|..\/components)\/(\w+)(.vue)["|']/)){
                result = result.replace(whileRet[0],whileRet[2] + ':\'~@/components/' + whileRet[2] + '.wpy\'' );
            }
            //window. 2 global.
            while(whileRet = result.match(/window./)){
                result = result.replace(whileRet[0],'global.')
            }

            //localStorage.getItem
            while(whileRet = result.match(/localStorage.getItem/)){
                result = result.replace(whileRet[0],'wx.getStorageSync')
            }

            //};</script>
            while(whileRet = result.match(/(\})(\s*)(;*)(\s*)(<\/script>)/)){
                result = result.replace(whileRet[0],'});\n</script>')
            }

            //(export(\s)*default) 2 wepy.page
            if(result.match(/components(\s)*(\:)(\s)*(\{)/)){
                result = result.replace(/export(\s)+default/g,"import wepy from '@wepy/core';\nwepy.component(")
            }else{
                result = result.replace(/export(\s)+default/g,"import wepy from '@wepy/core';\nwepy.page(")
            }
            
            //left:30; right:30 ; top:30; bottom : 30; height:30;width:30;
            while(whileRet = result.match(/(top|left|right|bottom|height|width)(\s)*(:)(\s)*(\d+)(\s)*(;)/)){
                whileRet[5] = whileRet[5]+'rpx';
                result = result.replace(whileRet[0],self.joinRegExpRet(whileRet));
            }
            //delete components
            while(whileRet = result.match(/(components)(\s)*(:)(\s)((?!\})[\s\S])*(\})(\s*)(\,)/)){
                result = result.replace(whileRet[0],'')
            }
            //data(){}
            while(whileRet = result.match(/(data\s*\(\s*\)\s*\{\s*return\s*)(((?!(\}\s*\;\s*\}\s*\,))[\s\S])*)((\}\s*\;\s*\}\s*\,))/)){
                result = result.replace(whileRet[0],'data:'+whileRet[2] + '},');
            }

            //h4 2 span class = "<h4" <h1,<h2 <h3 <h4;<h5,<h6,<i,<p,<section
            // while(whileRet = result.match(/(<)(h|i|p|section)(\d*)(class="([\s\S]*)")*((?!>)[\s\S])*(>)/)){
            //     result = result.replace(whileRet[0],'<div ele-attr="'+whileRet[2]+whileRet[3]+'"'+whileRet[4]);
            // }

            //h4 2 span class = "</h4>" </h1>,</h2> </h3> </h4>;</h5>,</h6>,</i>,</p>,</section>
            // while(whileRet = result.match(/(<\/)(h|i|p|section)(\d*)(>)/)){
            //     result = result.replace(whileRet[0],'</div>')
            // }

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
                    if(filepath.indexOf('.vue') > -1){
                        // self.copyFile(filepath,filepath+'.bak'+Date.now());
                        self.handleReplace(filepath).then(() => {
                            return self.handlePx2Rpx(filepath);
                        }).then(() => {
                            return self.handleReplaceCss(filepath);
                        })
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