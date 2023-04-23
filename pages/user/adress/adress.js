// pages/user/adress/adress.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        longitude: 120.15515,
        latitude: 30.27415,
        markers: [],
        locationList: []
      },


      //获取locationList
      getLocationList(){
        console.log('getLocationLsit')
        var that=this
        wx.cloud.database().collection('locationList').get({
            success: (res) => {
                console.log('请求成功:',res.data)
                var list=res.data
                console.log('list:',list)
                for(let item of list){
                    
                    this.data.locationList.push(item)
                    
                    // this.setData({
                    //     locationList.
                    // })
                }
                console.log('locationList:',this.data.locationList)
                
            }
        })
      },
      //
      //


    /**
     * 生命周期函数--监听页面加载
     */
    
    onLoad(options) {
        console.log('设置好了locationList')
        this.getLocationList()
        console.log('onload.locationList:',this.locationList)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function (e) {
        console.log('ready,开始设置makers')
        // 使用 wx.createMapContext 获取 map 上下文 
        this.mapCtx = wx.createMapContext('map')
        
        // 根据 locationList 设置 markers
        let markers = this.data.locationList.map(item => {
            console.log('map:',item.longitude)
          return {
            id: item._id,
            longitude: item.longitude,
            latitude: item.latitude,
            iconPath:'../../../icon/location.png',
            width:'200px',
            height:'200px'
          }
        })
        
        this.setData({
          markers
        })
        console.log('makers',this.data.markers)
      },

      tapMap(e) {
        // 获取点击位置的经纬度
        let {longitude, latitude} = e.detail
        
        // 打印或返回经纬度
        console.log(longitude, latitude)
        
        // 或者使用回调函数
       // this.callback(longitude, latitude)
      },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        
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
    tap(res){
         // 根据 locationList 设置 markers
         let markers = this.data.locationList.map(item => {
            console.log('map:',item.ico)
          return {
            id: item._id,
            longitude: item.longitude,
            latitude: item.latitude,
            iconPath:item.ico,
            width:'60px',
            height:'60px'
          }
        })
        
        this.setData({
          markers
        })
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

    }
})