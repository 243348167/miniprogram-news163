// pages/news/index.js
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
      data_tabBar_list:[
        {
          name:'新闻',
          url:'https://3g.163.com/touch/reconstruct/article/list/BBM54PGAwangning/'
        },
        {
          name:'娱乐',
          url:'https://3g.163.com/touch/reconstruct/article/list/BA10TA81wangning/'
        },
        {
          name:'体育',
          url:'https://3g.163.com/touch/reconstruct/article/list/BA8E6OEOwangning/'
        },
        {
          name:'财经',
          url:'https://3g.163.com/touch/reconstruct/article/list/BA8EE5GMwangning/'
        },
        {
          name:'军事',
          url:'https://3g.163.com/touch/reconstruct/article/list/BAI67OGGwangning/'
        },
        {
          name:'科技',
          url:'https://3g.163.com/touch/reconstruct/article/list/BA8D4A3Rwangning/'
        },
        {
          name:'手机',
          url:'https://3g.163.com/touch/reconstruct/article/list/BAI6I0O5wangning/'
        },
        {
          name:'数码',
          url:'https://3g.163.com/touch/reconstruct/article/list/BAI6JOD9wangning/'
        },
        {
          name:'游戏',
          url:'https://3g.163.com/touch/reconstruct/article/list/BAI6RHDKwangning/'
        },
        {
          name:'教育',
          url:'https://3g.163.com/touch/reconstruct/article/list/BA8FF5PRwangning/'
        },
        {
          name:'健康',
          url:'https://3g.163.com/touch/reconstruct/article/list/BDC4QSV3wangning/'
        },
        {
          name:'旅游',
          url:'https://3g.163.com/touch/reconstruct/article/list/BEO4GINLwangning/'
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
      url: this.data.selected_tabBar.url + '0-10.html', 
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
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
      url: this.data.selected_tabBar.url + '0-10.html', 
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
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
    var pageName = newPage + "-" + that.data.pageSize + ".html";
    that.setData({
      nextLoading:true
    });
    wx.request({
      url: this.data.selected_tabBar.url + pageName, 
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
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
    var tmp_data = JSON.parse(data.substring(9,data.length-1));
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
      url: '/pages/news/details/index?obj=' + encodeURIComponent(obj), // 进行编码,
    })
  }
})