// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../dist/gui.d.ts" />

export default class TestScrollBar {

    public constructor(app: vf.Application, uiStage: vf.gui.Stage) {
        this.onLoad(app,uiStage)
    }

    private onLoad(app: vf.Application, uiStage: vf.gui.Stage) {

        const title = new vf.gui.Label("scrooll组件，配合ScrollingContainer使用");
        title.x = 10;
        title.y = 20;
        uiStage.addChild(title);

        const sc = this.getScrollingContainer(uiStage, 10, 100, "拖拽进度条或拖拽图片");

        /** 滑动条容器 vertical = false */
        const vscrollBar = new vf.gui.ScrollBar();//参数2设置sourceTrack的9宫拉伸
        vscrollBar.thumb = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAIAAABvrngfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1NEJCQkM0RjAxRjIxMUU1OUIxODkzNzZCOTg5NDdBQyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1NEJCQkM1MDAxRjIxMUU1OUIxODkzNzZCOTg5NDdBQyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkYxOUJGMjdFMDFGMDExRTU5QjE4OTM3NkI5ODk0N0FDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjU0QkJCQzRFMDFGMjExRTU5QjE4OTM3NkI5ODk0N0FDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+m4wp+wAAABdJREFUeNpi0Wm5xoAKmBgwADWFAAIMAK5qAZXBXGqKAAAAAElFTkSuQmCC`;
        vscrollBar.track = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAIAAABvrngfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozQ0JERjUzNDAxRUUxMUU1OUIxODkzNzZCOTg5NDdBQyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyQUExMDQ2QzAxRUYxMUU1OUIxODkzNzZCOTg5NDdBQyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjNDQkRGNTMyMDFFRTExRTU5QjE4OTM3NkI5ODk0N0FDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjNDQkRGNTMzMDFFRTExRTU5QjE4OTM3NkI5ODk0N0FDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+KKOhfwAAABdJREFUeNpiefHiBQMqYGLAANQUAggwADUDAscAbnM3AAAAAElFTkSuQmCC";
        vscrollBar.x = 0;
        vscrollBar.style.right = 0;
        vscrollBar.width = 20;
        vscrollBar.height = sc.height;
        vscrollBar.source = sc;//绑定vf.gui.ScrollingContainer
        vscrollBar.vertical = true;//位置必须在实例后
        vscrollBar.autohide = true; //当内容不需要滚动时，隐藏
        vscrollBar.value = 0;
        sc.addChild(vscrollBar);


        // /** 滑动条容器 vertical = true */
        // let hscrollBar = new vf.gui.ScrollBar(0, 1);
        // hscrollBar.sourceThumb = "assets/skin/ScrollBar/roundthumb.png";
        // hscrollBar.sourceTrack = "assets/skin/ScrollBar/track_sb.png";
        // hscrollBar.x = sc.x;
        // hscrollBar.y = sc.y + sc.height + 20;
        // hscrollBar.width = sc.width;
        // hscrollBar.height = 10;
        // hscrollBar.scrollingContainer = sc;//绑定vf.gui.ScrollingContainer
        // hscrollBar.value = 0;
        // hscrollBar.vertical = false;
        // hscrollBar.autohide = true;
        // uiStage.addChild(hscrollBar);

    }


    private getScrollingContainer(uiStage: vf.gui.Stage, x: number, y: number, label: string) {
        const sc = new vf.gui.ScrollingContainer();
        sc.style.backgroundColor = 0xffffff;
        sc.x = x;
        sc.y = y;
        sc.width = 500;
        sc.height = 300;

        const img = new vf.gui.Image();
        img.src = "assets/sprite.png";
        img.y = 0;
        sc.addChild(img);

        const img2 = new vf.gui.Image();
        img2.src = "assets/dino.png";
        img2.x = 10;
        img2.y = 700;
        sc.addChild(img2);

        const img3 = new vf.gui.Image();
        img3.src = "assets/dino.png";
        img3.x = 300;
        img3.y = 780;
        sc.addChild(img3);

        const t = new vf.gui.Label(label);
        t.style.color = 0x000000;
        t.y = 0;
        sc.addChild(t);

        uiStage.addChild(sc);
        return sc;
    }

}


