<template>
  <div class="reputation">
    <van-cell
      v-if="list.length"
      :to="'/good/reputation?goodsId=' + goodsId"
      class="mb10"
      :title="'评价(' + total + ')'"
      value="全部评价"
      is-link
    />
    <van-cell v-else class="mb10" title="商品评价" value="暂无评价" />
    <div v-for="(item, index) in list" :key="index" class="reputation-inner">
      <div class="reputation-inner-hd">
        <van-image class="reputation-inner-media" :src="item.avatarUrl" />
        <div class="reputation-inner-name">{{ item.nickName }}</div>
        <div class="reputation-inner-stars">
          <van-rate v-model="item.rate" :size="14" color="#f44" void-icon="star" void-color="#eee" readonly />
        </div>
      </div>
      <!-- <div class="reputation-inner-bd"> -->
      <!-- <span class="reputation-inner-tag">质量不错</span> -->
      <!-- <span class="reputation-inner-tag">下次再来</span> -->
      <!-- </div> -->
      <div class="reputation-inner-ft">
        <div>{{ item.remark }}</div>
        <div class="reputation-inner-prop">{{ item.property }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    goodsId: [String, Number],
    total: [String, Number],
    list: Array,
  },
};
</script>

<style lang="less" scoped>
.mb10 {
  margin-bottom: 10px;
}

.reputation {
  background: #fff;

  &-inner {
    padding: 0 15px;
    font-size: 14px;

    &-hd {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 10px;
      font-size: 14px;
      color: var(--gray-color-8);
    }

    &-media {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 5px;
    }

    &-name {
      flex: 1;
    }

    &-stars {
    }

    &-tag {
      padding: 2px 10px;
      border-radius: 10px;
      border: 1px solid var(--gray-color-3);
      font-size: 10px;
      color: var(--gray-color-6);
      margin-right: 10px;
    }

    &-bd {
      padding: 10px 0;
    }

    &-ft {
      padding: 5px 0 10px;
      color: var(--gray-color-6);
    }

    &-prop {
      margin-top: 5px;
      font-size: 12px;
    }
  }
}
</style>
