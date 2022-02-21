<template>
  <div class="container">
    <div class="main">
      <van-sidebar v-model="categoryIndex" class="sidebar" @change="onCategoryChange">
        <van-sidebar-item v-for="item in categoryList" :key="item.id" :title="item.name" />
      </van-sidebar>
      <div class="right-content">
        <van-list
          v-model="listLoading"
          class="list"
          :finished="listFinished"
          :finished-text="listFinishedText"
          :error.sync="listError"
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

<script>
import Tabbar from '@/components/Tabbar';
import API_GOODS from '@/apis/goods';

export default {
  components: {
    Tabbar,
  },
  data() {
    return {
      categoryIndex: 0,
      categoryList: [],

      list: [],
      listLoading: false,
      listFinished: false,
      listError: false,
      listFinishedText: '没有更多了',
      listErrorText: '请求失败，点击重新加载',
      listEmptyText: '暂无商品',
      listEmptyImage: require('@/assets/images/empty/good.png'),
      pageCurrent: 1,
      pageSize: 10,
    };
  },
  created() {
    this.getCategoryList();
  },
  methods: {
    getCategoryList() {
      API_GOODS.goodsCategoryAll().then((res) => {
        if (res.data?.length) {
          this.categoryList = res.data.map((v) => ({ ...v, text: v.name }));
        }
        this.onPage();
      });
    },
    onCategoryChange() {
      if (!this.listLoading) {
        this.listFinished = false;
        this.list = [];
        this.pageCurrent = 1;
        this.onPage();
      }
    },
    onGoodClicked(id) {
      this.$router.push({ path: '/good/detail', query: { id } });
    },
    onPageLoad() {
      if (this.listFinished) {
        return;
      }
      this.pageCurrent += 1;
      this.onPage();
    },
    onPage() {
      this.listLoading = true;

      const params = {
        categoryId: this.categoryList[this.categoryIndex].id,
        page: this.pageCurrent,
        pageSize: this.pageSize,
      };

      API_GOODS.goodsList(params)
        .then((res) => {
          const records = res.data?.result ?? [];
          const total = res.data?.totalRow ?? 0;

          this.list = this.pageCurrent === 1 ? records : this.list.concat(records);
          this.listLoading = false;
          this.listFinished = this.list.length >= total;
        })
        .catch((error) => {
          console.error(error);
          this.listLoading = false;
          this.listError = true;
        });
    },
  },
};
</script>

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

  ::v-deep .van-list__loading,
  ::v-deep .van-list__finished-text,
  ::v-deep .van-list__error-text {
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
      padding: 5px 10px;
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
