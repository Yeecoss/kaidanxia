/**
 * 工具类
 */
module.exports = {
  /**
   * scene解码
   */
  scene_decode(e) {
    if (e === undefined) return {};
    let scene = decodeURIComponent(e),
        params = scene.split(','),
        data = {};

    for (let i in params) {
      var val = params[i].split(':');
      val.length > 0 && val[0] && (data[val[0]] = val[1] || null);
    }

    return data;
  },

  /**
   * 格式化日期格式 (用于兼容ios Date对象)
   */
  format_date(time) {
    // 将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式 
    return time.replace(/\-/g, "/");
  },

  /**
   * 对象转URL
   */
  urlEncode(data) {
    var _result = [];

    for (var key in data) {
      var value = data[key];

      if (value.constructor == Array) {
        value.forEach(_value => {
          _result.push(key + "=" + _value);
        });
      } else {
        _result.push(key + '=' + value);
      }
    }

    return _result.join('&');
  },

  /**
   * 遍历对象
   */
  objForEach(obj, callback) {
    Object.keys(obj).forEach(key => {
      callback(obj[key], key);
    });
  },

  /**
   * 是否在数组内
   */
  inArray(search, array) {
    for (var i in array) {
      if (array[i] == search) {
        return true;
      }
    }

    return false;
  },

  /**
   * 判断是否为正整数
   */
  isPositiveInteger(value) {
    return /(^[0-9]\d*$)/.test(value);
  },

  /**
   * 对Date的扩展，将 Date 转化为指定格式的String
   * 月(Y)、月(m)、日(d)、小时(H)、分(M)、秒(S) 可以用 1-2 个占位符，
   * 例子：
   * dateFormat('YYYY-mm-dd HH:MM:SS', new Date()) ==> 2020-01-01 08:00:00
   */
  dateFormat(fmt, date) {
    const opt = {
      "Y+": date.getFullYear().toString(),
      // 年
      "m+": (date.getMonth() + 1).toString(),
      // 月
      "d+": date.getDate().toString(),
      // 日
      "H+": date.getHours().toString(),
      // 时
      "M+": date.getMinutes().toString(),
      // 分
      "S+": date.getSeconds().toString() // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串

    };
    let ret;

    for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);

      if (ret) {
        fmt = fmt.replace(ret[1], ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0"));
      }

      ;
    }

    ;
    return fmt;
  },
	music : {
			//因为这个音效听起来是de的声音，所以我取这个函数名，方便记忆音效，找的合适的场景就能想起来。
			play_dede(){
				const innerAudioContext = uni.createInnerAudioContext();
				innerAudioContext.autoplay = true;
				innerAudioContext.src = '/static/5383.wav';
				innerAudioContext.onPlay(() => {
			  	// console.log('开始播放');
				});
				innerAudioContext.onError((res) => {});
		},
  },
  checkForAuthorization(scope){
    return new Promise((resolve,reject)=>{
        uni.getSetting({
            success(res) {
                // console.log(res.authSetting)
                if (!res.authSetting[scope]) {
                    uni.authorize({
                        scope,
                        success() {
                            resolve()
                        },
                        fail() {
                            uni.hideLoading();
                            uni.showModal({
                                title: '温馨提示',
                                content: '您已拒绝授权，是否去设置打开？',
                                confirmText: "确认",
                                cancelText: "取消",
                                success: function(res) {
                                    // console.log(res);
                                    if (res.confirm) {
                                        uni.hideLoading();
                                        uni.openSetting({
                                            success: (res) => {
                                                res.authSetting[scope] = true
                                                resolve()
                                            }
                                        });
                                    } else {
                                        reject({errMsg:'用户拒绝授权'})
                                    }
                                },
                                fail(res) {
                                    reject(res)
                                }
                            });

                        }
                    })
                } else {
                    resolve()
                }
            },
            fail(res) {
                reject(res)
            }
        })
    })
  }
};