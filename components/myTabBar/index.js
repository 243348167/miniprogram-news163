Component({
  properties: {
    data_tabBar_list: {
      type: Array,
      value: ''
    },
    selected_tabBar: {
      type: Object,
      value: {}
    },
    width: {
      type: String,
      value: '600px'
    },
  },
  data: {},
  methods: {
    tabBarItemTap:function(e){
      let data = e.currentTarget.dataset.item;
      this.triggerEvent("tabBarItemTap", data);
    }
  }

})
