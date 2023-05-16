<script lang="ts">
export default {
  name: 'Category',
};
</script>

<script setup lang="ts">
import { onMounted, ref, unref, reactive } from 'vue';
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
  listRef.value?.refresh();
}

function getCategoryList() {
  API_GOODS.goodsCategoryAll().then((res) => {
    if (res.data?.length) {
      categoryList.value = res.data.map((v: Recordable) => ({ ...v, text: v.name }));
      listRef.value?.loadData();
    }
  });
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
    categoryId: unref(categoryList.value)[categoryIndex.value].id,
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
    <div class="main">
      <van-sidebar v-model="categoryIndex" class="sidebar" @change="onCategoryChange">
        <van-sidebar-item v-for="item in categoryList" :key="item.id" :title="item.name" />
      </van-sidebar>
      <div class="right-content scroller-y">
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
          </div>
        </ProList>
      </div>
    </div>
    <!-- 底部导航栏 -->
    <Tabbar />
  </div>
</template>

<style lang="less" scoped>
.main {
  height: calc(100vh - 50px - var(--safe-area-height-bottom));
  display: flex;
}

.sidebar {
  // margin-right: 10px;
  width: 100px;
  height: 100%;
  background-color: var(--color-bg-1);
}

.right-content {
  flex: 1;
  background: var(--color-bg-2);
}

.list {
  display: flex;
  flex-wrap: wrap;

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
