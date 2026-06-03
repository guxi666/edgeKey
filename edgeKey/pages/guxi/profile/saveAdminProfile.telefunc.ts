import { assertAdminAccess, updateAdminProfile } from "../../../modules/auth/service";

export async function onSaveAdminProfile(input: {
  nickname?: string;
  username?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}) {
  assertAdminAccess();
  return updateAdminProfile(input);
}
