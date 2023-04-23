// pages/order/order.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    getInfo()
    {
        wx.getUserProfile({
          desc: '授权登陆',
          success(res){
            console.log('授权成功',res)
            app.globalData.userInfo = res.userInfo    
            console.log('授权之后',app.globalData.userInfo)
            wx.setStorageSync('userInfo', res.userInfo)
          }
        })
    },

    onLoad(options) {
        

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        console.log('order.onShow.globalData.userInfo:',app.globalData.userInfo)
        if(app.globalData.userInfo==null){
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

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },
    // 页面跳转到点餐界面
    clickpack:function(){
        wx.navigateTo({
          url: 'order1',
        })
    },
    clickcup:function(){
        wx.navigateTo({
          url: 'order1',
        })
    }
})