import { Storage } from '@google-cloud/storage';

let storage: Storage | null = null;

export function getStorageClient(): Storage {
  if (!storage) {
    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    
    // Try to use key file if provided
    if (credentialsPath) {
      try {
        storage = new Storage({
          keyFilename: credentialsPath,
          projectId: projectId,
        });
        return storage;
      } catch (error) {
        console.warn('Failed to load credentials from key file, falling back to Application Default Credentials');
      }
    }
    
    // Fall back to Application Default Credentials (works with gcloud auth)
    storage = new Storage({
      projectId: projectId,
      // This will use Application Default Credentials automatically
    });
  }

  return storage;
}

export function getBucket() {
  const storage = getStorageClient();
  const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET!;
  return storage.bucket(bucketName);
}

