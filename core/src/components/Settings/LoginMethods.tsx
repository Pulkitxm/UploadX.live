"use client";

import { useSession } from "next-auth/react";
import React, { Fragment } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LOGIN_METHODS } from "@/lib/config";
import { AuthMode } from "@/types/auth";

export default function LoginMethods() {
  const session = useSession();

  const loginMethod = session.data?.user.loginType;

  if (!loginMethod) {
    return <></>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login Methods</CardTitle>
        <CardDescription>Your connected login methods</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {LOGIN_METHODS.map((mode, index) => (
          <Fragment key={mode.name}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <mode.icon className="h-5 w-5 text-gray-500" />
                <span>{mode.name}</span>
              </div>
              {loginMethod === mode.name ? (
                <span className="text-sm text-green-600">Connected</span>
              ) : (
                <span className="text-sm text-gray-500">Not connected</span>
              )}
            </div>

            {index !== Object.values(AuthMode).length - 1 && <Separator />}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
}
