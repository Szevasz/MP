const util = require("../../../utils/util")
const app = getApp()
var commentId = ''

Page({
    data:{
        actionsList:[],
        replyaction:[],
        pubShow:false
    },

    onShow(){
        
        this.getActionsList()
        console.log('显示')
    },

    onLoad:function() {
        
        console.log('openid:',app.globalData.openid)
        var that = this
        that.setData({
            myOpenid: app.globalData.openid,
            success(res){
                console,log('成功改变')
            }
        })
    },
   
    getActionsList(){
        
        var that = this
        
      

        wx.cloud.database().collection('actions').where({
                _openid : app.globalData.openid
            })
            .orderBy('time','desc')
            .get({
                success: (res) => {
                    // 格式化时间
                    var list = res.data
                 for(var l in list)
                 {
                    list[l].time = util.formatTime(new Date(list[l].time))
                 }
                 console.log('成功格式化时间!!',res)
                 that.setData({
                    actionsList:list
                })
            }
        })
    },


    onPullDownRefresh(){
        this.getActionsList()
    },
    
    getInputValue(event){
        console.log(event.detail.value)
        this.data.inputValue = event.detail.value
    },

    //删除评论
    deleteAction(event){
        console.log('id:',event)
        var that = this;
        wx.showModal({
            title:'提示',
            content:'确定要删除此发布吗？',
            success(res){
                if(res.confirm){
                    wx.cloud.database().collection('actions').doc(event.currentTarget.dataset.id).remove({
                        success(res){
                            // console.log(res)
                            wx.showToast({
                              title: '删除成功!',
                            })
                            that.getActionsList()
                        }
                    })
                }else{

                }
            }
        })
        
    },

    previewImg(event){
        var that = this
        console.log(event.currentTarget.dataset.index)
        wx.previewImage({
          current: event.currentTarget.dataset.src, //当前显示图片的路径
          urls: that.data.actionsList[event.currentTarget.dataset.index].images,  //图片列表
        })
    }


})