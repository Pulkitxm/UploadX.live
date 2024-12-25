import { AuthMode } from "@/types/auth";

// Icons
import { Mail } from "lucide-react";
import { FaGoogle } from "react-icons/fa";

// Settings items
import PasswordChange from "@/components/Settings/PasswordChange";
import UserInfo from "@/components/Settings/UserInfo";
import LoginMethods from "@/components/Settings/LoginMethods";

export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const PROFILE_MAX_FILE_SIZE = 1 * 1024 * 1024;

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
