/**
 * Created by Gakki on 2017/9/26.
 */
'use strict';
var Hogan = require('hogan');
var conf = {
    serverHost:''
};

var _mm = {
  // 网络请求
  request : function (param) {
      var _this = this; // 为了让error取到doLogin
      $.ajax({
          type:         param.method    || 'get',
          url:          param.url       || '',
          dataType :    param.type      || 'json',
          data:         param.data      || '',
          success:function (res) {
                // 请求成功
                if(0 === res.status){
                    typeof param.success === 'function' && param.success(res.data,res.msg);
                }
                // 没有登录状态，需要强制登录
                else if(10 === res.status){
                    _this.doLogin();
                }
                // 请求数据错误
                else if(1 === res.status){
                    typeof param.error === 'function' && param.error(res.msg);
                }
          },
          error:function (err) {
              typeof param.error === 'function' && param.error(err.statusText);
          }


      })
  },

  // 获取服务器地址
  getServerUrl: function (path) {
      return conf.serverHost + path;
  },

  // 获取URl参数
  getUrlParam: function (name) {
      var reg  = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
      var result = window.location.search.substr(1).match(reg);
      return result ? decodeURIComponent(result[2]) : null;
  },
    
  // 渲染HTML模板（需要使用Hogan的组件，要先初始化Hogan）,hogan是先编译后渲染，这个方法使两步变为一步
  renderHtml: function (htmlTemplate,data) {
      var template = Hogan.compile(htmlTemplate),
      result = template.render(data);
      return result;
  },
  // 成功提示
  successTips: function (msg) {
      alert(msg || '操作成功');
  },
  // 错误提示
  errorTips: function (msg) {
      alert(msg || '哪里不对了~')
  },
  // 字段的验证，支持非空空，手机，邮箱判断
  validate: function (value,type) {
      var value = $.trim(value); /* 转为字符串类型 */
      // 非空验证
      if('require' === type){
          return !!value;
      }
      // 手机号验证
      if('phone' === type){
          return /^1\d{10}$/.test(value);
      }
      // 邮箱格式验证
      if('email' === type){
          return /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value);
      }
  },
  // 同一登录处理
  doLogin: function () {
      window.location.href = './login.html?redirct='+encodeURIComponent(window.location.href)
      // 参数为了告诉login你是从哪跳过去的，传入当前页面的路径，但是如果当前路径有特殊字符的话，可能会被截断，所以要将他编码

  },
  goHome: function () {
     window.location.href = './index.html';
  }
};

module.exports = _mm;