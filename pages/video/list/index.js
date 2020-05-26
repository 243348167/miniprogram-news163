Page({
  data: {
      isRefresh:false,
      pageSize: 10,
      page: 0,
      scrollTop: 0,
      loading: false,
      nextLoading: false,
      scrollHeight:0,
      isShowMessageBox: false,
      messageBoxText:'',
      data_list :[],
      Cookie:'_ntes_nnid=52ba73c27d37c370d13dbe2b37760e9d,1578667754423; _ntes_nuid=52ba73c27d37c370d13dbe2b37760e9d; UM_distinctid=16fd2b25be6bf7-012a8eaa746fcc-67e1b3f-1fa400-16fd2b25be7ad6; vinfo_n_f_l_n3=38f822875158fcfd.1.0.1579787900684.0.1579787945257; _antanalysis_s_id=1589688246495; _ntes_newsapp_install=false; NNSSPID=df7e9aad2a794396a0359fd276a8b3b2',
      data_tabBar_list:[
        {
          name:'搞笑',
          url:'https://3g.163.com/touch/nc/api/video/recommend/Video_Funny/'
        },
        {
          name:'新闻现场',
          url:'https://3g.163.com/touch/nc/api/video/recommend/Video_Scene/'
        },
        {
          name:'萌物',
          url:'https://3g.163.com/touch/nc/api/video/recommend/Video_Adorable/'
        },
        {
          name:'猎奇',
          url:'https://3g.163.com/touch/nc/api/video/recommend/Video_Curious/'
        },
        {
          name:'黑科技',
          url:'https://3g.163.com/touch/nc/api/video/recommend/Video_Technology/'
        },
        {
          name:'涨知识',
          url:'https://3g.163.com/touch/nc/api/video/recommend/Video_Knowledge/'
        },
        {
          name:'二次元',
          url:'https://3g.163.com/touch/nc/api/video/recommend/Video_Comic/'
        },
        {
          name:'军武',
          url:'https://3g.163.com/touch/nc/api/video/recommend/Video_Military/'
        },
        {
          name:'影视',
          url:'https://3g.163.com/touch/nc/api/video/recommend/Video_Movies/'
        },
        {
          name:'音乐',
          url:'https://3g.163.com/touch/nc/api/video/recommend/Video_Music/'
        },
        {
          name:'小品',
          url:'https://3g.163.com/touch/nc/api/video/recommend/Video_Opusculum/'
        }
      ],
      selected_tabBar:{}
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      selected_tabBar:that.data.data_tabBar_list[0]
    })
    wx.getSystemInfo({
        success:function(res){
            that.setData({
                scrollHeight:res.windowHeight
            })
        }
    })
    wx.request({
      url: that.data.selected_tabBar.url + '0-10.do?callback=videoList', 
      data: {},
      header: {
        'content-type': 'application/json', 
        'Cookie': that.data.Cookie,
      },
      success (res) {
        that.setData({
          data_list: that.data_transform(res.data),
          loading:true
        })
      }
    })
  },
  onRefresh: function(event) {
    var that = this;
    wx.request({
      url: this.data.selected_tabBar.url + '0-10.do?callback=videoList', 
      data: {},
      header: {
        'content-type': 'application/json', 
        'Cookie': that.data.Cookie,
      },
      success (res) {
        that.setData({
          data_list: that.data_transform(res.data),
          isRefresh:false,
          page:0,
          isShowMessageBox:true,
          messageBoxText: '成功为您推荐10条新内容'
        })
        setTimeout(function(){
          that.setData({
            isShowMessageBox:false,
            messageBoxText:''
          })
        },1000)
      }
    })
  },
  onReachBottom: function(event) {
    var that = this;
    if(that.data.nextLoading){
      return;
    }
    var newPage =that.data.page+that.data.pageSize;
    var pageName = newPage + "-" + that.data.pageSize + ".do?callback=videoList";
    that.setData({
      nextLoading:true
    });
    wx.request({
      url: this.data.selected_tabBar.url + pageName, 
      data: {},
      header: {
        'content-type': 'application/json', 
        'Cookie': that.data.Cookie,
      },
      success (res) {
        that.setData({
          page: newPage,
          data_list: that.data.data_list.concat(that.data_transform(res.data)),
          nextLoading:false
        })
      }
    })
  },
  data_transform:function(data){
    var tmp_data = JSON.parse(data.substring(10,data.length-1));
    for (var key in tmp_data)
        if(typeof tmp_data[key] == typeof []) 
        return tmp_data[key];
  },
  tabBarItemTap: function(e) {
    var tabBar ={};
    tabBar.name = e.detail.name;
    tabBar.url = e.detail.url;
    this.setData({
      selected_tabBar:e.detail,
      scrollTop:0
    });
    this.onRefresh();
  },
  listItemTap: function(e) {
    var obj = JSON.stringify(e.currentTarget.dataset.item);
    wx.navigateTo({
      url: '/pages/video/details/index?obj=' + encodeURIComponent(obj), // 进行编码,
    })
  }
})