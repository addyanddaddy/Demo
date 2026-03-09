import { NextRequest } from "next/server";
import { success, error, requireAuth } from "@/lib/api-helpers";
import { smartMatch } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const { requisitionId } = await req.json();
    if (!requisitionId) return error("requisitionId is required", 422);

    const result = await smartMatch(requisitionId);
    return success(result);
  } catch (e) {
    console.error("AI match error:", e);
    return error("AI matching failed", 500);
  }
}
