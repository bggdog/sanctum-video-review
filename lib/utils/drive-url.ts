/**
 * Converts Google Drive sharing URLs to direct video URLs for playback
 * Handles formats like:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/file/d/FILE_ID/view
 */
export function convertGoogleDriveUrl(driveUrl: string): string {
  // Extract file ID from various Google Drive URL formats
  let fileId = '';
  
  // Format: /file/d/FILE_ID/view or /file/d/FILE_ID
  const fileIdMatch = driveUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileIdMatch) {
    fileId = fileIdMatch[1];
  } else {
    // Format: ?id=FILE_ID
    const idMatch = driveUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch) {
      fileId = idMatch[1];
    }
  }
  
  if (!fileId) {
    // If we can't extract an ID, return the original URL
    return driveUrl;
  }
  
  // Convert to direct video URL for streaming
  // Using the preview format which works better for video playback
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

/**
 * Validates if a URL is a Google Drive URL
 */
export function isGoogleDriveUrl(url: string): boolean {
  return url.includes('drive.google.com');
}

