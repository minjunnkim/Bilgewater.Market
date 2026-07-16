import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Revalidation is not configured." },
      { status: 501 },
    );
  }

  const { searchParams } = new URL(request.url);
  if (searchParams.get("secret") !== secret) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  revalidatePath("/");
  revalidatePath("/inventory");
  revalidatePath("/inventory", "layout");
  revalidatePath("/contact");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
