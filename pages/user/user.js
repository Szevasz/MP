const app = getApp()
Page({
    inputValue:app.globalData.userInfo.nickName,
    avatarUrl:app.globalData.userInfo.avatarUrl,
    data: {
        loginType:'Login',
        nList:[{
            name:'我的文章',
            ico:'../../icon/myarticals.ico',
            nav:'articals/articals',
        },{
            name:'我的地址',
            ico:'../../icon/mountain.png',
            nav:'adress/adress',
        },{
            name:'个人中心',
            ico:'',
            nav:'my/my',
        }]
    },

    getValue(e){
        console.log('getValue:e.detail.value:',e.detail.value)
        this.setData({
            inputValue:e.detail.value,
        })
        console.log('this.inputValue:',this.inputValue)
        app.globalData.nickName=e.detail.value,
        console.log('getValue:app.globalData.nickName:',app.globalData.nickName)
    },

 //从数据库获取navList
    get_navList(){
    let that=this
        wx.cloud.database().collection("navList").get({ 
            success(res){
                console.log('请求成功',res)
                that.setData({
                    nList:res.data
                })                
            },
            fail(e){
                console.log('请求失败',res)
            }
        });
    },

    //点击跳转列表
    tap(res){
        console.log('点击成功',res.currentTarget.dataset.nav)
        wx.navigateTo({
          url: res.currentTarget.dataset.nav,
          success: (result) => {},
          fail: (res) => {},
          complete: (res) => {},
        })
    },
    loginActive()
    {
        wx.getUserProfile({
          desc: '授权登陆',
          success(res){
            console.log('授权成功',res)
            app.globalData.userInfo = res.userInfo    
            
            wx.setStorageSync('userInfo', res.userInfo)
          }
        })
    },
    outInfo(){
        console.log(app.globalData.userInfo)
    },
    onLoad(options) {

        this.setData({
            inputValue:app.globalData.userInfo.nickName,
            avatarUrl:app.globalData.userInfo.avatarUrl,
        })
        app.globalData.avatarUrl=this.avatarUrl,
        app.globalData.nickName=this.inputValue,

        console.log('onLoad::')
        console.log('inputValue:',this.inputValue)
        console.log('avaterURL:',this.avatarUrl)
        wx.onThemeChange((result) => {
            this.setData({
              theme: result.theme
            })
          })
        },
        //选取头像
        onChooseAvatar(e) {
          const { avatarUrl } = e.detail 
          console.log('onChooseAvate:',e.detail)
          this.setData({
            avatarUrl:e.detail
          })
          app.globalData.avatarUrl=e.detail.avatarUrl
          this.uploadImages()
    },
    //上传图片
    uploadImages(){
        console.log('uploadImags..')
        var that = this;
        wx.cloud.uploadFile({
            cloudPath:`actionImages/${Math.random()}_${Date.now()}.${app.globalData.avatarUrl.match(/\.(\w+)$/)[1]}`, //随机命名和格式解析
            filePath:app.globalData.avatarUrl,
            success(res){
                    console.log('user.uploadfile.fileID1:',res.fileID)
                    app.globalData.avatarUrl=res.fileID
                    console.log('app.globalData.avatarUrl:',app.globalData.avatarUrl)
            },
                
            })
    },
})