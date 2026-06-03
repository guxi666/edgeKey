<template>
  <template v-if="isAdminRoute">
    <slot />
  </template>
  <div v-else class="frontend-shell min-h-screen text-base-content flex flex-col" :style="frontendShellStyle">
    <div class="frontend-container">
      <header class="frontend-header">
        <a href="/" class="logo-area">
          <span class="logo-icon">
            <img :src="siteLogo" alt="logo" />
          </span>
          <span>{{ siteName }}</span>
        </a>
        <nav class="nav-links">
          <a href="/" class="nav-item" :class="{ active: isHomeRoute }">
            <span class="nav-emoji" aria-hidden="true">🏠</span>
            <span>首页</span>
          </a>
          <a href="/query" class="nav-item" :class="{ active: isQueryRoute }">
            <span class="nav-emoji" aria-hidden="true">📋</span>
            <span>订单查询</span>
          </a>
        </nav>
      </header>
    </div>

    <main class="frontend-container flex-1">
      <slot />
    </main>

    <footer class="frontend-container mt-auto">
      <div class="frontend-footer">
        <div class="footer-grid">
          <div class="footer-brand">
            <h4>{{ siteName }}</h4>
            <p>{{ siteSubtitle || "一键部署，全球即达" }}</p>
          </div>
          <div class="footer-column">
            <h4>关于我们</h4>
            <p>专注提供高效稳定的自动发卡解决方案。</p>
          </div>
          <div class="footer-column">
            <h4>帮助中心</h4>
            <a href="/query">订单查询</a>
            <a href="/">商品列表</a>
          </div>
          <div class="footer-column">
            <h4>联系我们</h4>
            <template v-if="supportContactItems.length">
              <a
                v-for="(item, i) in supportContactItems"
                :key="i"
                :href="item.href || undefined"
                :target="item.href ? '_blank' : undefined"
              >
                {{ item.label }}
              </a>
            </template>
            <p v-else>请在后台设置客服联系方式。</p>
          </div>
        </div>
        <div class="copyright">{{ footerText || "Copyright © 2026 顾熙发卡 版权所有" }}</div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { usePageContext } from "vike-vue/usePageContext";

import logoUrl from "../assets/logo.svg";

const pageContext = usePageContext();
const siteName = computed(() => pageContext.site?.siteName || "顾熙发卡商城");
const siteSubtitle = computed(() => pageContext.site?.siteSubtitle || "");
const siteLogo = computed(() => pageContext.site?.logo || logoUrl);
const frontendBackgroundImage = computed(() => pageContext.site?.frontendBackgroundImage || "");
const frontendShellStyle = computed(() => {
  const imageUrl = frontendBackgroundImage.value.trim();
  const cssUrl = imageUrl.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return imageUrl ? { "--frontend-bg-image": `url("${cssUrl}")` } : {};
});
const supportContactItems = computed(() => {
  const raw = pageContext.site?.supportContact ?? "";
  if (!raw) return [];
  return raw.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
    const idx = line.indexOf("|");
    if (idx === -1) return { label: line, href: "" };
    return { label: line.slice(0, idx).trim(), href: line.slice(idx + 1).trim() };
  });
});
const footerText = computed(() => pageContext.site?.footerText || "");

const isAdminRoute = computed(() => pageContext.urlPathname?.startsWith("/guxi"));
const isHomeRoute = computed(() => pageContext.urlPathname === "/");
const isQueryRoute = computed(() => pageContext.urlPathname?.startsWith("/query"));
</script>

<style>
body {
  margin: 0;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

* {
  box-sizing: border-box;
}

a {
  color: inherit;
  text-decoration: none;
}

.frontend-shell {
  --frontend-bg-image: linear-gradient(135deg, rgba(245, 243, 255, 0.92), rgba(253, 242, 248, 0.88), rgba(236, 254, 255, 0.92));
  position: relative;
  isolation: isolate;
  overflow-x: hidden;
  padding: 20px;
  background:
    linear-gradient(135deg, rgba(245, 243, 255, 0.9) 0%, rgba(253, 242, 248, 0.88) 50%, rgba(236, 254, 255, 0.9) 100%),
    var(--frontend-bg-image);
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  color: #333333;
}

.frontend-container {
  width: min(1200px, 100%);
  margin: 0 auto;
}

.frontend-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 25px;
  padding: 15px 30px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.03);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.logo-area {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 10px;
  color: #1e1b4b;
  font-size: 18px;
  font-weight: 800;
}

.logo-area > span:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.logo-icon {
  display: grid;
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  place-items: center;
  overflow: hidden;
  border-radius: 999px;
  background: transparent;
}

.logo-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 25px;
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 5px;
  color: #4b5563;
  font-size: 14px;
  font-weight: 600;
  transition: color 0.2s ease;
}

.nav-emoji {
  font-size: 15px;
  line-height: 1;
}

.nav-item.active {
  color: #4f46e5;
}

.nav-item.active::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -6px;
  height: 2px;
  border-radius: 999px;
  background: #4f46e5;
}

.frontend-footer {
  margin-top: 30px;
  padding: 40px;
  border: 1px solid rgba(255, 255, 255, 0.68);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.01);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: 40px;
  margin-bottom: 30px;
}

.footer-brand h4,
.footer-column h4 {
  margin-bottom: 12px;
  color: #1f2937;
  font-size: 15px;
  font-weight: 800;
}

.footer-column,
.footer-brand {
  color: #9ca3af;
  font-size: 12px;
  line-height: 1.8;
}

.footer-column a {
  display: block;
  color: #9ca3af;
}

.footer-column a:hover {
  color: #6366f1;
}

.copyright {
  border-top: 1px solid rgba(229, 231, 235, 0.5);
  padding-top: 20px;
  text-align: center;
  color: #9ca3af;
  font-size: 11px;
}

@media (max-width: 760px) {
  .frontend-shell {
    padding: 12px;
  }

  .frontend-header {
    padding: 14px 16px;
  }

  .nav-links {
    gap: 12px;
  }

  .nav-item {
    font-size: 13px;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>
