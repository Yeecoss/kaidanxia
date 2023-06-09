
module.exports = {
  data() {
    return {};
  },

  props: {
    loading: Boolean,
    // 在自定义组件中，无法与外界的 form 组件联动，暂时不开放
    // formType: String,
    openType: String,
    appParameter: String,
    // 暂时不开放，直接传入无法设置样式
    // hoverClass: {
    //   type: String,
    //   value: 'button-hover'
    // },
    hoverStopPropagation: Boolean,
    hoverStartTime: {
      type: Number,
      default: 20
    },
    hoverStayTime: {
      type: Number,
      default: 70
    },
    lang: {
      type: String,
      default: 'en'
    },
    sessionFrom: {
      type: String,
      default: ''
    },
    sendMessageTitle: String,
    sendMessagePath: String,
    sendMessageImg: String,
    showMessageCard: String
  },
  methods: {
    bindgetuserinfo: function bindgetuserinfo() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$detail = _ref.detail,
          detail = _ref$detail === undefined ? {} : _ref$detail;

      this.$emit('getuserinfo', detail);
    },
    bindcontact: function bindcontact() {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref2$detail = _ref2.detail,
          detail = _ref2$detail === undefined ? {} : _ref2$detail;

      this.$emit('contact', detail);
    },
    bindgetphonenumber: function bindgetphonenumber() {
      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref3$detail = _ref3.detail,
          detail = _ref3$detail === undefined ? {} : _ref3$detail;

      this.$emit('getphonenumber', detail);
    },
    bindopensetting: function bindopensetting() {
      var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref4$detail = _ref4.detail,
          detail = _ref4$detail === undefined ? {} : _ref4$detail;

      this.$emit('opensetting', detail);
    },
    binderror: function binderror() {
      var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref5$detail = _ref5.detail,
          detail = _ref5$detail === undefined ? {} : _ref5$detail;

      this.$emit('error', detail);
    }
  }
};