import { NextRequest } from "next/server";
import { success, error, requireAuth } from "@/lib/api-helpers";
import { getCrewRecommendations } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  const userId = (auth.session!.user as any).id;

  try {
    const { projectId } = await req.json();
    if (!projectId) return error("projectId is required", 422);

    const result = await getCrewRecommendations(userId, projectId);
    return success(result);
  } catch (e) {
    console.error("AI recommend error:", e);
    return error("AI recommendations failed", 500);
  }
}
