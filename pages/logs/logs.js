//logs.js
//
Page({
    data:{
        ui:{
            windowWidth: 0,
            menuWidth: 0,
            offsetLeft: 0,
            tStart: true
        }
    },
    onLoad:function(){
        try{
            // 调取微信接口 获取屏幕的宽度
            let res = wx.getSystemInfoSync();
            // 赋值
            this.data.ui.windowWidth = res.windowWidth;
            this.data.ui.menuWidth  = res.windowWidth * 0.8;   //侧边宽度为 整个屏幕宽度的80%；
            this.data.ui.offsetLeft = 0;
            this.setData({
                ui:this.data.ui
            })
        }catch(e){

        }
    },
    // 手指触摸动作开始
    handlerStart:function(e){
        let {clientX, clientY} = e.touches[0];
        this.tapStartX = clientX;
        this.tapStartY = clientY;
        this.tapStartTime = e.timeStamp; //页面打开到触发事件所经过的毫秒数。
        this.startX = clientX;
        this.data.ui.tStart = true;
        this.setData({ui: this.data.ui});
    },
    // 手指触摸后移动
    handlerMove:function(e){
        let {clientX} = e.touches[0];
        let {ui} = this.data;
        // 第一次点击屏幕 clientX 减去 移动的时候 clientX  左滑动 为正  右滑动 为负
        let offsetX = this.startX - clientX;
        // 赋值新的clientX  来回滑动
        this.startX = clientX;
        ui.offsetLeft -=offsetX;
        // 如果
        if(ui.offsetLeft <= 0) {
          ui.offsetLeft = 0;
        } else if(ui.offsetLeft >= ui.menuWidth) {
          ui.offsetLeft = ui.menuWidth;
        }
        this.setData({ui: ui})
    },
    //手指触摸动作被打断，如来电提醒，弹窗
    handlerCancel:function(e){

    },
    // 手指触摸动作结束
    handlerEnd:function(e){
        this.data.ui.tStart = false;
        this.setData({ui: this.data.ui})
        let {ui} = this.data;
        let {clientX, clientY} = e.changedTouches[0];
        let endTime = e.timeStamp;
        // console.log(-5 && 10);
        //快速滑动  手指触摸动作结束 时间 - 手指触摸动作开始 时间  小于等于 300ms
        if(endTime - this.tapStartTime <=300){
            // 如果 开始坐标  -  结束坐标 小于 5 offsetLeft =0;
            if(this.tapStartY - clientX > 5){
                ui.offsetLeft = 0;
            }else if(this.tapStartY - clientX < -5 && Math.abs(this.tapStartY - clientY) < 50){
                ui.offsetLeft = ui.menuWidth;
            }else {
                // 大于一半距离显示全部 否则 隐藏
                if(ui.offsetLeft >= ui.menuWidth/2){
                    ui.offsetLeft = ui.menuWidth;
                } else {
                    ui.offsetLeft = 0;
                }
            }
        }else{
            // 大于一半距离显示全部 否则 隐藏
            if(ui.offsetLeft >= ui.menuWidth/2){
                ui.offsetLeft = ui.menuWidth;
            } else {
                ui.offsetLeft = 0;
            }
        };
        this.setData({
            ui:ui
        })
    }
})
