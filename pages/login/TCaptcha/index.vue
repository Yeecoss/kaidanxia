<template>
	<div>
	</div>
</template>
<script>

export default {
  data() {
    return {
    };
  },

  components: {
  },
  props: {
	},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },
  mounted() {
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = 'https://ssl.captcha.qq.com/TCaptcha.js';
    document.body.appendChild(s);
    setTimeout(() => {
      var captcha1 = new TencentCaptcha('appId', function(res) {/* callback */});
      captcha1.show();
    }, 10000)
  },
  methods: {
    async unit() {
      if (this.CanvaButton) {
        this.api = await window.CanvaButton.initialize({
          apiKey: 'l4Z7jtzgfuKP0K8ECMJ1kVJ0'
        });
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>