<template>
  <template v-if="isAdminRoute">
    <slot />
  </template>
  <div v-else class="frontend-shell min-h-screen text-base-content flex flex-col" :style="frontendShellStyle">
    <header class="sticky top-0 z-40">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
        <div class="flex min-w-0 items-center gap-2">
          <img :src="siteLogo" height="28" width="28" class="h-7 w-7 rounded object-cover" alt="logo" />
          <a href="/" class="truncate text-xl font-bold text-primary sm:text-2xl">{{ siteName }}</a>
          <!-- <p class="text-sm text-base-content/60">{{ siteSubtitle }}</p> -->
        </div>
        <nav class="flex items-center gap-2 text-sm">
          <AppButton href="/" variant="ghost" size="sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
              <path fill-rule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z" clip-rule="evenodd" />
            </svg>
            <span class="hidden sm:inline">首页</span>
          </AppButton>
          <AppButton href="/query" variant="ghost" size="sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
              <path fill-rule="evenodd" d="M15.988 3.012A2.25 2.25 0 0 1 18 5.25v6.5A2.25 2.25 0 0 1 15.75 14H13.5v-3.379a3 3 0 0 0-.879-2.121l-3.12-3.121a3 3 0 0 0-1.402-.791 2.252 2.252 0 0 1 1.913-1.576A2.25 2.25 0 0 1 12.25 1h1.5a2.25 2.25 0 0 1 2.238 2.012ZM11.5 3.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v.25h-3v-.25Z" clip-rule="evenodd" />
              <path d="M3.5 6A1.5 1.5 0 0 0 2 7.5v9A1.5 1.5 0 0 0 3.5 18h7a1.5 1.5 0 0 0 1.5-1.5v-5.879a1.5 1.5 0 0 0-.44-1.06L8.44 6.439A1.5 1.5 0 0 0 7.378 6H3.5Z" />
            </svg>
            <span class="hidden sm:inline">订单查询</span>
          </AppButton>
          <!-- <a href="/guxi" class="btn btn-primary btn-sm">后台</a> -->
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-6xl w-full px-4 py-8 flex-1">
      <slot />
    </main>

    <footer class="py-6 text-center text-sm text-base-content/70 mt-auto">
      <div class="flex flex-col items-center gap-3 md:flex-row md:justify-between mx-auto max-w-6xl px-4 text-sm text-gray-500 tracking-wide">
        <span>{{ footerText ? footerText : "&copy; 2026" }}</span>
        <!-- 单条直接展示，多条用 dropdown -->
        <template v-if="supportContactItems.length === 1">
          <p class="flex items-center gap-2 text-sm">
            <svg class="w-4 h-4 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.079 6.839a3 3 0 0 0-4.255.1M13 20h1.083A3.916 3.916 0 0 0 18 16.083V9A6 6 0 1 0 6 9v7m7 4v-1a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1Zm-7-4v-6H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1Zm12-6h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1v-6Z"/>
            </svg>
            <a v-if="supportContactItems[0].href" :href="supportContactItems[0].href" target="_blank" class="hover:underline">{{ supportContactItems[0].label }}</a>
            <span v-else>{{ supportContactItems[0].label }}</span>
          </p>
        </template>
        <details v-else-if="supportContactItems.length > 1" class="dropdown dropdown-top">
          <summary class="btn btn-ghost btn-sm gap-2">
            <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.079 6.839a3 3 0 0 0-4.255.1M13 20h1.083A3.916 3.916 0 0 0 18 16.083V9A6 6 0 1 0 6 9v7m7 4v-1a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1Zm-7-4v-6H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1Zm12-6h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1v-6Z"/>
            </svg>
            联系客服
          </summary>
          <ul class="menu dropdown-content bg-base-100 rounded-box z-10 w-48 p-2 shadow mb-2">
            <li v-for="(item, i) in supportContactItems" :key="i">
              <a v-if="item.href" :href="item.href" target="_blank">{{ item.label }}</a>
              <span v-else class="px-4 py-2 text-sm">{{ item.label }}</span>
            </li>
          </ul>
        </details>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import AppButton from "../components/AppButton.vue";
import { usePageContext } from "vike-vue/usePageContext";

import logoUrl from "../assets/logo.svg";

const pageContext = usePageContext();
const siteName = computed(() => pageContext.site?.siteName);
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
  return raw.split("\n").map(line => line.trim()).filter(Boolean).map(line => {
    const idx = line.indexOf("|");
    if (idx === -1) return { label: line, href: "" };
    return { label: line.slice(0, idx).trim(), href: line.slice(idx + 1).trim() };
  });
});
const footerText = computed(() => pageContext.site?.footerText || "");

const isAdminRoute = computed(() => pageContext.urlPathname?.startsWith("/guxi"));
</script>

<style>
body {
  margin: 0;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
}

* {
  box-sizing: border-box;
}

a {
  color: inherit;
  text-decoration: none;
}

.frontend-shell {
  --frontend-bg-image: linear-gradient(135deg, rgba(142, 197, 252, 0.5), rgba(255, 162, 193, 0.42));
  position: relative;
  isolation: isolate;
  overflow-x: hidden;
  background:
    linear-gradient(180deg, rgba(248, 250, 252, 0.74), rgba(238, 242, 255, 0.62)),
    radial-gradient(circle at 15% 12%, rgba(56, 189, 248, 0.36), transparent 30rem),
    radial-gradient(circle at 84% 18%, rgba(244, 114, 182, 0.3), transparent 28rem),
    radial-gradient(circle at 52% 82%, rgba(34, 197, 94, 0.18), transparent 32rem),
    var(--frontend-bg-image);
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.frontend-shell::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    linear-gradient(rgba(255, 255, 255, 0.16) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.12) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.72), transparent 78%);
}

.frontend-shell > header,
.frontend-shell > footer {
  border-color: rgba(255, 255, 255, 0.56);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.52), rgba(255, 255, 255, 0.26));
  box-shadow:
    0 18px 48px rgba(15, 23, 42, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    inset 0 0 28px rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(24px) saturate(1.55);
  -webkit-backdrop-filter: blur(24px) saturate(1.55);
}

.frontend-shell > header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.58);
}

.frontend-shell > footer {
  border-top: 1px solid rgba(255, 255, 255, 0.52);
}

.frontend-shell :where(.card, .rounded-box, .stats, .alert, .collapse, .dropdown-content, .tabs-boxed, .table, .mockup-code) {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.48), rgba(255, 255, 255, 0.22));
  border: 1px solid rgba(255, 255, 255, 0.64);
  box-shadow:
    0 24px 64px rgba(15, 23, 42, 0.14),
    0 8px 24px rgba(99, 102, 241, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.92),
    inset 0 0 34px rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(24px) saturate(1.6);
  -webkit-backdrop-filter: blur(24px) saturate(1.6);
}

.frontend-shell :where(.card, .rounded-box, .stats, .alert, .collapse, .dropdown-content, .tabs-boxed, .table, .mockup-code)::before {
  border-radius: inherit;
}

.frontend-shell :where(.input, .textarea, .select) {
  background-color: rgba(255, 255, 255, 0.52);
  border-color: rgba(255, 255, 255, 0.72);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(16px) saturate(1.35);
  -webkit-backdrop-filter: blur(16px) saturate(1.35);
}

.frontend-shell :where(.btn-outline, .btn-ghost) {
  border-color: rgba(255, 255, 255, 0.54);
  background-color: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(14px) saturate(1.35);
  -webkit-backdrop-filter: blur(14px) saturate(1.35);
}

.frontend-shell .card figure {
  background: rgba(255, 255, 255, 0.18);
}

.frontend-shell .card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 30px 78px rgba(15, 23, 42, 0.18),
    0 10px 28px rgba(99, 102, 241, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.94),
    inset 0 0 38px rgba(255, 255, 255, 0.24);
}
</style>
