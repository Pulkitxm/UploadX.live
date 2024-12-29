import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import Link from "next/link";

export default function AlreadyVerified() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>You have already verified your email.</CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <p>
            You have already verified your email. Please proceed to your{" "}
            <Link className="underline" href="/">
              dashboard
            </Link>
            .
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
