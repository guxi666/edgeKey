import { getContext } from "telefunc";
import type { PrismaClient } from "../../generated/prisma/client";
import { validateSiteSettingsInput } from "../../lib/validators/site";
import { getAdminContext, logAdminOperation } from "../auth/service";
import { getSiteSettingRecord, upsertSiteSettingRecord } from "./repository";
import type { SiteSettingInput } from "./types";

const defaultSiteSetting = {
  siteName: "",
  siteUrl: "",
  siteSubtitle: "",
  logoIcon: "",
  logo: "",
  homeHeroImage: "",
  defaultProductCover: "",
  frontendBackgroundImage: "",
  homeHeroBadge: "",
  homeHeroTitle: "",
  homeStatLabel: "",
  homeProductsTitle: "",
  homeSearchPlaceholder: "",
  homeFeature1Title: "",
  homeFeature1Desc: "",
  homeFeature2Title: "",
  homeFeature2Desc: "",
  homeFeature3Title: "",
  homeFeature3Desc: "",
  homeFeature4Title: "",
  homeFeature4Desc: "",
  notice: "",
  supportContact: null,
  footerText: null,
  orderNotice: null,
};

function normalizeSetting(record: Awaited<ReturnType<typeof getSiteSettingRecord>>) {
  if (!record) {
    return defaultSiteSetting;
  }

  return {
    siteName: record.siteName,
    siteUrl: record.siteUrl ?? "",
    siteSubtitle: record.siteSubtitle,
    logoIcon: record.logoIcon ?? "",
    logo: record.logo ?? "",
    homeHeroImage: record.homeHeroImage ?? "",
    defaultProductCover: record.defaultProductCover ?? "",
    frontendBackgroundImage: record.frontendBackgroundImage ?? "",
    homeHeroBadge: record.homeHeroBadge ?? "",
    homeHeroTitle: record.homeHeroTitle ?? "",
    homeStatLabel: record.homeStatLabel ?? "",
    homeProductsTitle: record.homeProductsTitle ?? "",
    homeSearchPlaceholder: record.homeSearchPlaceholder ?? "",
    homeFeature1Title: record.homeFeature1Title ?? "",
    homeFeature1Desc: record.homeFeature1Desc ?? "",
    homeFeature2Title: record.homeFeature2Title ?? "",
    homeFeature2Desc: record.homeFeature2Desc ?? "",
    homeFeature3Title: record.homeFeature3Title ?? "",
    homeFeature3Desc: record.homeFeature3Desc ?? "",
    homeFeature4Title: record.homeFeature4Title ?? "",
    homeFeature4Desc: record.homeFeature4Desc ?? "",
    notice: record.notice,
    supportContact: record.supportContact,
    footerText: record.footerText,
    orderNotice: record.orderNotice,
  };
}

export async function getPublicSiteInfo(prisma?: PrismaClient) {
  const client = prisma ?? getContext<{ prisma: PrismaClient }>().prisma;
  const record = await getSiteSettingRecord(client);
  return normalizeSetting(record);
}

export async function getSiteSetting(prisma?: PrismaClient) {
  return getPublicSiteInfo(prisma);
}

export async function saveSiteSetting(input: SiteSettingInput) {
  const adminContext = getAdminContext();
  const { prisma } = adminContext;
  const adminId = Number(adminContext.session?.user?.id);
  const { siteName, siteUrl } = validateSiteSettingsInput(input);

  const record = await upsertSiteSettingRecord(prisma, {
    siteName,
    siteUrl,
    siteSubtitle: input.siteSubtitle?.trim() || null,
    logoIcon: input.logoIcon?.trim() || null,
    logo: input.logo?.trim() || null,
    homeHeroImage: input.homeHeroImage?.trim() || null,
    defaultProductCover: input.defaultProductCover?.trim() || null,
    frontendBackgroundImage: input.frontendBackgroundImage?.trim() || null,
    homeHeroBadge: input.homeHeroBadge?.trim() || null,
    homeHeroTitle: input.homeHeroTitle?.trim() || null,
    homeStatLabel: input.homeStatLabel?.trim() || null,
    homeProductsTitle: input.homeProductsTitle?.trim() || null,
    homeSearchPlaceholder: input.homeSearchPlaceholder?.trim() || null,
    homeFeature1Title: input.homeFeature1Title?.trim() || null,
    homeFeature1Desc: input.homeFeature1Desc?.trim() || null,
    homeFeature2Title: input.homeFeature2Title?.trim() || null,
    homeFeature2Desc: input.homeFeature2Desc?.trim() || null,
    homeFeature3Title: input.homeFeature3Title?.trim() || null,
    homeFeature3Desc: input.homeFeature3Desc?.trim() || null,
    homeFeature4Title: input.homeFeature4Title?.trim() || null,
    homeFeature4Desc: input.homeFeature4Desc?.trim() || null,
    notice: input.notice?.trim() || null,
    supportContact: input.supportContact?.trim() || null,
    footerText: input.footerText?.trim() || null,
    orderNotice: input.orderNotice?.trim() || null,
  });

  await logAdminOperation(
    {
      action: "SAVE_SITE_SETTING",
      targetType: "SiteSetting",
      targetId: "1",
      detail: `siteName=${siteName}`,
    },
    {
      prisma,
      adminId,
    },
  );

  return normalizeSetting(record);
}
