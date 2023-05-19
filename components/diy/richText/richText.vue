<template>
<view>
<!-- 富文本 -->

<view class="diy-richText" :style="'padding: ' + itemStyle.paddingTop + 'px ' + itemStyle.paddingLeft + 'px; background: ' + itemStyle.background + ';'">
  <jyf-parser :html="article_content"></jyf-parser>
</view>
</view>
</template>

<script>

export default {
  data() {
    return {
      article_content: ""
    };
  },

  components: {
  },
  props: {
    itemIndex: String,
    itemStyle: Object,
    params: Object
  },
  options: {
    addGlobalClass: true
  },
  mounted: function () {
    let content = this.params.content; // 富文本转码

    if (content.length > 0) {
      //wxParse.wxParse('content', 'html', content, this, 0)
      setTimeout(() => {
        this.article_content = content;
      }, 200);
    }
  },
  methods: {}
};
</script>
<style>
@import "./richText.css";
</style>