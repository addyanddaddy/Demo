import { NextRequest } from "next/server";
import { success, error } from "@/lib/api-helpers";
import { suggestRoles } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { description } = await req.json();
    if (!description) return error("description is required", 422);

    const result = await suggestRoles(description);
    return success(result);
  } catch (e) {
    console.error("AI suggest roles error:", e);
    return error("AI role suggestion failed", 500);
  }
}
