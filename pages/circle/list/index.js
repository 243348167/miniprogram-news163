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
      selected_tabBar:{
        name:'圈子',
        url:'https://3g.163.com/touch/jsonp/hot/comments/'
      }
  },
  onLoad: function (options) {
    var that = this;

    wx.getSystemInfo({
        success:function(res){
            that.setData({
                scrollHeight:res.windowHeight
            })
        }
    })
    wx.request({
      url: this.data.selected_tabBar.url + '0-10.html?callback=hotcomment', 
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
      url: this.data.selected_tabBar.url + '0-10.html?callback=hotcomment', 
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
    var pageName = newPage + "-" + that.data.pageSize + ".html?callback=hotcomment";
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
    var tmp_data = JSON.parse(data.substring(11,data.length-1));
    return tmp_data;
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