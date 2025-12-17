import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { getBucket } from "@/lib/gcs/client";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { filename, contentType } = await request.json();

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: "Filename and content type are required" },
        { status: 400 }
      );
    }

    // Validate file type (only video files)
    if (!contentType.startsWith("video/")) {
      return NextResponse.json(
        { error: "Only video files are allowed" },
        { status: 400 }
      );
    }

    const bucket = getBucket();
    const fileExtension = filename.split(".").pop();
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    const file = bucket.file(uniqueFilename);

    // Generate signed URL for upload (valid for 1 hour)
    const [signedUrl] = await file.getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 60 * 60 * 1000, // 1 hour
      contentType,
    });

    return NextResponse.json({
      signedUrl,
      filename: uniqueFilename,
      publicUrl: `gs://${bucket.name}/${uniqueFilename}`,
    });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}

