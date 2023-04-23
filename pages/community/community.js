// pages/community/community.js
const util = require("../../utils/util")

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
        
    },

    onLoad:function() {
        console.log(app.globalData.openid)
        var that = this
        that.setData({
            myOpenid: app.globalData.openid
        })
    },
   
    getActionsList(){
        var that = this
    // 模糊搜索的话加上这个
        // .where({
        // text: wx.cloud.database().RegExp({
        //     regexp: that.data.keyValue
        // })
        // })
        //从云存储拿出数据渲染 oderBy函数按时间进行排序
       
        wx.cloud.database().collection('actions').orderBy('time','desc').get({
            success: (res) => {
                //格式化时间
                var list = res.data
                for(var l in list)
                {
                    list[l].time = util.formatTime(new Date(list[l].time))
                }

                //用来判断用户是否点赞 更换点赞图标显示
                for(var l in list)
                {
                    for(var j in list[l].prizeList)
                    {
                        if(list[l].prizeList[j].openid == app.globalData.openid)
                        {
                            list[l].isPrized = true 
                        }
                    }
                }

                for(var l in list){
                    if(list[l].commentList.length != 0)
                      for(var j in list[l].commentList){
                        list[l].commentList[j].time = util.formatTime(new Date(list[l].commentList[j].time))
                    }
                  }

                that.setData({
                    actionsList:list
                    
                })
                console.log('成功完成',res)
            }
        })
    },

    AddNew:function(){
        
        if(app.globalData.userInfo != null){
        wx.navigateTo({
            url: 'add',
         })
        }else{
            wx.showModal({
              confirmText: '收到',
              content: '请先授权登录',
              title: '提示',
              success: (result) => {
                wx.getUserProfile({
                    desc: '授权登陆',
                    success(res){
                      console.log('授权成功',res)
                      app.globalData.userInfo = res.userInfo    
                      
                      wx.setStorageSync('userInfo', res.userInfo)
                    }
                  })
              },
              fail: (res) => {},
              complete: (res) => {},
            })
        }
    },

    deleteAction(event){
        console.log(event)
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

    onPullDownRefresh(){
        this.getActionsList()
    },

    //点赞
    prizeAction(event){
        if(app.globalData.userInfo == null)
        {
            wx.showModal({
                confirmText: '收到',
                content: '请先授权登录',
                title: '提示',
                success: (result) => {
                  wx.getUserProfile({
                      desc: '授权登陆',
                      success(res){
                        console.log('授权成功',res)
                        app.globalData.userInfo = res.userInfo    
                        
                        wx.setStorageSync('userInfo', res.userInfo)
                      }
                    })
                },
                fail: (res) => {},
                complete: (res) => {},
              })
        }
        else
        {
            var that = this
            console.log(event)
            wx.cloud.database().collection('actions').doc(event.currentTarget.dataset.id).get({
                success(res){
                    console.log(res)
                    var action = res.data
                    var flag = false
                    var index
                    for(var l in action.prizeList){
                        if(action.prizeList[l].openid == app.globalData.openid){
                            flag = true
                            index = l
                            break
                        }
                    }
                    //判断
                    if(flag)
                    {
                        //已点赞 取消点赞
                        action.prizeList.splice(index,1)
                        console.log(action)
                        wx.cloud.database().collection('actions').doc(event.currentTarget.dataset.id).update({
                            data:{
                                prizeList:action.prizeList 
                            },
                            success(res){
                                console.log(res)
                                that.getActionsList()
                            }
                        })
                    }
                    else
                    {
                        //未点赞 添加点赞
                        var user = {}
                        user.nickName = app.globalData.userInfo.nickName
                        user.faceImg = app.globalData.userInfo.avatarUrl
                        user.openid = app.globalData.openid
                        action.prizeList.push(user)
                        console.log(action.prizeList)
                        // 更新用户点赞
                        wx.cloud.database().collection('actions').doc(event.currentTarget.dataset.id).update({
                            data:{
                                prizeList:action.prizeList
                            },
                            success(res){
                                that.getActionsList()
                            }
                        })
                    }

                }
            })
        }   
    },

    commentAction(event){
        if(app.globalData.userInfo == null)
        {
            wx.showModal({
                confirmText: '收到',
                content: '请先授权登录',
                title: '提示',
                success: (result) => {},
                fail: (res) => {},
                complete: (res) => {},
              })
        }else{
            var that = this
            commentId = event.currentTarget.dataset.id
            console.log(commentId)
            wx.cloud.database().collection('actions').doc(event.currentTarget.dataset.id).get({
                success(res){
                console.log(res)
                that.setData({
                    replyaction:res.data,
                    pubShow:(!that.data.pubShow)
                    })
                },
             })
        }
    },
    
    getInputValue(event){
        console.log(event.detail.value)
        this.data.inputValue = event.detail.value
    },
    //发表评论
    publishComment(event){
        if(app.globalData.userInfo == null)
        {
            wx.showModal({
                confirmText: '收到',
                content: '请先授权登录',
                title: '提示',
                success: (result) => {
                  wx.getUserProfile({
                      desc: '授权登陆',
                      success(res){
                        console.log('授权成功',res)
                        app.globalData.userInfo = res.userInfo    
                        
                        wx.setStorageSync('userInfo', res.userInfo)
                      }
                    })
                },
                fail: (res) => {},
                complete: (res) => {},
              })
        }
        else
        {
            var that = this
            wx.cloud.database().collection('actions').doc(commentId).get({
                success(res){
                    console.log(res)
                    var action = res.data
                    var comment = {}
                    comment.nickName = app.globalData.userInfo.nickName
                    comment.faceImg = app.globalData.userInfo.avatarUrl
                    comment.openid = app.globalData.openid
                    comment.text = that.data.inputValue
                    comment.time = Date.now()
                    comment.toOpenid = that.data.toOpenid
                    comment.toNickname = that.data.toNickname
                    action.commentList.push(comment)
                    wx.cloud.database().collection('actions').doc(commentId).update({
                        data:{
                            commentList:action.commentList
                        },
                        success(res){
                            console.log(res)
                            that.getActionsList()
                            that.setData({
                                inputValue:'',
                                placeHolder:''
                            })
                        }
                    })
                }
            })
        }
    },
    //删除评论
    deleteComment(event){
        var that = this
        wx.showModal({
          title:'提示',
          content:'确定要删除此评论吗?',
          success(res){
              if(res.confirm){
                var index = event.currentTarget.dataset.index
        wx.cloud.database().collection('actions').doc(event.currentTarget.dataset.id).get({
            success(res){
                var action = res.data
                action.commentList.splice(index,1)
                wx.cloud.database().collection('actions').doc(event.currentTarget.dataset.id).update({
                    data:{
                        commentList:action.commentList
                    },
                    success(res){
                        wx.showToast({
                          title: '删除成功',
                        })
                        that.getActionsList()
                    }
                })
            }
            })
            }else if(res.cancel){

            }
          }
        })
    },
    //回复评论
    replyComment(event){
        var that = this
        var index = event.currentTarget.dataset.index
        that.setData({
            placeHolder : '回复'+this.data.replyaction.commentList[index].nickName,
            toOpenid:this.data.replyaction.commentList[index].openid,
            toNickname:this.data.replyaction.commentList[index].nickName,
        })
    },
    //浏览照片
    previewImg(event){
        var that = this
        console.log(event.currentTarget.dataset.index)
        wx.previewImage({
          current: event.currentTarget.dataset.src, //当前显示图片的路径
          urls: that.data.actionsList[event.currentTarget.dataset.index].images,  //图片列表
        })
    }
})