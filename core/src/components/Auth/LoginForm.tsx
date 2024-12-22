import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
  return (
    <form>
      <div className="space-y-4">
        <Input type="email" placeholder="Email" required />
        <Input type="password" placeholder="Password" required />
        <Button className="w-full">Login</Button>
      </div>
    </form>
  );
}
