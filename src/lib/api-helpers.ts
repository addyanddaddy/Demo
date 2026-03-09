import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ZodSchema } from "zod";

export function success(data: unknown, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function error(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { session: null, error: error("Unauthorized", 401) };
  }
  return { session, error: null };
}

export async function validateBody<T>(req: NextRequest, schema: ZodSchema<T>) {
  try {
    const body = await req.json();
    const parsed = schema.parse(body);
    return { data: parsed, error: null };
  } catch (e: unknown) {
    const zodError = e as { errors?: Array<{ message: string }> };
    return {
      data: null,
      error: error(zodError.errors?.[0]?.message || "Invalid input", 422),
    };
  }
}

export function getSearchParams(req: NextRequest) {
  return Object.fromEntries(req.nextUrl.searchParams.entries());
}

export function paginate(page: number, limit: number) {
  return {
    skip: (page - 1) * limit,
    take: limit,
  };
}
