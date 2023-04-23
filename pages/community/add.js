// pages/community/add.js
var app=getApp()

Page({

    data: {
    cloudImgList:[]

    },

    onLoad:function(options) {
        console.log('onload',app.globalData.userInfo)
    },
    getValue(e){
        console.log(e.detail.value)
        this.setData({
            inputValue:e.detail.value
        })
    },
    // chooseImage(){
    //     wx.chooseMedia({
    //         count: 9,
    //         mediaType: ['image','video'],
    //         sourceType: ['album', 'camera'],
    //         maxDuration: 30,
    //         camera: 'back',
    //         success(res) {
    //             var PhotoNum = res.tempFiles.length
    //             for(let i=0;i<PhotoNum;i++){
    //                 console.log(res.tempFiles[i].tempFilePath)
    //             }
    //         //上传图片
    //       }
    //     })
    // }
    //选择图片
    chooseImage(){
        var that = this
        wx.chooseImage({
            count: 9-that.data.cloudImgList.length,
            mediaType: ['image','video'],
            sourceType: ['album', 'camera'],
            success(res) {
                console.log(res)
                console.log(res.tempFilePaths)
            //上传图片
            that.data.tempImgList = res.tempFilePaths
            that.uploadImages()
          }
        })
    },
    //上传图片
    uploadImages(){
        var that = this;
        for (var i = 0;i < this.data.tempImgList.length;i++){
            wx.cloud.uploadFile({
                cloudPath:`actionImages/${Math.random()}_${Date.now()}.${this.data.tempImgList[i].match(/\.(\w+)$/)[1]}`, //随机命名和格式解析
                filePath:this.data.tempImgList[i],
                success(res){
                    console.log(res.fileID)
                    that.data.cloudImgList.push(res.fileID)
                    that.setData({
                        cloudImgList:that.data.cloudImgList
                    })
                },
                
            })
        }
    },
    //发布界面删除图片
    deleteImg(e){
        console.log(e)
        this.data.cloudImgList.splice(e.currentTarget.dataset.index,1)
        //删除云存储的图片
        // console.log(this.data.cloudImgList[e.currentTarget.dataset.index])
        // wx.cloud.deleteFile({
        //     FileList:[this.data.cloudImgList[e.currentTarget.dataset.index]]
        // })
        this.setData({
            cloudImgList:this.data.cloudImgList
        })
    },

    submitData(){
        //获取当前位置
        wx.getLocation({
            type: 'gcj02', // 国测局坐标
            success: function(res) {
              var latitude = res.latitude // 纬度
              var longitude = res.longitude // 经度
              console.log(latitude, longitude)
              wx.cloud.database().collection('locationList').add({
                data:{
                    _openid:app.globalData.userInfo._openid,
                    ico:app.globalData.avatarUrl,
                    latitude:latitude,
                    longitude:longitude
                }
            })
            }
          })
        
          if(app.globalData.avatarUrl==null){
            app.globalData.avatarUrl=app.globalData.userInfo.avatarUrl
          }
          if(app.globalData.nickName==null){
            app.globalData.nickName=app.globalData.userInfo.nickName
          }

        wx.cloud.database().collection('actions').add({
            data:{
                nickName:app.globalData.nickName,
                faceImg:app.globalData.avatarUrl,
                text:this.data.inputValue,
                images:this.data.cloudImgList,
                time:Date.now(),
                prizeList:[],
                commentList:[]
            },
            success(res){
                console.log(res)
                wx.navigateBack({
                  success: (res) => {
                      wx.showToast({
                        title: '发布成功！',
                      })
                  },
                })
            }
        })
    }
})