var app = getApp();
const api = require('../../utils/api.js')
//声明全局变量
let proListToTop = [],
  menuToTop = [],
  MENU = 0,
  windowHeight, timeoutId;
// MENU ==> 是否为点击左侧进行滚动的，如果是，则不需要再次设置左侧的激活状态
Page({
  data: {
    currentActiveIndex: 0,
    // 接口返回的商品数组
    goods: [],
    // 优惠底部详情框
    showModalStatus: false,
    animationData: '',
    currentTab: 0,
    // 底部购物车
    totalCount: 0, // 商品总数
    totalPrice: 0, // 总价格
    totalOldPrice: 0,
    fold: true,
    cartShow: 'none',
    cartArray: [],

    // foodCounts: 0,
    minPrice: 20, //起送价格
    payDesc: '',
    deliveryPrice: 4, //配送費
    // 门店信息
    Merchant: {},
    storeId: null,
    shopDetail: {}
  },
  onLoad: function(e) {
    this.getMerchant()
    this.getShopDetail()
  },
  // 获取商家详情
  getShopDetail() {
    var _this = this;
    api.requestLoading('smart-restaurant/api/shopController/queryStoreById', {
      id: 1
    }, '加载中...', 'get', function(res) {
      // console.log('获取商家详情', res.data)
      _this.setData({
        shopDetail: res.data
      })
    })
  },

  // 获取门店信息
  getMerchant() {
    var _this = this;
    api.requestLoading('smart-restaurant/api/shopController/queryStoreMsgById', {
      id: 1
    }, '加载中...', 'get', function(res) {
      // console.log('获取门店信息', res.data)
      _this.setData({
        Merchant: res.data,
        storeId: res.data.id
      })
      app.globalData.cartName = res.data.name
      _this.getFoods()
    })
  },
  // 获取商品列表
  getFoods() {
    var _this = this;
    api.requestLoading('smart-restaurant/api/foodController/queryFoodCategoryList', {
      storeId: _this.data.storeId
    }, '加载中...', 'get', function(res) {
      // console.log('获取商品列表', res.data)
      let _goods = res.data
      _goods.forEach(item => {
        if (item.foodDTOList) {
          item.foodDTOList.forEach(food => {
            food.count = 0
          })
        }
      })
      // console.log(_goods)
      _this.setData({
        goods: _goods
      })
      // 确保页面数据已经刷新完毕~
      setTimeout(() => {
        _this.getAllRects()
      }, 20)
    })
  },

  selectTab(e) {
    this.setData({
      //拿到当前索引并动态改变
      currentTab: e.currentTarget.dataset.idx
    })
  },
  // 查看已购商品
  purchaseGoods() {
    if (!this.data.totalCount) {
      return;
    }
    this.setData({
      fold: !this.data.fold,
    })
    var fold = this.data.fold
    this.cartShow(fold)
  },
  cartShow(fold) {
    if (fold == false) {
      this.setData({
        cartShow: 'block',
      })
    } else {
      this.setData({
        cartShow: 'none',
      })
    }
  },
  isEmpty(obj) {
    let empty = true;
    for (let key in obj) {
      if (obj[key]) {
        empty = false;
        break;
      }
    }
    return empty
  },

  filter(array) {
    return array.filter(item => !this.isEmpty(item))
  },
  // 移除商品
  decreaseCart: function(e) {
    var index = e.currentTarget.dataset.itemIndex;
    var parentIndex = e.currentTarget.dataset.parentindex;
    this.data.goods[parentIndex].foodDTOList[index].count--;
    var mark = 'index' + index + 'parentIndex' + parentIndex
    var price = this.data.goods[parentIndex].foodDTOList[index].sellPrice;
    var num = this.data.goods[parentIndex].foodDTOList[index].count;
    var name = this.data.goods[parentIndex].foodDTOList[index].title;
    var oldPrice = this.data.goods[parentIndex].foodDTOList[index].originPrice;
    var foodId = this.data.goods[parentIndex].foodDTOList[index].id;
    var coverImg = this.data.goods[parentIndex].foodDTOList[index].coverImg;

    if (num == 0) {
      var obj = {};
    } else {
      var obj = {
        price: price,
        oldPrice: oldPrice,
        number: num,
        mark: mark,
        name: name,
        coverImg: coverImg,
        index: index,
        parentIndex: parentIndex,
        foodId: foodId,
        storeId: this.data.storeId
      };
    }

    var carArray1 = this.data.cartArray.filter(item => item.mark != mark);
    carArray1.push(obj);

    carArray1 = this.filter(carArray1);
    // console.log(carArray1);
    this.setData({
      cartArray: carArray1,
      goods: this.data.goods
    })
    this.calTotalPrice()
    this.setData({
      payDesc: this.payDesc(),
    })
    //关闭弹起
    var count1 = 0
    for (let i = 0; i < carArray1.length; i++) {
      if (carArray1[i].num == 0) {
        count1++;
      }
    }
    //console.log(count1)
    if (count1 == carArray1.length) {
      if (num == 0) {
        this.setData({
          cartShow: 'none'
        })
      }
    }
  },
  decreaseShopCart(e) {
    this.decreaseCart(e)
  },
  //添加到购物车
  addCart(e) {
    var index = e.currentTarget.dataset.itemIndex;
    var parentIndex = e.currentTarget.dataset.parentindex;
    this.data.goods[parentIndex].foodDTOList[index].count++;
    var mark = 'index' + index + 'parentIndex' + parentIndex
    var price = this.data.goods[parentIndex].foodDTOList[index].sellPrice;
    var num = this.data.goods[parentIndex].foodDTOList[index].count;
    var name = this.data.goods[parentIndex].foodDTOList[index].title;
    var oldPrice = this.data.goods[parentIndex].foodDTOList[index].originPrice;
    var foodId = this.data.goods[parentIndex].foodDTOList[index].id;
    var coverImg = this.data.goods[parentIndex].foodDTOList[index].coverImg;
    var obj = {
      price: price,
      oldPrice: oldPrice,
      number: num,
      mark: mark,
      name: name,
      coverImg: coverImg,
      index: index,
      parentIndex: parentIndex,
      foodId: foodId,
      storeId: this.data.storeId
    };
    var carArray1 = this.data.cartArray.filter(item => item.mark != mark)
    carArray1.push(obj)

    this.setData({
      cartArray: carArray1,
      goods: this.data.goods
    })
    this.calTotalPrice();
    this.setData({
      payDesc: this.payDesc()
    })
  },
  addShopCart(e) {
    this.addCart(e)
  },

  //计算总价
  calTotalPrice: function() {
    var cartArray = this.data.cartArray;
    var totalPrice = 0;
    var totalCount = 0;
    var totalOldPrice = 0;
    for (var i = 0; i < cartArray.length; i++) {
      totalPrice += cartArray[i].price * cartArray[i].number.toFixed(2);
      totalCount += cartArray[i].number
      totalOldPrice += cartArray[i].oldPrice * cartArray[i].number.toFixed(2);
      // console.log(Number(cartArray[i].price), Number(cartArray[i].number), totalPrice)
    }
    this.setData({
      totalPrice: Number(totalPrice).toFixed(2),
      totalCount: totalCount,
      totalOldPrice: Number(totalOldPrice).toFixed(2),
      payDesc: this.payDesc()
    });
  },
  //差几元起送
  payDesc() {
    if (this.data.totalPrice === 0) {
      return `￥${this.data.minPrice}元起送`;
    } else if (this.data.totalPrice < this.data.minPrice) {
      let diff = this.data.minPrice - this.data.totalPrice;
      return '还差' + diff + '元起送';
    } else {
      return '去结算';
    }
  },
  // 结算
  submit() {
    // console.log(this.data.cartArray)
    let _this = this
    if (!wx.getStorageSync('userInfo')) {
      wx.navigateTo({
        url: '/pages/index/index',
      })
      return false
    }
    app.globalData.storeId = _this.data.storeId
    app.globalData.cartArray = _this.data.cartArray
    wx.navigateTo({
      url: '/pages/confirmOrder/index',
    })
  },
  empty() {
    let arr = this.data.goods
    arr.reduce((item, next) => {
      if(next.foodDTOList) next.foodDTOList.map(item => item.count = 0)
      return item
    }, [])

    this.setData({
      goods: arr,
      totalCount: 0,
      totalPrice: 0,
      totalOldPrice: 0,
      fold: true,
      cartShow: 'none',
      cartArray: []
    })
  },
  // 更多优惠
  selectMore() {
    this.showModal()
  },
  // 查看商家实景
  previewImage(e) {
    var current = this.data.shopDetail.advertisementImg
    // var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接 
      urls: [current]
      // urls: this.data.item.j_img // 需要预览的图片http链接列表  
    })
  },
  // 联系商家
  calling() {
    let _this = this
    wx.showModal({
      content: _this.data.shopDetail.contactMobile,
      confirmColor: '#1296db',
      confirmText: '拨打',
      success(res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: _this.data.shopDetail.contactMobile,
            success: function() {
              console.log("拨打电话成功！")
            },
            fail: function() {
              console.log("拨打电话失败！")
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 导航
  getLocation() {
    let _this = this
    wx.openLocation({
      latitude: _this.data.shopDetail.latitude,
      longitude: _this.data.shopDetail.longitude,
      name: _this.data.shopDetail.name,
      // address: _this.data.shopDetail
    })
  },
  //显示对话框
  showModal: function() {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function() {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  changeMenu(e) {
    // console.log(proListToTop);
    // 改变左侧tab栏操作
    if (Number(e.target.id) === this.data.currentActiveIndex) return
    MENU = 1
    this.setData({
      currentActiveIndex: Number(e.target.id),
      rightProTop: proListToTop[Number(e.target.id)]
    })
    this.setMenuAnimation(Number(e.target.id))
  },
  scroll(e) {
    // console.log(e);
    for (let i = 0; i < proListToTop.length; i++) {
      if (e.detail.scrollTop < proListToTop[i] && i !== 0 && e.detail.scrollTop > proListToTop[i - 1]) {
        return this.setDis(i)
      }
    }
    // 找不到匹配项，默认显示第一个数据
    if (!MENU) {
      this.setData({
        currentActiveIndex: 0
      })
    }
    MENU = 0
  },
  setDis(i) {
    // console.log('kkk', i)
    // 设置左侧menu栏的选中状态
    if (i !== this.data.currentActiveIndex + 1 && !MENU) {
      this.setData({
        currentActiveIndex: i - 1
      })
    }
    MENU = 0
    this.setMenuAnimation(i)
  },
  setMenuAnimation(i) {
    // 设置动画，使menu滚动到指定位置。
    let self = this
    if (menuToTop[i].animate) {
      // 节流操作
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => {
        self.setData({
          leftMenuTop: (menuToTop[i].top - windowHeight)
        })
      }, 50)
    } else {
      if (this.data.leftMenuTop === 0) return
      this.setData({
        leftMenuTop: 0
      })
    }
  },
  getActiveReacts() {
    wx.createSelectorQuery().selectAll('.menu-active').boundingClientRect(function (rects) {
      return rects[0].top
    }).exec()
  },
  getAllRects() {
    // 获取商品数组的位置信息
    wx.createSelectorQuery().selectAll('.pro-item').boundingClientRect(function (rects) {
      rects.forEach(function (rect) {
        // console.log(rect)
        // 减去滚动区域距离头部的高度
        proListToTop.push(rect.top - 331)
      })
    }).exec()

    // 获取menu数组的位置信息
    wx.createSelectorQuery().selectAll('.menu-item').boundingClientRect(function (rects) {
      wx.getSystemInfo({
        success: function (res) {
          // console.log(res);
          windowHeight = res.windowHeight / 2
          // console.log(windowHeight)
          rects.forEach(function (rect) {
            menuToTop.push({
              top: rect.top,
              animate: rect.top > windowHeight
            })
          })
        }
      })
    }).exec()
  },
  // 获取系统的高度信息
  getSystemInfo() {
    let self = this
    wx.getSystemInfo({
      success: function(res) {
        windowHeight = res.windowHeight / 2
      }
    })
  }

})