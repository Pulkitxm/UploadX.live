"use client";

import React from "react";
import { Mail, ChromeIcon as Google } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function LoginMethods() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login Methods</CardTitle>
        <CardDescription>Manage your login methods</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-gray-500" />
            <span>Email</span>
          </div>
          <span className="text-sm text-green-600">Connected</span>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Google className="h-5 w-5 text-gray-500" />
            <span>Google</span>
          </div>
          <Button variant="outline" size="sm">
            Connect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
