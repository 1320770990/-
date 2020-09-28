//index.js
//获取应用实例
const app = getApp()
const api = require('../../utils/api.js')

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    select: false,
    title: '',
    content: ''
  },
  onLoad: function () {
    if (wx.getStorageSync('userInfo')) {
      wx.switchTab({
        url: '/pages/home/index',
      })
    }
  },
  isShowBj() {
    this.setData({
      select: false
    })
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    wx.setStorageSync('userInfo', e.detail.userInfo)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    wx.navigateBack()
  }
})

