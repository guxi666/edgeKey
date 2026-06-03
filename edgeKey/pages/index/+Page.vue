<template>
  <div class="space-y-8">

    <section class="home-hero-stage relative pt-12">
      <img class="hero-img pointer-events-none" :src="homeHeroImageUrl" alt="hero-img">
      <div class="hero-glass relative rounded-box shadow-sm overflow-hidden">
        <!-- 背景装饰 -->
        <div class="pointer-events-none absolute inset-0 opacity-[0.03]" aria-hidden="true">
          <div class="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary"></div>
          <div class="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-secondary"></div>
        </div>

        <div class="relative flex flex-col gap-6 px-8 py-8 lg:flex-row lg:items-center lg:justify-between">
          <!-- 左侧文字 -->
          <div class="space-y-4 max-w-lg">
            <div class="badge badge-primary badge-outline font-semibold tracking-widest uppercase">
              {{ site.siteSubtitle || 'Welcome' }}
            </div>
            <p v-if="site.notice" class="text-base-content/60 text-sm leading-relaxed border-l-2 border-primary pl-3">
              {{ site.notice }}
            </p>
          </div>

          <!-- 右侧统计 -->
          <div class="stats stats-glass shrink-0 shadow max-lg:w-full lg:mr-32">
            <!-- <div class="stat">
              <div class="stat-figure text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 10h16M4 14h8" />
                </svg>
              </div>
              <div class="stat-title">商品分类</div>
              <div class="stat-value text-primary">{{ catalog.categories.length }}</div>
            </div> -->
            <div class="stat">
              <div class="stat-title text-center">在售商品</div>
              <div class="flex text-secondary">
                <div class="stat-value mr-2 text-secondary">{{ catalog.products.length }}</div>
                <div class="stat-figure flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="size-8" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-semibold">商品列表</h2>
      </div>

      <div v-if="catalog.categories.length" class="flex flex-wrap gap-2 mb-6">
        <button
          class="btn btn-sm"
          :class="activeCategoryId === null ? 'btn-primary' : 'btn-outline'"
          @click="activeCategoryId = null"
        >
          全部商品
        </button>
        <button
          v-for="category in catalog.categories"
          :key="category.id"
          class="btn btn-sm"
          :class="activeCategoryId === category.id ? 'btn-primary' : 'btn-outline'"
          @click="activeCategoryId = category.id"
        >
          {{ category.name }}
        </button>
      </div>

      <div v-if="filteredProducts.length" class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <article v-for="product in filteredProducts" :key="product.id" class="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300 group rounded-xl overflow-hidden border border-base-200 cursor-pointer" @click="navigateToProduct(product.slug)">

          <!-- 商品图片 -->
          <figure class="relative pt-[100%] overflow-hidden">
            <img
              :src="product.coverImage || defaultProductCoverUrl"
              :alt="product.name"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <!-- 分类标签 -->
            <div class="absolute top-2.5 left-2.5">
              <span class="badge badge-primary badge-sm font-semibold rounded">
                {{ product.categoryName || '默认' }}
              </span>
            </div>
          </figure>

          <!-- 商品信息 -->
          <div class="card-body p-3">
            <!-- 库存状态标签 + 商品名称 -->
            <div class="flex items-start gap-1.5">
              <span
                v-if="product.deliveryType === 'CARD_AUTO'"
                class="text-xs font-medium px-1.5 py-0.5 rounded shrink-0 mt-0.5"
                :class="{
                  'bg-amber-500/10 text-amber-600': lowStock(product),
                  'bg-emerald-500/10 text-emerald-600': !lowStock(product) && product.availableStock > 0,
                  'bg-red-500/10 text-red-600': product.availableStock === 0
                }"
              >
                {{ product.availableStock === 0 ? '已售罄' : lowStock(product) ? `紧张(${product.availableStock})` : '有货' }}
              </span>
              <span
                v-else-if="product.deliveryType === 'FIXED_CARD'"
                class="text-xs font-medium px-1.5 py-0.5 rounded shrink-0 mt-0.5 bg-emerald-500/10 text-emerald-600"
              >
                有货
              </span>
              <span
                v-else-if="product.deliveryType === 'MANUAL'"
                class="text-xs font-medium px-1.5 py-0.5 rounded shrink-0 mt-0.5 bg-sky-500/10 text-sky-600"
              >
                人工发货
              </span>
              <h3 class="card-title text-sm font-semibold line-clamp-2 text-base-content flex-1 min-w-0">
                {{ product.name }}
              </h3>
            </div>

            <!-- 价格 -->
            <div class="flex items-baseline gap-0.5 mt-2">
              <span class="text-xs font-bold text-red-500">¥</span>
              <span class="text-xl font-bold text-red-500 leading-none">{{ formatCents(product.price) }}</span>
            </div>
          </div>

        </article>
      </div>

      <div v-else class="rounded-box border border-dashed border-base-300 bg-base-100 p-8 text-center text-base-content/60">
        当前还没有上架商品，请先在后台录入分类、商品和库存。
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useData } from "vike-vue/useData";
import { navigate } from "vike/client/router";
import { formatCents } from "../../lib/utils/money";
import emptyCoverUrl from "../../assets/empty.jpg";
import homeHeroImage from "../../assets/home-n.png";
import type { Data } from "./+data";
import type { ProductSummary } from "../../modules/catalog/types";

const { site, catalog } = useData<Data>();
const activeCategoryId = ref<number | null>(null);
const homeHeroImageUrl = computed(() => site.homeHeroImage || homeHeroImage);
const defaultProductCoverUrl = computed(() => site.defaultProductCover || emptyCoverUrl);
const filteredProducts = computed(() => {
  if (activeCategoryId.value === null) {
    return catalog.products;
  }

  return catalog.products.filter((product) => product.categoryId === activeCategoryId.value);
});
// 库存紧张
const lowStock = (product: ProductSummary) => {
  return product.availableStock >= 0 && product.availableStock < 10
}

// 跳转到商品详情页
const navigateToProduct = (slug: string) => {
  navigate(`/product/${slug}`);
}
</script>

<style>
.hero-img {
  width: 230px;
  height: auto;
  position: absolute;
  top: -35px;
  right: -22px;
  z-index: 3;
}

.home-hero-stage {
  isolation: isolate;
}

.home-hero-stage::before {
  content: "";
  position: absolute;
  inset: 18px -28px -28px -28px;
  z-index: -2;
  pointer-events: none;
  background:
    linear-gradient(132deg, rgba(255, 145, 190, 0.26) 0 18%, transparent 18% 42%, rgba(127, 155, 255, 0.24) 42% 66%, transparent 66%),
    linear-gradient(28deg, transparent 0 24%, rgba(118, 221, 255, 0.2) 24% 38%, transparent 38% 70%, rgba(255, 225, 145, 0.22) 70% 100%);
  filter: blur(18px);
  transform: translateZ(0);
}

.home-hero-stage::after {
  content: "";
  position: absolute;
  inset: 40px 10px -8px 10px;
  z-index: -1;
  pointer-events: none;
  background:
    repeating-linear-gradient(90deg, rgba(99, 102, 241, 0.09) 0 1px, transparent 1px 42px),
    repeating-linear-gradient(0deg, rgba(236, 72, 153, 0.07) 0 1px, transparent 1px 42px);
  mask-image: linear-gradient(90deg, transparent, #000 18%, #000 82%, transparent);
  opacity: 0.48;
}

.hero-glass {
  min-height: 166px;
  z-index: 1;
  background: linear-gradient(115deg, rgba(255, 255, 255, 0.42), rgba(255, 255, 255, 0.18));
  border: 1px solid rgba(255, 255, 255, 0.68);
  box-shadow:
    0 28px 80px rgba(15, 23, 42, 0.18),
    0 12px 30px rgba(99, 102, 241, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.92),
    inset 0 0 36px rgba(255, 255, 255, 0.24);
  backdrop-filter: blur(28px) saturate(1.65);
  -webkit-backdrop-filter: blur(28px) saturate(1.65);
}

.hero-glass::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(100deg, rgba(255, 255, 255, 0.78) 0%, rgba(255, 255, 255, 0.12) 30%, rgba(255, 255, 255, 0) 56%),
    linear-gradient(78deg, rgba(255, 255, 255, 0) 38%, rgba(255, 255, 255, 0.52) 50%, rgba(255, 255, 255, 0) 62%);
  opacity: 0.74;
  mix-blend-mode: screen;
}

.hero-glass::after {
  content: "";
  position: absolute;
  left: 18px;
  right: 18px;
  top: 12px;
  height: 1px;
  pointer-events: none;
  background: rgba(255, 255, 255, 0.85);
}

.stats-glass {
  background: rgba(255, 255, 255, 0.34);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow:
    0 18px 36px rgba(71, 85, 105, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.86),
    inset 0 0 22px rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(24px) saturate(1.55);
  -webkit-backdrop-filter: blur(24px) saturate(1.55);
}
</style>
