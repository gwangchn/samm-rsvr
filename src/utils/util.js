/*
 * @Notes:  定义一个vue全局的工具库 this.$util
 */
export default function (Vue) {
  /*
   *   des:        水利起始时间
   *   @hour:      标准判断小时值
   *               当前时间小于hour: 返回前一天hour
   *               当前时间大于等于hour: 返回当天hour
   *   @return:    date类型时间
   *   ex:         new Date().dateStart()
   */
  Date.prototype.dateStart = function (hour) {
    var hour = hour || 8,
      format = 'yyyy-MM-dd ' + (hour.toString().length == 1 ? '0' + hour.toString() : hour.toString()) + ':00';

    if (this.getHours() >= hour) {
      return this.formatDate(format).toDate();
    } else {
      return this.datePro('{%d-1}').formatDate(format).toDate();
    }
  };

  /*
   *   des:        时间格式化
   *   @formatStr: 格式化参数
   *   @return:    string类型时间
   *   ex:         new Date().formatDate('yyyy-MM-dd')
   */
  Date.prototype.formatDate = function (formatStr) {
    if (!formatStr || typeof formatStr != 'string') formatStr = "yyyy-MM-dd HH:mm";
    var dict = {
      "yyyy": this.getFullYear(),
      "M": this.getMonth() + 1,
      "d": this.getDate(),
      "H": this.getHours(),
      "m": this.getMinutes(),
      "s": this.getSeconds(),
      "MM": ("" + (this.getMonth() + 101)).substr(1),
      "dd": ("" + (this.getDate() + 100)).substr(1),
      "HH": ("" + (this.getHours() + 100)).substr(1),
      "mm": ("" + (this.getMinutes() + 100)).substr(1),
      "ss": ("" + (this.getSeconds() + 100)).substr(1)
    };
    return formatStr.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function () {
      return dict[arguments[0]];
    });
  };

  /*
   *   des:        时间操作
   *   @proStr:    格式化参数
   *   @return:    date类型时间
   *   ex:         new Date().datePro('{%y+1}-{%M+2}-{%d+1}-{%H+1}-{%m+1}-{%s+1}') //年月日时分秒全部加1
   */
  Date.prototype.datePro = function (proStr) {
    var dealWith = function (str, date) {
      var t = str.substr(0, 1),
        num = 0;
      if (str.indexOf('+') > -1) {
        num = str.substr(str.indexOf('+'));
      } else if (str.indexOf('-') > -1) {
        num = str.substr(str.indexOf('-'));
      }
      switch (t) {
        case 'y':
          date.setFullYear(date.getFullYear() + parseInt(num));
          break;
        case 'M':
          date.setMonth(date.getMonth() + parseInt(num));
          break;
        case 'd':
          date.setDate(date.getDate() + parseInt(num));
          break;
        case 'H':
          date.setHours(date.getHours() + parseInt(num));
          break;
        case 'm':
          date.setMinutes(date.getMinutes() + parseInt(num));
          break;
        case 's':
          date.setSeconds(date.getSeconds() + parseInt(num));
          break;
      }
      return date;
    }

    var arr = [],
      date;
    arr = proStr.split('{%');
    for (var i = 1; i < arr.length; i++) {
      arr[i] = arr[i].replace('}-', '');
      arr[i] = arr[i].replace('}', '');
      date = dealWith(arr[i], this);
    }
    return date;
  };

  /*
   *   des:        字符串转时间
   *   @return:    date类型时间
   *   ex:         '1991-01-01 08:00'.toDate()
   */
  String.prototype.toDate = function () {
    var date = this.toString();
    //IE
    if (!!window.ActiveXObject || "ActiveXObject" in window) {
      var result = new Date();
      if (date.length <= 10) {
        var str = date.split('-');
        result.setUTCFullYear(str[0], str[1] ? str[1] - 1 : 0, str[2] ? str[2] : 1);
        result.setUTCHours(-8, 0, 0, 0);
      } else {
        var strs = date.trim().split(" ");
        var one = strs[0].split('-'),
          two = strs[1].split(':');
        result.setUTCFullYear(one[0], one[1] ? one[1] - 1 : 0, one[2] ? one[2] : 1);
        result.setUTCHours(two[0] - 8, two[1] ? two[1] : 0, two[2] ? two[2] : 0, 0);
      }
      return result;
    } else {
      //火狐
      if (navigator.userAgent.indexOf('Firefox') > -1) {
        date = new Date(date.replace(/ /g, 'T').replace(/\//g, "-"));
      } else {
        date = new Date(date.replace(/T/g, ' ').replace(/-/g, "/"));
      }
    }
    return date;
  };
  /*
   *   des:        用正则表达式将前后空格去掉
   *   @return:    颜色格式转换
   *   ex:         " #FF0000 ".trim()
   */
  String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
  };

  /*
   *   des:        时间格式化(整十分钟)
   *   @formatStr: 格式化参数
   *   @return:    string类型时间
   *   ex:         new Date().formatMinute('yyyy-MM-dd')
   */
  Date.prototype.formatMinute = function (formatStr) {
    if (!formatStr || typeof formatStr != 'string') formatStr = "yyyy-MM-dd HH:m:00";
    var dict = {
      "yyyy": this.getFullYear(),
      "M": this.getMonth() + 1,
      "d": this.getDate(),
      "H": this.getHours(),
      "m": parseInt(this.getMinutes() / 10) * 10,
      "s": this.getSeconds(),
      "MM": ("" + (this.getMonth() + 101)).substr(1),
      "dd": ("" + (this.getDate() + 100)).substr(1),
      "HH": ("" + (this.getHours() + 100)).substr(1),
      "mm": ("" + (this.getMinutes() + 100)).substr(1),
      "ss": ("" + (this.getSeconds() + 100)).substr(1)
    };
    return formatStr.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function () {
      return dict[arguments[0]];
    });
  };
  
  Vue.prototype.$util = {
    //时间格式化
    formatDate: function (date, format) {
      if (!date) return;
      if (!format || typeof (format) != "string") format = "yyyy-MM-dd";
      switch (typeof date) {
        case "string":
          date = new Date(date.replace('T', ' ').replace(/-/, "/"));
          break;
        case "number":
          date = new Date(date);
          break;
      }
      if (!(date instanceof Date)) return;
      var dict = {
        "yyyy": date.getFullYear(),
        "M": date.getMonth() + 1,
        "d": date.getDate(),
        "H": date.getHours(),
        "m": date.getMinutes(),
        "s": date.getSeconds(),
        "MM": ("" + (date.getMonth() + 101)).substr(1),
        "dd": ("" + (date.getDate() + 100)).substr(1),
        "HH": ("" + (date.getHours() + 100)).substr(1),
        "mm": ("" + (date.getMinutes() + 100)).substr(1),
        "ss": ("" + (date.getSeconds() + 100)).substr(1)
      };
      return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function () {
        return dict[arguments[0]];
      });
    },
    delOneData: function (index, data) {
      let del = confirm("是否删除");
      if (del == true)
        data.splice(index, 1);
    },
    debounce(func, wait, immediate) {
      let timeout, args, context, timestamp, result

      const later = function () {
        // 据上一次触发时间间隔
        const last = +new Date() - timestamp

        // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
        if (last < wait && last > 0) {
          timeout = setTimeout(later, wait - last)
        } else {
          timeout = null
          // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
          if (!immediate) {
            result = func.apply(context, args)
            if (!timeout) context = args = null
          }
        }
      }

      return function (...args) {
        context = this
        timestamp = +new Date()
        const callNow = immediate && !timeout
        // 如果延时不存在，重新设定延时
        if (!timeout) timeout = setTimeout(later, wait)
        if (callNow) {
          result = func.apply(context, args)
          context = args = null
        }

        return result
      }
    },
    //格式化水位的  强制保留两位小数
    convertZ: function (p) {
      p = parseFloat(p);

      if (isNaN(p)) {
        //console.error('convertP 第一个参数必须数字或数字类型字符串');
        return '';
      }

      return p.toFixed(2);
    },
    //格式化雨量的  强制保留一位小树
    convertP: function (p) {
      p = parseFloat(p);

      if (isNaN(p)) {
        //console.error('convertP 第一个参数必须数字或数字类型字符串');
        return '';
      }

      return p.toFixed(1);
    },
    //格式化流量的  取整
    convertQ: function (p) {
      p = parseInt(p);

      if (isNaN(p)) {
        //console.error('convertP 第一个参数必须数字或数字类型字符串');
        return '';
      }

      return p;
    }
  };
  /*RGB颜色转换为16进制*/
  String.prototype.colorHex = function () {
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    var that = this;
    if (/^(rgb|RGB)/.test(that)) {
      var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
      var strHex = "#";
      for (var i = 0; i < aColor.length; i++) {
        var hex = Number(aColor[i]).toString(16);
        if (hex === "0") {
          hex += hex;
        }
        strHex += hex;
      }
      if (strHex.length !== 7) {
        strHex = that;
      }
      return strHex;
    } else if (reg.test(that)) {
      var aNum = that.replace(/#/, "").split("");
      if (aNum.length === 6) {
        return that;
      } else if (aNum.length === 3) {
        var numHex = "#";
        for (var i = 0; i < aNum.length; i += 1) {
          numHex += (aNum[i] + aNum[i]);
        }
        return numHex;
      }
    } else {
      return that;
    }
  };
  String.prototype.colorRgb = function () {
    var sColor = this.toLowerCase();
    if (sColor && reg.test(sColor)) {
      if (sColor.length === 4) {
        var sColorNew = "#";
        for (var i = 1; i < 4; i += 1) {
          sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
        }
        sColor = sColorNew;
      }
      //处理六位的颜色值
      var sColorChange = [];
      for (var i = 1; i < 7; i += 2) {
        sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
      }
      //return "RGB(" + sColorChange.join(",") + ")";
      return sColorChange;
    } else {
      return sColor;
    }
  };
  // 事件bus
  Vue.prototype.$eventBus = new Vue();
  // 路由跳转
  Vue.prototype.$goRoute = function (index) {
    this.$router.push(index)
  };
}
