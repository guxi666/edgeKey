<template>
  <div class="home-page">
    <section class="banner">
      <div class="banner-content">
        <div class="hero-badge">{{ heroBadge }}</div>
        <h1>{{ heroTitle }}</h1>
        <p>{{ heroSubtitle }}</p>
      </div>

      <div class="banner-right">
        <div class="stat-card">
          <div class="stat-label">{{ statLabel }}</div>
          <div class="stat-value">
            {{ catalog.products.length }}
            <span aria-hidden="true">🎁</span>
          </div>
        </div>
      </div>
    </section>

    <section class="features">
      <div v-for="feature in featureCards" :key="feature.className" class="feature-card">
        <div class="feature-icon" :class="feature.className" aria-hidden="true">{{ feature.icon }}</div>
        <div class="feature-info">
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.desc }}</p>
        </div>
      </div>
    </section>

    <section class="products-section">
      <div class="products-header">
        <div class="products-title">{{ productsTitle }}</div>
        <div class="filter-controls">
          <select v-model="activeCategoryId" class="select-custom" aria-label="商品分类">
            <option value="all">全部分类</option>
            <option v-for="category in catalog.categories" :key="category.id" :value="String(category.id)">
              {{ category.name }}
            </option>
          </select>
          <div class="search-wrapper">
            <span class="search-icon" aria-hidden="true">🔎</span>
            <input v-model="searchTerm" type="search" class="search-input" :placeholder="searchPlaceholder" />
          </div>
        </div>
      </div>

      <div v-if="filteredProducts.length" class="product-grid">
        <article v-for="product in filteredProducts" :key="product.id" class="product-card" @click="navigateToProduct(product.slug)">
          <figure>
            <img :src="product.coverImage || defaultProductCoverUrl" :alt="product.name" />
            <span class="category-pill">{{ product.categoryName || "默认" }}</span>
          </figure>
          <div class="product-info">
            <div class="product-title-row">
              <span class="stock-pill" :class="stockClass(product)">{{ stockText(product) }}</span>
              <h3>{{ product.name }}</h3>
            </div>
            <div class="product-price">
              <span>¥</span>{{ formatCents(product.price) }}
            </div>
          </div>
        </article>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon" aria-hidden="true">📦</div>
        <h2>当前还没有上架商品</h2>
        <p>请先在后台录入分类、商品和库存</p>
        <a href="/guxi" class="front-btn-primary">前往后台管理</a>
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
import type { Data } from "./+data";
import type { ProductSummary } from "../../modules/catalog/types";

const { site, catalog } = useData<Data>();
const activeCategoryId = ref("all");
const searchTerm = ref("");
const defaultProductCoverUrl = computed(() => site.defaultProductCover || emptyCoverUrl);
const heroBadge = computed(() => site.homeHeroBadge || site.siteSubtitle || "Cloudflare Workers 免费部署自动发卡商城");
const heroTitle = computed(() => site.homeHeroTitle || "一键部署，全球即达");
const heroSubtitle = computed(() => site.notice || "安全稳定 · 高效便捷 · 智能发卡");
const statLabel = computed(() => site.homeStatLabel || "在线商品");
const productsTitle = computed(() => site.homeProductsTitle || "商品列表");
const searchPlaceholder = computed(() => site.homeSearchPlaceholder || "搜索商品...");
const featureCards = computed(() => [
  {
    icon: "🛡️",
    className: "fi-1",
    title: site.homeFeature1Title || "稳定可靠",
    desc: site.homeFeature1Desc || "高可用架构",
  },
  {
    icon: "⚡",
    className: "fi-2",
    title: site.homeFeature2Title || "极速发卡",
    desc: site.homeFeature2Desc || "秒级自动发货",
  },
  {
    icon: "🔐",
    className: "fi-3",
    title: site.homeFeature3Title || "安全加密",
    desc: site.homeFeature3Desc || "数据安全保障",
  },
  {
    icon: "💖",
    className: "fi-4",
    title: site.homeFeature4Title || "售后无忧",
    desc: site.homeFeature4Desc || "7x24 小时支持",
  },
]);
const filteredProducts = computed(() => {
  const keyword = searchTerm.value.trim().toLowerCase();
  return catalog.products.filter((product) => {
    const matchesCategory = activeCategoryId.value === "all" || String(product.categoryId) === activeCategoryId.value;
    const matchesKeyword = !keyword || product.name.toLowerCase().includes(keyword) || (product.categoryName ?? "").toLowerCase().includes(keyword);
    return matchesCategory && matchesKeyword;
  });
});

function lowStock(product: ProductSummary) {
  return product.availableStock >= 0 && product.availableStock < 10;
}

function stockText(product: ProductSummary) {
  if (product.deliveryType === "MANUAL") return "人工发货";
  if (product.availableStock === 0) return "已售罄";
  if (lowStock(product)) return `紧张(${product.availableStock})`;
  return "有货";
}

function stockClass(product: ProductSummary) {
  if (product.deliveryType === "MANUAL") return "manual";
  if (product.availableStock === 0) return "empty";
  if (lowStock(product)) return "low";
  return "available";
}

function navigateToProduct(slug: string) {
  navigate(`/product/${slug}`);
}
</script>

<style>
.home-page {
  display: grid;
  gap: 25px;
}

.banner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 220px;
  overflow: hidden;
  padding: 40px 50px;
  border: 1px solid rgba(255, 255, 255, 0.68);
  border-radius: 24px;
  background: linear-gradient(105deg, rgba(255, 255, 255, 0.72) 0%, rgba(243, 232, 255, 0.62) 100%);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.02);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.banner-content {
  position: relative;
  z-index: 2;
  max-width: 60%;
}

.hero-badge {
  display: inline-block;
  margin-bottom: 15px;
  padding: 4px 12px;
  border-radius: 999px;
  background: linear-gradient(90deg, #4f46e5, #db2777);
  color: white;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.banner h1 {
  margin: 0 0 15px;
  color: #111827;
  font-size: 36px;
  font-weight: 800;
  letter-spacing: 1px;
}

.banner p {
  color: #6b7280;
  font-size: 15px;
  letter-spacing: 0.5px;
}

.banner-right {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 30px;
}

.stat-card {
  min-width: 128px;
  padding: 20px 25px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 16px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.48), rgba(255, 255, 255, 0.22));
  box-shadow: 0 8px 24px rgba(147, 51, 234, 0.08);
  text-align: center;
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
}

.stat-label {
  margin-bottom: 5px;
  color: #9ca3af;
  font-size: 12px;
}

.stat-value {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  color: #db2777;
  font-size: 28px;
  font-weight: 800;
}

.stat-value span {
  font-size: 20px;
}

.features {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.62);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.01);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.feature-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.7);
}

.feature-icon {
  display: grid;
  width: 40px;
  height: 40px;
  flex: 0 0 40px;
  place-items: center;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 800;
}

.fi-1 { background: #e0e7ff; color: #4f46e5; }
.fi-2 { background: #dcfce7; color: #16a34a; }
.fi-3 { background: #e0f2fe; color: #0284c7; }
.fi-4 { background: #fce7f3; color: #db2777; }

.feature-info h3 {
  margin: 0 0 2px;
  color: #1f2937;
  font-size: 14px;
  font-weight: 800;
}

.feature-info p {
  color: #9ca3af;
  font-size: 11px;
}

.products-section {
  min-height: 400px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.02);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.products-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 32px;
}

.products-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1f2937;
  font-size: 16px;
  font-weight: 800;
}

.products-title::before {
  content: "●";
  color: #8b5cf6;
  font-size: 12px;
}

.filter-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.select-custom,
.search-input {
  height: 38px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.8);
  color: #4b5563;
  font-size: 13px;
  outline: none;
}

.select-custom {
  min-width: 120px;
  padding: 8px 16px;
  cursor: pointer;
}

.search-wrapper {
  position: relative;
}

.search-input {
  width: 200px;
  padding: 8px 16px 8px 35px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  color: #9ca3af;
  font-size: 13px;
  transform: translateY(-50%);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 22px;
}

.product-card {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.68);
  border-radius: 16px;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.46), rgba(255, 255, 255, 0.18)),
    rgba(255, 255, 255, 0.2);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.7),
    0 18px 42px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(20px) saturate(145%);
  -webkit-backdrop-filter: blur(20px) saturate(145%);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 36px rgba(99, 102, 241, 0.12);
}

.product-card figure {
  position: relative;
  margin: 0;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.18);
}

.product-card figure img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover figure img {
  transform: scale(1.04);
}

.category-pill {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 3px 8px;
  border-radius: 8px;
  background: #4f46e5;
  color: white;
  font-size: 11px;
  font-weight: 800;
}

.product-info {
  position: absolute;
  right: 10px;
  bottom: 10px;
  left: 10px;
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.48);
  border-radius: 12px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.42), rgba(255, 255, 255, 0.18));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.55),
    0 14px 30px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(18px) saturate(150%);
  -webkit-backdrop-filter: blur(18px) saturate(150%);
}

.product-title-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.product-title-row h3 {
  min-width: 0;
  margin: 0;
  color: #1f2937;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.45;
}

.stock-pill {
  flex: 0 0 auto;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 800;
}

.stock-pill.available { background: #dcfce7; color: #16a34a; }
.stock-pill.low { background: #fef3c7; color: #d97706; }
.stock-pill.empty { background: #fee2e2; color: #ef4444; }
.stock-pill.manual { background: #e0f2fe; color: #0284c7; }

.product-price {
  margin-top: 12px;
  color: #ef4444;
  font-size: 20px;
  font-weight: 900;
}

.product-price span {
  margin-right: 1px;
  font-size: 12px;
}

.empty-state {
  padding: 60px 0;
  text-align: center;
}

.empty-icon {
  margin-bottom: 15px;
  color: #c084fc;
  font-size: 50px;
  line-height: 1;
  opacity: 0.7;
}

.empty-state h2 {
  margin: 0 0 8px;
  color: #1f2937;
  font-size: 16px;
  font-weight: 800;
}

.empty-state p {
  margin-bottom: 25px;
  color: #9ca3af;
  font-size: 13px;
}

.front-btn-primary {
  display: inline-block;
  padding: 10px 24px;
  border-radius: 8px;
  background: linear-gradient(90deg, #a855f7, #6366f1);
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.2);
  color: white;
  font-size: 14px;
  font-weight: 700;
  transition: opacity 0.2s ease;
}

.front-btn-primary:hover {
  opacity: 0.9;
}

@media (max-width: 980px) {
  .banner {
    align-items: flex-start;
    flex-direction: column;
  }

  .banner-content {
    max-width: 100%;
  }

  .features,
  .product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .banner,
  .products-section {
    padding: 24px;
  }

  .banner h1 {
    font-size: 28px;
  }

  .banner-right,
  .products-header,
  .filter-controls {
    align-items: stretch;
    width: 100%;
    flex-direction: column;
  }

  .features,
  .product-grid {
    grid-template-columns: 1fr;
  }

  .search-input,
  .select-custom {
    width: 100%;
  }
}
</style>
