// console.log = function(obj){
//     //扩展后续页面
// }
var TestApplication =(function () {
    function TestApplication() {
        var w = document.getElementById("outscene").offsetWidth;
        var h = document.getElementById("outscene").offsetHeight
        this.app = new PIXI.Application({ width: w, height:h ,antialias:true});
        this.uiStage = new gui.Stage(this.app.view.width, this.app.view.height);
        this.app.stage.addChild(this.uiStage.container);
        document.getElementById("outscene").appendChild(this.app.view);
        this.initTest();
        console.log("init TestApplication");
    }
    TestApplication.prototype.initTest = function () {
        var _this = this;
        this.resize();
        this.app.ticker.maxFPS = 60;
        this.app.ticker.add(this.updata, this);
    };
    TestApplication.prototype.resize = function () {
        var _this = this;
        this.app.resize();
        this.uiStage.resize(this.app.view.width * devicePixelRatio, this.app.view.height * devicePixelRatio);
        window.addEventListener("resize", function () {
            _this.resize();
        });
    };
    TestApplication.prototype.updata = function (deltaTime) {
        gui.TickerShared.update(deltaTime,this.app.ticker.lastTime,this.app.ticker.elapsedMS);
    };
    TestApplication.prototype.loadClass = function (className,classStr = "") {
        //ES5 强行破坏commonjs
        var attrib = `
        var exports = {};
        var require = function(){};
        `;
        classStr += `window.${className} = ${className}`;
        eval(classStr);
        this.uiStage.releaseAll();
        PIXI.Loader.shared.reset();
        new window[className](this.app,this.uiStage);
    };
    return TestApplication;
}());

window.testApplication = new TestApplication();