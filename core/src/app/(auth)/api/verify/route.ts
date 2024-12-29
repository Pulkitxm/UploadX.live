import { auth } from "@/auth";
import { verifyUser } from "@/lib/db/user";
import { ERROR } from "@/types/error";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { status: "error", error: ERROR.INVALID_CODE },
      { status: 400 }
    );
  }

  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json(
      { status: "error", error: ERROR.USER_NOT_FOUND },
      { status: 401 }
    );
  }

  const userId = session.user.id;

  const res = await verifyUser({ code, userId });

  if (res.status === "error") {
    return NextResponse.json(
      { status: "error", error: res.error },
      { status: 400 }
    );
  }

  return NextResponse.redirect(
    new URL("/verify-email", request.nextUrl.origin)
  );
}

export const dynamic = "force-dynamic";
