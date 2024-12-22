import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterForm() {
  return (
    <form>
      <div className="space-y-4">
        <Input type="text" placeholder="Username" required />
        <Input type="email" placeholder="Email" required />
        <Input type="password" placeholder="Password" required />
        <Input type="password" placeholder="Confirm Password" required />
        <Button className="w-full">Register</Button>
      </div>
    </form>
  );
}
