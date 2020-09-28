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
    goods: [{
        "name": "热销榜",
        "type": 1,
        "foods": [{
            "name": "皮蛋瘦肉粥",
            "price": 10,
            "oldPrice": 0,
            "sellCount": 229,
            "Count": 0,
            "image": "http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/750/h/750"
          },
          {
            "name": "扁豆焖面",
            "price": 14,
            "oldPrice": 0,
            "sellCount": 188,
            "Count": 0,
            "image": "http://fuss10.elemecdn.com/c/6b/29e3d29b0db63d36f7c500bca31d8jpeg.jpeg?imageView2/1/w/750/h/750"
          },
          {
            "name": "葱花饼",
            "price": 10,
            "oldPrice": 0,
            "sellCount": 124,
            "Count": 0,
            "image": "http://fuss10.elemecdn.com/f/28/a51e7b18751bcdf871648a23fd3b4jpeg.jpeg?imageView2/1/w/750/h/750"
          },
          {
            "name": "牛肉馅饼",
            "price": 14,
            "oldPrice": 0,
            "sellCount": 114,
            "Count": 0,
            "image": "http://fuss10.elemecdn.com/d/b9/bcab0e8ad97758e65ae5a62b2664ejpeg.jpeg?imageView2/1/w/750/h/750"
          },
          {
            "name": "招牌猪肉白菜锅贴/10个",
            "price": 17,
            "oldPrice": 0,
            "sellCount": 101,
            "Count": 0,
            "image": "http://fuss10.elemecdn.com/7/72/9a580c1462ca1e4d3c07e112bc035jpeg.jpeg?imageView2/1/w/750/h/750"
          },
          {
            "name": "南瓜粥",
            "price": 9,
            "oldPrice": 0,
            "sellCount": 91,
            "Count": 0,
            "image": "http://fuss10.elemecdn.com/8/a6/453f65f16b1391942af11511b7a90jpeg.jpeg?imageView2/1/w/750/h/750"
          }
        ]
      },
      {
        "name": "单人精彩套餐",
        "type": 2,
        "foods": [{
          "name": "红枣山药粥套餐",
          "price": 29,
          "oldPrice": 36,
          "sellCount": 17,
          "Count": 0,
          "image": "http://fuss10.elemecdn.com/6/72/cb844f0bb60c502c6d5c05e0bddf5jpeg.jpeg?imageView2/1/w/750/h/750"
        }]
      },
      {
        "name": "冰爽饮品限时特惠",
        "type": 3,
        "foods": [{
          "name": "VC无限橙果汁",
          "price": 8,
          "oldPrice": 10,
          "sellCount": 15,
          "Count": 0,
          "image": "http://fuss10.elemecdn.com/e/c6/f348e811772016ae24e968238bcbfjpeg.jpeg?imageView2/1/w/750/h/750"
        }]
      },
      {
        "name": "爽口凉菜",
        "type": 4,
        "foods": [{
            "name": "八宝酱菜",
            "price": 4,
            "oldPrice": 0,
            "sellCount": 84,
            "Count": 0,
            "image": "http://fuss10.elemecdn.com/9/b5/469d8854f9a3a03797933fd01398bjpeg.jpeg?imageView2/1/w/750/h/750"
          },
          {
            "name": "拍黄瓜",
            "price": 9,
            "oldPrice": 0,
            "sellCount": 28,
            "Count": 0,
            "image": "http://fuss10.elemecdn.com/6/54/f654985b4e185f06eb07f8fa2b2e8jpeg.jpeg?imageView2/1/w/750/h/750"
          }
        ]
      },
      {
        "name": "精选套餐",
        "type": 5,
        "foods": [{
            "name": "红豆薏米粥套餐",
            "price": 37,
            "oldPrice": 0,
            "sellCount": 3,
            "Count": 0,
            "image": "http://fuss10.elemecdn.com/f/49/27f26ed00c025b2200a9ccbb7e67ejpeg.jpeg?imageView2/1/w/750/h/750"
          },
          {
            "name": "皮蛋瘦肉粥套餐",
            "price": 31,
            "oldPrice": 0,
            "sellCount": 12,
            "Count": 0,
            "image": "http://fuss10.elemecdn.com/8/96/f444a8087f0e940ef264617f9d98ajpeg.jpeg?imageView2/1/w/750/h/750"
          }
        ]
      },
      {
        "name": "果拼果汁",
        "type": 6,
        "foods": [{
            "name": "蜜瓜圣女萝莉杯",
            "price": 6,
            "oldPrice": 0,
            "sellCount": 1,
            "Count": 0,
            "image": "http://fuss10.elemecdn.com/b/5f/b3b04c259d5ec9fa52e1856ee50dajpeg.jpeg?imageView2/1/w/750/h/750"
          },
          {
            "name": "加多宝",
            "price": 6,
            "oldPrice": 0,
            "sellCount": 7,
            "Count": 0,
            "image": "http://fuss10.elemecdn.com/b/9f/5e6c99c593cf65229225c5661bcdejpeg.jpeg?imageView2/1/w/750/h/750"
          },
          {
            "name": "VC无限橙果汁",
            "price": 8,
            "oldPrice": 10,
            "sellCount": 15,
            "Count": 0,
            "image": "http://fuss10.elemecdn.com/e/c6/f348e811772016ae24e968238bcbfjpeg.jpeg?imageView2/1/w/750/h/750"
          }
        ]
      }
    ],
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
    storeId: null
  },
  onLoad: function(e) {
    // 确保页面数据已经刷新完毕~
    setTimeout(() => {
      this.getAllRects()
    }, 20)
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
    this.data.goods[parentIndex].foods[index].Count--
      var num = this.data.goods[parentIndex].foods[index].Count;
    var mark = 'a' + index + 'b' + parentIndex
    var price = this.data.goods[parentIndex].foods[index].price;
    var name = this.data.goods[parentIndex].foods[index].name;
    var oldPrice = this.data.goods[parentIndex].foods[index].oldPrice;
    if (num == 0) {
      var obj = {};
    } else {
      var obj = {
        price: price,
        oldPrice: oldPrice,
        num: num,
        mark: mark,
        name: name,
        index: index,
        parentIndex: parentIndex
      };
    }

    var carArray1 = this.data.cartArray.filter(item => item.mark != mark);
    carArray1.push(obj);

    carArray1 = this.filter(carArray1);
    console.log(carArray1);
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
    this.data.goods[parentIndex].foods[index].Count++;
    var mark = 'a' + index + 'b' + parentIndex
    var price = this.data.goods[parentIndex].foods[index].price;
    var num = this.data.goods[parentIndex].foods[index].Count;
    var name = this.data.goods[parentIndex].foods[index].name;
    var oldPrice = this.data.goods[parentIndex].foods[index].oldPrice;
    var obj = {
      price: price,
      oldPrice: oldPrice,
      num: num,
      mark: mark,
      name: name,
      index: index,
      parentIndex: parentIndex
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
      totalPrice += cartArray[i].price * cartArray[i].num;
      totalCount += cartArray[i].num
      totalOldPrice += cartArray[i].oldPrice
    }
    this.setData({
      totalPrice: totalPrice,
      totalCount: totalCount,
      totalOldPrice: totalOldPrice,
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
  empty() {
    this.setData({
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
    console.log(menuToTop[i])
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
    wx.createSelectorQuery().selectAll('.menu-active').boundingClientRect(function(rects) {
      return rects[0].top
    }).exec()
  },
  getAllRects() {
    // 获取商品数组的位置信息
    wx.createSelectorQuery().selectAll('.pro-item').boundingClientRect(function(rects) {
      rects.forEach(function(rect) {
        // console.log(rect)
        // 这里减去160是根据你的滚动区域距离头部的高度，如果没有高度，可以将其删去
        proListToTop.push(rect.top - 256)
      })
    }).exec()

    // 获取menu数组的位置信息
    wx.createSelectorQuery().selectAll('.menu-item').boundingClientRect(function(rects) {
      wx.getSystemInfo({
        success: function(res) {
          // console.log(res);
          windowHeight = res.windowHeight / 2
          // console.log(windowHeight)
          rects.forEach(function(rect) {
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