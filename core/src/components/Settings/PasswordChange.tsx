"use client";

import React from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export default function PasswordChange() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your password here</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-password">Current Password</Label>
          <div className="relative">
            <Lock className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input id="current-password" type="password" className="pl-8" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-password">New Password</Label>
          <div className="relative">
            <Lock className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input id="new-password" type="password" className="pl-8" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm New Password</Label>
          <div className="relative">
            <Lock className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input id="confirm-password" type="password" className="pl-8" />
          </div>
        </div>
        <Button>Update Password</Button>
      </CardContent>
    </Card>
  );
}
