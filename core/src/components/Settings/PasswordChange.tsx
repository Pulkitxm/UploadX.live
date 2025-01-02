"use client";

import { Lock } from "lucide-react";
import React, { FormEvent, useState } from "react";

import { resetPasswordForUserWithSession } from "@/actions/user";
import { showToast } from "@/components/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ERROR } from "@/types/error";

export default function PasswordChange() {
  const [config, setConfig] = useState({
    password: "",
    newPassword: "",
    confirmNewPassword: ""
  });

  async function handlePasswordReset(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (config.newPassword !== config.confirmNewPassword) {
      return showToast({
        type: "error",
        message: ERROR.PASSWORD_MISMATCH
      });
    }

    const res = await resetPasswordForUserWithSession({
      password: config.password,
      newPassword: config.newPassword
    });

    if (res.status === "error") {
      return showToast({
        type: "error",
        message: res.error
      });
    } else {
      showToast({
        type: "success",
        message: "Password updated successfully"
      });
      setConfig({
        password: "",
        newPassword: "",
        confirmNewPassword: ""
      });
    }
  }

  const fields = [
    {
      label: "Current Password",
      id: "current-password",
      type: "password",
      value: config.password,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setConfig({
          ...config,
          password: e.target.value
        })
    },
    {
      label: "New Password",
      id: "new-password",
      type: "password",
      value: config.newPassword,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setConfig({
          ...config,
          newPassword: e.target.value
        })
    },
    {
      label: "Confirm New Password",
      id: "confirm-password",
      type: "password",
      value: config.confirmNewPassword,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setConfig({
          ...config,
          confirmNewPassword: e.target.value
        })
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your password here</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePasswordReset} className="space-y-4">
          {fields.map((field, index) => (
            <div className="space-y-2" key={index}>
              <Label htmlFor="current-password">{field.label}</Label>
              <div className="relative">
                <Lock className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id={field.id}
                  type={field.type}
                  className="pl-8"
                  value={field.value}
                  onChange={field.onChange}
                  required
                />
              </div>
            </div>
          ))}
          <Button>Update Password</Button>
        </form>
      </CardContent>
    </Card>
  );
}
