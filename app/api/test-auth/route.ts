import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    // Test Supabase connection
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const envCheck = {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
      url: supabaseUrl ? supabaseUrl.substring(0, 20) + "..." : "missing",
    };

    // Try to create Supabase client
    let clientCreated = false;
    let authTest = null;
    try {
      const supabase = await createClient();
      clientCreated = !!supabase;
      
      // Try a simple auth operation
      const { data, error } = await supabase.auth.getSession();
      authTest = {
        success: !error,
        error: error?.message || null,
        hasSession: !!data?.session,
      };
    } catch (error: any) {
      authTest = {
        success: false,
        error: error?.message || "Unknown error",
      };
    }

    return NextResponse.json({
      env: envCheck,
      clientCreated,
      authTest,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Unknown error",
        stack: process.env.NODE_ENV === "development" ? error?.stack : undefined,
      },
      { status: 500 }
    );
  }
}

