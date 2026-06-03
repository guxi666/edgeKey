import type { PrismaClient } from "../../generated/prisma/client";

export function getSiteSettingRecord(prisma: PrismaClient) {
  return prisma.siteSetting.findUnique({
    where: { id: 1 },
  });
}

export function upsertSiteSettingRecord(
  prisma: PrismaClient,
  input: {
    siteName: string;
    siteUrl?: string | null;
    siteSubtitle?: string | null;
    logoIcon?: string | null;
    logo?: string | null;
    homeHeroImage?: string | null;
    defaultProductCover?: string | null;
    frontendBackgroundImage?: string | null;
    homeHeroBadge?: string | null;
    homeHeroTitle?: string | null;
    homeStatLabel?: string | null;
    homeProductsTitle?: string | null;
    homeSearchPlaceholder?: string | null;
    homeFeature1Title?: string | null;
    homeFeature1Desc?: string | null;
    homeFeature2Title?: string | null;
    homeFeature2Desc?: string | null;
    homeFeature3Title?: string | null;
    homeFeature3Desc?: string | null;
    homeFeature4Title?: string | null;
    homeFeature4Desc?: string | null;
    notice?: string | null;
    supportContact?: string | null;
    footerText?: string | null;
    orderNotice?: string | null;
  },
) {
  return prisma.siteSetting.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      siteName: input.siteName,
      siteUrl: input.siteUrl ?? null,
      siteSubtitle: input.siteSubtitle ?? null,
      logoIcon: input.logoIcon ?? null,
      logo: input.logo ?? null,
      homeHeroImage: input.homeHeroImage ?? null,
      defaultProductCover: input.defaultProductCover ?? null,
      frontendBackgroundImage: input.frontendBackgroundImage ?? null,
      homeHeroBadge: input.homeHeroBadge ?? null,
      homeHeroTitle: input.homeHeroTitle ?? null,
      homeStatLabel: input.homeStatLabel ?? null,
      homeProductsTitle: input.homeProductsTitle ?? null,
      homeSearchPlaceholder: input.homeSearchPlaceholder ?? null,
      homeFeature1Title: input.homeFeature1Title ?? null,
      homeFeature1Desc: input.homeFeature1Desc ?? null,
      homeFeature2Title: input.homeFeature2Title ?? null,
      homeFeature2Desc: input.homeFeature2Desc ?? null,
      homeFeature3Title: input.homeFeature3Title ?? null,
      homeFeature3Desc: input.homeFeature3Desc ?? null,
      homeFeature4Title: input.homeFeature4Title ?? null,
      homeFeature4Desc: input.homeFeature4Desc ?? null,
      notice: input.notice ?? null,
      supportContact: input.supportContact ?? null,
      footerText: input.footerText ?? null,
      orderNotice: input.orderNotice ?? null,
    },
    update: {
      siteName: input.siteName,
      siteUrl: input.siteUrl ?? null,
      siteSubtitle: input.siteSubtitle ?? null,
      logoIcon: input.logoIcon ?? null,
      logo: input.logo ?? null,
      homeHeroImage: input.homeHeroImage ?? null,
      defaultProductCover: input.defaultProductCover ?? null,
      frontendBackgroundImage: input.frontendBackgroundImage ?? null,
      homeHeroBadge: input.homeHeroBadge ?? null,
      homeHeroTitle: input.homeHeroTitle ?? null,
      homeStatLabel: input.homeStatLabel ?? null,
      homeProductsTitle: input.homeProductsTitle ?? null,
      homeSearchPlaceholder: input.homeSearchPlaceholder ?? null,
      homeFeature1Title: input.homeFeature1Title ?? null,
      homeFeature1Desc: input.homeFeature1Desc ?? null,
      homeFeature2Title: input.homeFeature2Title ?? null,
      homeFeature2Desc: input.homeFeature2Desc ?? null,
      homeFeature3Title: input.homeFeature3Title ?? null,
      homeFeature3Desc: input.homeFeature3Desc ?? null,
      homeFeature4Title: input.homeFeature4Title ?? null,
      homeFeature4Desc: input.homeFeature4Desc ?? null,
      notice: input.notice ?? null,
      supportContact: input.supportContact ?? null,
      footerText: input.footerText ?? null,
      orderNotice: input.orderNotice ?? null,
    },
  });
}
