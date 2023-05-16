<script setup lang="ts">
import { onMounted, ref } from 'vue';
import API_GOODS from '@/apis/goods';
import { goodReputationModel } from '@/model/modules/good/reputation';

const props = defineProps({
  goodsId: { type: [String, Number] },
});

// 商品评价
onMounted(() => {
  getGoodsReputation();
});

const reputationList = ref<Recordable>([]);
const reputationTotal = ref(0);

function getGoodsReputation() {
  API_GOODS.goodsReputation({ goodsId: props.goodsId, page: 1, pageSize: 1 }).then((res) => {
    const records = res.data?.result ?? [];
    const total = res.data?.totalRow ?? 0;
    if (records.length) {
      reputationTotal.value = total;
      reputationList.value = goodReputationModel(records);
    }
  });
}
</script>

<template>
  <div class="reputation">
    <van-cell
      v-if="reputationList.length"
      :to="'/good/reputation?goodsId=' + goodsId"
      class="mb10"
      :title="'评价(' + reputationTotal + ')'"
      value="全部评价"
      is-link
    />
    <van-cell v-else class="mb10" title="商品评价" value="暂无评价" />
    <div v-for="(item, index) in reputationList" :key="index" class="reputation-inner">
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

<style lang="less" scoped>
.mb10 {
  margin-bottom: 10px;
}

.reputation {
  background: var(--color-bg-2);

  &-inner {
    padding: 0 15px;
    font-size: 14px;

    &-hd {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 10px;
      font-size: 14px;
      color: var(--color-text-1);
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
      border: 1px solid var(--color-border-1);
      font-size: 10px;
      color: var(--color-text-3);
      margin-right: 10px;
    }

    &-bd {
      padding: 10px 0;
    }

    &-ft {
      padding: 5px 0 10px;
      color: var(--color-text-3);
    }

    &-prop {
      margin-top: 5px;
      font-size: 12px;
    }
  }
}
</style>
