import jwt from "jsonwebtoken";
// Icons
import { Mail, Settings } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { SiProtondrive } from "react-icons/si";

// Settings items
import LoginMethods from "@/components/Settings/LoginMethods";
import PasswordChange from "@/components/Settings/PasswordChange";
import UserInfo from "@/components/Settings/UserInfo";
import StorageIndicator from "@/components/Sidebar/StorageIndicator";
import { SECRET } from "@/lib/constants";
import { AuthMode } from "@/types/auth";
import { SIDEBAR_MENU_ITEM_TYPE } from "@/types/dash";

export const STORAGE_QUOTA = 500 * 1024 * 1024;
export const PROFILE_MAX_FILE_SIZE = 5 * 1024 * 1024;
export const MAX_STORAGE_SIZE = 500 * 1024 * 1024;

export const VERIFY_CODE_EXPIRY = 5 * 60 * 1000;
export const MAX_VERIFICATION_RESEND_ATTEMPTS_LIMIT = 5;
export const MAX_VERIFICATION_ATTEMPTS_LIMIT = 10;
export const VERIFY_CODE_RESEND_GAP = 10 * 1000;
export const VERIFY_CODE_GAP = 5 * 1000;

export const SIDEBAR_MENU_ITEMS: SIDEBAR_MENU_ITEM_TYPE[] = [
  {
    type: "ICON",
    icon: SiProtondrive,
    label: "Explorer",
    href: "/",
    position: "top"
  },
  {
    type: "COMPONENT",
    position: "bottom",
    component: StorageIndicator
  },
  {
    type: "ICON",
    icon: Settings,
    label: "Settings",
    href: "/settings",
    position: "bottom"
  }
];

export const LOGIN_METHODS = [
  {
    name: AuthMode.GOOGLE,
    icon: FaGoogle
  },
  {
    name: AuthMode.EMAIL,
    icon: Mail
  }
];

export const SETTINGS_ITEMS = (LOGIN_TYPE: AuthMode) => [
  {
    component: UserInfo,
    show: true
  },
  {
    component: LoginMethods,
    show: true
  },
  {
    component: PasswordChange,
    show: LOGIN_TYPE === AuthMode.EMAIL
  }
];

export function getToken(userId: string, s?: string) {
  const secret = s ?? SECRET;
  try {
    const token = jwt.sign(
      {
        id: userId
      },
      secret,
      {
        expiresIn: "1h"
      }
    );
    return token;
  } catch (error) {
    console.log("error: ", error);

    if (error) {
      return "";
    }
  }
  return "";
}
