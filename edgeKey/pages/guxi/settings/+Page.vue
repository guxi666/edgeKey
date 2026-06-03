<template>
  <section class="card bg-base-100 shadow-sm">
    <div class="card-body space-y-4">
      <div class="flex items-center justify-between gap-4 max-md:flex-col max-md:items-start">
        <div>
          <h1 class="text-2xl font-bold">站点设置</h1>
          <p class="text-sm text-base-content/70">维护前台展示的站点名称、公告、客服、图标和页面背景。</p>
        </div>
        <span v-if="saved" class="badge badge-success">已保存</span>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <label class="flex flex-col gap-1.5">
          <span class="label-text font-medium">站点名称</span>
          <input v-model="form.siteName" class="input input-bordered w-full" />
        </label>
        <label class="flex flex-col gap-1.5">
          <span class="label-text font-medium">网站地址</span>
          <input v-model="form.siteUrl" class="input input-bordered w-full" placeholder="https://example.com" />
        </label>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <label class="flex flex-col gap-1.5">
          <span class="label-text font-medium">副标题</span>
          <input v-model="form.siteSubtitle" class="input input-bordered w-full" />
        </label>
        <label class="flex flex-col gap-1.5">
          <span class="label-text font-medium">网站 Favicon (ico 或 png)</span>
          <div class="flex gap-2">
            <input v-model="form.logoIcon" class="input input-bordered w-full" placeholder="https://example.com/favicon.ico" />
            <AppButton variant="outline" @click="openFilePicker('favicon')">选择图片</AppButton>
          </div>
        </label>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <label class="flex flex-col gap-1.5 md:col-span-2">
          <span class="label-text font-medium">网站 Logo URL</span>
          <div class="flex gap-2">
            <input v-model="form.logo" class="input input-bordered w-full" placeholder="https://example.com/logo.png" />
            <AppButton variant="outline" @click="openFilePicker('logo')">选择图片</AppButton>
          </div>
        </label>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <label class="flex flex-col gap-1.5">
          <span class="label-text font-medium">前台背景图 URL</span>
          <div class="flex gap-2">
            <input v-model="form.frontendBackgroundImage" class="input input-bordered w-full" placeholder="留空使用默认渐变背景" />
            <AppButton variant="outline" @click="openFilePicker('frontendBackgroundImage')">选择图片</AppButton>
          </div>
        </label>
        <label class="flex flex-col gap-1.5">
          <span class="label-text font-medium">首页装饰图 URL</span>
          <div class="flex gap-2">
            <input v-model="form.homeHeroImage" class="input input-bordered w-full" placeholder="留空使用默认首页装饰图" />
            <AppButton variant="outline" @click="openFilePicker('homeHeroImage')">选择图片</AppButton>
          </div>
        </label>
        <label class="flex flex-col gap-1.5 md:col-span-2">
          <span class="label-text font-medium">商品默认封面 URL</span>
          <div class="flex gap-2">
            <input v-model="form.defaultProductCover" class="input input-bordered w-full" placeholder="留空使用默认商品封面" />
            <AppButton variant="outline" @click="openFilePicker('defaultProductCover')">选择图片</AppButton>
          </div>
        </label>
      </div>

      <label class="flex flex-col gap-1.5">
        <span class="label-text font-medium">首页公告</span>
        <textarea v-model="form.notice" class="textarea textarea-bordered w-full" rows="4"></textarea>
      </label>

      <div class="grid gap-4 md:grid-cols-2">
        <label class="flex flex-col gap-1.5">
          <span class="label-text font-medium">客服联系方式</span>
          <textarea
            v-model="form.supportContact"
            class="textarea textarea-bordered w-full"
            rows="3"
            placeholder="格式：显示文字|链接地址；无链接时直接填写文字"
          ></textarea>
          <span class="text-xs text-base-content/50">每行一条。需要链接时使用“显示文字|链接地址”的格式。</span>
        </label>
        <label class="flex flex-col gap-1.5">
          <span class="label-text font-medium">页脚文案</span>
          <textarea v-model="form.footerText" class="textarea textarea-bordered w-full" rows="2" placeholder="© 2026 xxxx 版权所有"></textarea>
        </label>
      </div>

      <label class="flex flex-col gap-1.5">
        <span class="label-text font-medium">下单提示</span>
        <textarea v-model="form.orderNotice" class="textarea textarea-bordered w-full" rows="4"></textarea>
      </label>

      <div class="flex items-center gap-3">
        <AppButton variant="primary" :loading="saving" @click="handleSave">保存设置</AppButton>
        <span v-if="errorMessage" class="text-sm text-error">{{ errorMessage }}</span>
      </div>
    </div>
  </section>

  <FilePickerModal
    :show="showFilePicker"
    :type-filter="filePickerTypeFilter"
    @close="showFilePicker = false"
    @select="handleFileSelect"
  />
</template>

<script setup lang="ts">
import AppButton from "../../../components/AppButton.vue";
import FilePickerModal from "../../../components/FilePickerModal.vue";
import { normalizeTelefuncError } from "../../../lib/app-error";
import { reactive, ref } from "vue";
import { useData } from "vike-vue/useData";
import { onSaveSiteSettings } from "./saveSiteSettings.telefunc";
import type { Data } from "./+data";

const { site } = useData<Data>();

const form = reactive({
  siteName: site.siteName,
  siteUrl: site.siteUrl ?? "",
  siteSubtitle: site.siteSubtitle ?? "",
  logoIcon: site.logoIcon ?? "",
  logo: site.logo ?? "",
  frontendBackgroundImage: site.frontendBackgroundImage ?? "",
  homeHeroImage: site.homeHeroImage ?? "",
  defaultProductCover: site.defaultProductCover ?? "",
  notice: site.notice ?? "",
  supportContact: site.supportContact ?? "",
  footerText: site.footerText ?? "",
  orderNotice: site.orderNotice ?? "",
});

const saving = ref(false);
const saved = ref(false);
const errorMessage = ref("");
const showFilePicker = ref(false);
const filePickerTypeFilter = ref("");
const currentPickerTarget = ref<"" | "logo" | "favicon" | "frontendBackgroundImage" | "homeHeroImage" | "defaultProductCover">("");

async function handleSave() {
  saving.value = true;
  saved.value = false;
  errorMessage.value = "";

  try {
    const result = await onSaveSiteSettings({ ...form });
    form.siteName = result.siteName;
    form.siteUrl = result.siteUrl ?? "";
    form.siteSubtitle = result.siteSubtitle ?? "";
    form.logoIcon = result.logoIcon ?? "";
    form.logo = result.logo ?? "";
    form.frontendBackgroundImage = result.frontendBackgroundImage ?? "";
    form.homeHeroImage = result.homeHeroImage ?? "";
    form.defaultProductCover = result.defaultProductCover ?? "";
    form.notice = result.notice ?? "";
    form.supportContact = result.supportContact ?? "";
    form.footerText = result.footerText ?? "";
    form.orderNotice = result.orderNotice ?? "";
    saved.value = true;
  } catch (error) {
    errorMessage.value = normalizeTelefuncError(error, "保存失败");
  } finally {
    saving.value = false;
  }
}

function openFilePicker(target: "logo" | "favicon" | "frontendBackgroundImage" | "homeHeroImage" | "defaultProductCover") {
  currentPickerTarget.value = target;
  filePickerTypeFilter.value = "image/";
  showFilePicker.value = true;
}

function handleFileSelect(url: string) {
  if (currentPickerTarget.value === "logo") {
    form.logo = url;
  } else if (currentPickerTarget.value === "favicon") {
    form.logoIcon = url;
  } else if (currentPickerTarget.value === "frontendBackgroundImage") {
    form.frontendBackgroundImage = url;
  } else if (currentPickerTarget.value === "homeHeroImage") {
    form.homeHeroImage = url;
  } else if (currentPickerTarget.value === "defaultProductCover") {
    form.defaultProductCover = url;
  }
  showFilePicker.value = false;
}
</script>
