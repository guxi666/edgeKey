import { assertAdminAccess } from "../../../modules/auth/service";
import { saveSiteSetting } from "../../../modules/site/service";

export async function onSaveSiteSettings(input: {
  siteName: string;
  siteUrl?: string;
  siteSubtitle?: string;
  logoIcon?: string;
  logo?: string;
  homeHeroImage?: string;
  defaultProductCover?: string;
  frontendBackgroundImage?: string;
  homeHeroBadge?: string;
  homeHeroTitle?: string;
  homeStatLabel?: string;
  homeProductsTitle?: string;
  homeSearchPlaceholder?: string;
  homeFeature1Title?: string;
  homeFeature1Desc?: string;
  homeFeature2Title?: string;
  homeFeature2Desc?: string;
  homeFeature3Title?: string;
  homeFeature3Desc?: string;
  homeFeature4Title?: string;
  homeFeature4Desc?: string;
  notice?: string;
  supportContact?: string;
  footerText?: string;
  orderNotice?: string;
}) {
  assertAdminAccess();
  return saveSiteSetting(input);
}
