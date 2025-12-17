import { NextRequest, NextResponse } from "next/server";
import { getBucket } from "@/lib/gcs/client";

export async function POST(request: NextRequest) {
  try {
    const { gcsUrl } = await request.json();

    if (!gcsUrl) {
      return NextResponse.json(
        { error: "GCS URL is required" },
        { status: 400 }
      );
    }

    // Extract filename from gs://bucket-name/filename or full path
    const bucket = getBucket();
    const filename = gcsUrl.replace(`gs://${bucket.name}/`, "").split("?")[0];
    const file = bucket.file(filename);

    // Check if file exists
    const [exists] = await file.exists();
    if (!exists) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Generate signed URL for download (valid for 1 hour)
    const [signedUrl] = await file.getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + 60 * 60 * 1000, // 1 hour
    });

    return NextResponse.json({ signedUrl });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return NextResponse.json(
      { error: "Failed to generate download URL" },
      { status: 500 }
    );
  }
}

