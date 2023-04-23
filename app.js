// app.js

App({
  
  onLaunch(res) {
      console.log(this.globalData.userInfo)
      // 获取用户信息
      wx.getUserProfile({
        desc: '用于完善个人资料', // 描述
        success: (res) => {
          console.log(res)
          this.globalData.userInfo = res.userInfo
          // 将userInfo放入缓存区
          wx.setStorage({
            key: 'userInfo',
            data: res.userInfo,
            success: (res) => {
              console.log('缓存成功')
            }
          })
        }
      })
    
      console.log('进入app',res)
      console.log(this.globalData.userInfo)
    //云开发环境的初始化
    wx.cloud.init({
        env:"mountainsandplains-0dtyfc3126de0"
    })

    if(wx.getStorageSync('openid')){
        console.log('获取openid成功:',wx.getStorageSync('openid'))
        this.globalData.openid = wx.getStorageSync('openid')
    }

    if(wx.getStorageSync('userInfo')){
        console.log('获取userInfo成功',wx.getStorageSync('userInfo'))
        this.globalData.userInfo = wx.getStorageSync('userInfo')
    }
    var that = this;
    wx.cloud.callFunction({
        name:'getUserOpenid',
        success(res){
            // console.log(res.result.openid)
            that.globalData.openid = res.result.openid
            wx.getStorageSync('openid',res.result.openid)
        }
    })
    console.log(this.globalData.userInfo)
    },
    globalData: {
        userInfo:null,
        openid:null,
        nickName:null,
        avatarUrl:null,
      }
})
