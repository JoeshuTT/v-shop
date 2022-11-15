<script lang="ts">
export default {
  name: 'Category',
};
</script>

<script lang="ts" setup>
import { onMounted, ref, unref } from 'vue';
import { useRouter } from 'vue-router';
import API_GOODS from '@/apis/goods';
import IMAGE_LIST_EMPTY from '@/assets/images/empty/good.png';

onMounted(() => {
  getCategoryList();
});

const router = useRouter();

const categoryIndex = ref(0);
const categoryList = ref<Recordable[]>([]);

function onCategoryChange() {
  if (!listLoading.value) {
    listFinished.value = false;
    list.value = [];
    pageCurrent.value = 1;
    onPage();
  }
}

function getCategoryList() {
  API_GOODS.goodsCategoryAll().then((res) => {
    if (res.data?.length) {
      categoryList.value = res.data.map((v: Recordable) => ({ ...v, text: v.name }));
    }
    onPage();
  });
}

const list = ref<Recordable[]>([]);
const listLoading = ref(false);
const listFinished = ref(false);
const listError = ref(false);
const listFinishedText = ref('没有更多了');
const listErrorText = ref('请求失败，点击重新加载');
const listEmptyText = ref('暂无商品');
const listEmptyImage = IMAGE_LIST_EMPTY;
const pageCurrent = ref(1);
const pageSize = ref(20);

function onPageLoad() {
  if (listFinished.value) {
    return;
  }
  pageCurrent.value += 1;
  onPage();
}

function onPage() {
  listLoading.value = true;

  const params = {
    categoryId: categoryList.value[categoryIndex.value].id,
    page: unref(pageCurrent),
    pageSize: unref(pageSize),
  };

  API_GOODS.goodsList(params)
    .then((res) => {
      const records = res.data?.result ?? [];
      const total = res.data?.totalRow ?? 0;

      list.value = unref(pageCurrent) === 1 ? records : unref(list).concat(records);
      listLoading.value = false;
      listFinished.value = list.value.length >= total;
    })
    .catch((error) => {
      console.error(error);
      listLoading.value = false;
      listError.value = true;
    });
}

function onGoodClicked(id: number) {
  router.push({ path: '/good/detail', query: { id } });
}
</script>

<template>
  <div class="container">
    <div class="main">
      <van-sidebar v-model="categoryIndex" class="sidebar" @change="onCategoryChange">
        <van-sidebar-item v-for="item in categoryList" :key="item.id" :title="item.name" />
      </van-sidebar>
      <div class="right-content">
        <van-list
          v-model:loading="listLoading"
          v-model:error="listError"
          class="list"
          :finished="listFinished"
          :finished-text="listFinishedText"
          :error-text="listErrorText"
          :immediate-check="false"
          @load="onPageLoad"
        >
          <div v-for="item in list" :key="item.id" class="list-col">
            <div class="list-item" @click="onGoodClicked(item.id)">
              <van-image class="list-item-photo" :src="item.pic" :alt="item.name" />
              <div class="list-item-info">
                <div class="list-item-title">{{ item.name }}</div>
                <div class="list-item-price">
                  <div class="price">
                    <div class="price-current">
                      <span class="price-current-symbol">¥</span>
                      <span class="price-current-integer">{{ item.minPrice }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <template #finished>
            <span v-if="list.length">{{ listFinishedText }}</span>
            <van-empty v-else :image="listEmptyImage" :description="listEmptyText" />
          </template>
        </van-list>
      </div>
    </div>
    <!-- 底部导航栏 -->
    <Tabbar />
  </div>
</template>

<style lang="less" scoped>
.main {
  height: calc(100vh - 50px - constant(safe-area-inset-bottom));
  height: calc(100vh - 50px - env(safe-area-inset-bottom));
  display: flex;
  background: var(--white);
}

.sidebar {
  // margin-right: 10px;
  width: 100px;
  height: 100%;
  background-color: var(--gray-color-1);
}

.right-content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.list {
  display: flex;
  flex-wrap: wrap;

  :deep(.van-list__loading),
  :deep(.van-list__finished-text),
  :deep(.van-list__error-text) {
    width: 100%;
  }

  &-col {
    width: 50%;
    box-sizing: border-box;
    padding-left: 5px;
    padding-right: 5px;
    margin-bottom: 10px;
  }

  &-item {
    position: relative;
    overflow: hidden;
    background: var(--white);

    &-badge {
      position: absolute;
      top: 15px;
      left: 0;
      z-index: 20;
      display: inline-block;
      padding: 2px 4px;
      color: var(--white);
      background-color: var(--red-color);
      font-size: 10px;
      line-height: normal;
      border-radius: 0 8px 8px 0;
      padding-right: 6px;
    }

    &-photo {
      display: flex;
      width: 100%;
      height: 127px;
    }

    &-info {
      padding: 5px 0;
    }

    &-title {
      font-size: 14px;
      color: var(--gray-color-8);
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
        color: var(--brand-color);

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
        color: var(--gray-color-6);

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
