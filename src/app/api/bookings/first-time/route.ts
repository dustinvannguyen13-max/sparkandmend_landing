import { NextResponse } from "next/server";
import { isFirstTimeCustomer } from "@/lib/booking-promos";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const address = searchParams.get("address");

  if (!email || !address) {
    return NextResponse.json(
      { error: "Email and address are required." },
      { status: 400 },
    );
  }

  const isFirstTime = await isFirstTimeCustomer(email, address);
  return NextResponse.json({ isFirstTime });
}
