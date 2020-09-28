/* utils/api.js  自定义网络请求 */

// 测试后台API地址
// const baseURL = 'http://rap2.taobao.org:38080/app/mock/252553/' 
// 线上后台API地址
const baseURL = 'http://39.106.207.158:9001/'

const http = ({
  url = '',
  params = {},
  load = '',
  ...other
} = {}) => {
  if (load != '') {
    wx.showLoading({
      title: load
    })
  }

  let time = Date.now()
  return new Promise((resolve, reject) => {
    wx.request({
      url: getUrl(url),
      data: params,
      ...other,
      complete: (res) => {
        if (load != '') {
          wx.hideLoading()
        }
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else {
          reject(res)
        }
      }
    })
  })
}
const getUrl = url => {
  if (url.indexOf('://') == -1) {
    url = baseURL + url
  }
  return url
}
const getUrl1 = url => {
  if (url.indexOf('://') == -1) {
    url = baseURL1 + url
  }
  return url
}
const getHeader = () => {
  try {
    var tokenmini = wx.getStorageSync('tokenmini')
    if (tokenmini) {
      return {
        'tokenmini': tokenmini,
      }
    }
    return {}
  } catch (e) {
    return {}
  }
}
const getHeaderToken = () => {
  try {
    var token = wx.getStorageSync('token')
    // var token =13;
    if (token) {
      return {
        'token': token
      }
    }
    return {}
  } catch (e) {
    return {}
  }
}

// 展示进度条的网络请求
// url:网络请求的url
// params:请求参数
// message:进度条的提示信息
// success:成功的回调函数
// fail：失败的回调
function requestLoading(url, params, message, method, success) {

  // params.session_key = 12;
  wx.showNavigationBarLoading()
  if (message != "") {
    wx.showLoading({
      title: message,
    })
  }
  let gurl = url.split("/")
  if (gurl[1] == 'api1') {
    url = getUrl1(url)
  } else {

    url = getUrl(url)
  }
  wx.request({
    url: url,
    data: params,
    header: {
      'tokenmini': getHeader().tokenmini,
      'token': getHeaderToken().token,
      'Content-Type': 'application/json'
      // 'content-type': 'application/x-www-form-urlencoded'
    },
    method: method,
    success: function (res) {
      // console.log(res)
      wx.hideNavigationBarLoading()
      if (message != "") {
        wx.hideLoading()
      }
      if (res.statusCode == 200) {
        if (res.data.code == 200) {
          success(res.data)
        // } else if (res.data.code == 4001) {
        //   wx.setStorageSync('tokenmini', '')
        //   login()
        // } else if (res.data.code == 401) {
        //   wx.setStorageSync('token', '')
        //   wx.showToast({
        //     title: '登录失效，请从新登录',
        //     icon: 'none',
        //     duration: 2000
        //   })
        //   setTimeout(function () {
        //     wx.reLaunch({
        //       url: '/pages/login/login'
        //     })
        //   }, 2000)
        } else {
          success(res.data)
        }

      } else {
        wx.showToast({
          title: '数据异常',
          icon: 'none',
          duration: 2000
        })
      }

    },
    fail: function (res) {
      wx.hideNavigationBarLoading()
      if (message != "") {
        wx.hideLoading()
      }
      wx.showToast({
        title: '网络异常',
        icon: 'none',
        duration: 2000
      })
    },
    complete: function (res) {

    },
  })
}



module.exports = {
  requestLoading: requestLoading,
  baseURL,
  get(url, params = {}, load = '') {
    return http({
      url,
      params,
      load
    })
  },
  post(url, params = {}, load = '') {
    return http({
      url,
      params,
      load,
      method: 'post'
    })
  }
}
