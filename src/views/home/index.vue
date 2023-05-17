<script lang="ts">
export default {
  name: 'Home',
};
</script>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import API_GOODS from '@/apis/goods';
import API_BANNER from '@/apis/banner';
import IMAGE_LIST_EMPTY from '@/assets/images/empty/good.png';

onMounted(() => {
  getBannerList();
  listRef.value?.loadData();
});

const router = useRouter();

const bannerList = ref<Recordable[]>([]);

function getBannerList() {
  API_BANNER.bannerList({ type: 'indexBanner' }).then((res) => {
    bannerList.value = res.data || [];
  });
}

function onBannerClicked(linkUrl: string) {
  if (linkUrl) {
    window.location.href = linkUrl;
  }
}

const listRef = ref<any>(null);
const list = ref<Recordable[]>([]);
const pagination = reactive({
  pageCurrent: 1,
  pageSize: 10,
});
const listMeta = reactive({
  loadingText: '努力加载中...',
  emptyText: '暂无商品',
  emptyImage: IMAGE_LIST_EMPTY,
});

function getGoodList() {
  const params = {
    page: pagination.pageCurrent,
    pageSize: pagination.pageSize,
  };

  return API_GOODS.goodsList(params);
}

function onGoodClicked(id: number) {
  router.push({ path: '/good/detail', query: { id } });
}
</script>

<template>
  <div class="container">
    <div class="swiper">
      <van-swipe :autoplay="5000" class="swiper">
        <van-swipe-item
          v-for="item in bannerList"
          :key="item.id"
          class="swiper-item"
          @click="onBannerClicked(item.linkUrl)"
        >
          <van-image class="swiper-item-img" fit="cover" :src="item.picUrl" :alt="item.title" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="main">
      <Plate class="section-header" title="商品列表" />
      <ProList
        ref="listRef"
        v-model:dataSource="list"
        mode="infinite"
        :api="getGoodList"
        :pagination="pagination"
        :meta="listMeta"
      >
        <div class="list">
          <div v-for="item in list" :key="item.id" class="list-col">
            <div class="list-item" @click="onGoodClicked(item.id)">
              <div v-if="item.recommendStatus" class="list-item-badge">推荐</div>
              <van-image class="list-item-photo" :src="item.pic" :alt="item.name" />
              <div class="list-item-info">
                <div class="list-item-title">{{ item.name }}</div>
                <div class="list-item-price">
                  <div class="price">
                    <div class="price-current">
                      <span class="price-current-symbol">¥</span>
                      <span class="price-current-integer">{{ item.minPrice }}</span>
                    </div>
                    <div v-if="item.originalPrice > 0" class="price-origin">
                      <span class="price-origin-symbol">¥</span>
                      <span class="price-origin-integer">{{ item.originalPrice }}</span>
                    </div>
                  </div>
                  <van-button type="primary" plain class="buy-btn">购买</van-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProList>
    </div>
    <!-- 底部导航栏 -->
    <Tabbar />
  </div>
</template>

<style lang="less" scoped>
.swiper {
  width: 100%;
  height: 180px;
  margin-bottom: 10px;

  &-item,
  &-item-img {
    width: 100%;
    height: 100%;
  }
}

.list {
  display: flex;
  flex-wrap: wrap;
  padding-left: 5px;
  padding-right: 5px;

  &-col {
    width: 50%;
    box-sizing: border-box;
    padding-left: 5px;
    padding-right: 5px;
    margin-bottom: 10px;
  }

  &-item {
    position: relative;
    text-align: left;
    overflow: hidden;
    background: var(--color-bg-2);
    border-radius: 8px;
    // box-shadow: 0px 2px 4px 3px rgba(243, 243, 243, 0.5);

    &-badge {
      position: absolute;
      top: 15px;
      left: 0;
      z-index: 20;
      display: inline-block;
      padding: 2px 4px;
      color: #fff;
      background-color: var(--color-red);
      font-size: 10px;
      line-height: normal;
      border-radius: 0 8px 8px 0;
      padding-right: 6px;
    }

    &-photo {
      display: flex;
      width: 100%;
      height: 172px;
    }

    &-info {
      padding: 5px 10px;
    }

    &-title {
      font-size: 14px;
      color: var(--color-text-1);
      min-height: 36px;
      line-height: 18px;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    &-price {
      margin-top: 5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .buy-btn {
      height: 24px;
      padding: 0 8px;
      line-height: 24px;
    }

    .price {
      display: flex;
      align-items: center;

      &-current {
        margin-right: 5px;
        color: var(--color-primary);

        &-symbol {
          font-size: 12px;
          margin-right: 2px;
        }

        &-integer {
          font-size: 18px;
          font-family: @font-family-price-integer;
        }
      }

      &-origin {
        font-size: 12px;
        text-decoration: line-through;
        color: var(--color-text-3);

        &-label {
          margin-right: 2px;
        }

        &-integer {
          text-decoration: line-through;
          font-family: @font-family-price-integer;
        }
      }
    }
  }
}
</style>
