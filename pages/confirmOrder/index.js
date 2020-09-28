// pages/confirmOrder/index.js
var app = getApp();
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    name: '',
    totalPrice: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      name: app.globalData.cartName,
      list: app.globalData.cartArray
    })
    console.log(app.globalData.storeId,
      app.globalData.cartArray)
    this.calTotalPrice()
  },
  //计算总价
  calTotalPrice: function() {
    var cartArray = this.data.list;
    var totalPrice = 0;
    var totalCount = 0;
    // var totalOldPrice = 0;
    for (var i = 0; i < cartArray.length; i++) {
      totalPrice += cartArray[i].price * cartArray[i].number.toFixed(2);
      totalCount += cartArray[i].number
      // totalOldPrice += cartArray[i].oldPrice
      // console.log(Number(cartArray[i].price), Number(cartArray[i].number), totalPrice)

    }
    this.setData({
      totalPrice: Number(totalPrice).toFixed(2),
      // totalCount: totalCount,
      // totalOldPrice: Number(totalOldPrice).toFixed(2),
      // payDesc: this.payDesc()
    });
  },

  submit() {
    let _this = this
    api.requestLoading('smart-restaurant/api/orderController/createOrder', {
      storeId: app.globalData.storeId,
      orderDetailDTOList: _this.data.list,
      tableNum: 1
    }, '结算中...', 'post', function(res) {
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/pay/pay?resultType=success',
        })
      }, 1000)
      app.globalData.storeId = ''
      app.globalData.cartName = ''
      app.globalData.cartArray = []
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})