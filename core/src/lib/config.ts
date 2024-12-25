import { AuthMode } from "@/types/auth";
import jwt from "jsonwebtoken";

// Icons
import { Mail } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { SiProtondrive } from "react-icons/si";

// Settings items
import PasswordChange from "@/components/Settings/PasswordChange";
import UserInfo from "@/components/Settings/UserInfo";
import LoginMethods from "@/components/Settings/LoginMethods";
import { SECRET } from "./constants";

export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const PROFILE_MAX_FILE_SIZE = 1 * 1024 * 1024;

export const SIDEBAR_MENU_ITEMS = [
  { icon: SiProtondrive, label: "Explorer", href: "/" },
];

export const LOGIN_METHODS = [
  {
    name: AuthMode.GOOGLE,
    icon: FaGoogle,
  },
  {
    name: AuthMode.EMAIL,
    icon: Mail,
  },
];

export const SETTINGS_ITEMS = [
  {
    component: UserInfo,
    show: true,
  },
  {
    component: LoginMethods,
    show: true,
  },
  {
    component: PasswordChange,
  },
];

export function getToken(userId: string, s?: string) {
  let secret = s ?? SECRET;
  try {
    const token = jwt.sign({ id: userId }, secret, { expiresIn: "1h" });
    return token;
  } catch (error) {
    if (error) {
      let a = 1;
    }
  }
  return "";
}
