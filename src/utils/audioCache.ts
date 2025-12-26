import * as FileSystem from 'expo-file-system';
import * as Crypto from 'expo-crypto';

/**
 * Directory inside FileSystem.cacheDirectory where audio files are stored.
 */
const AUDIO_CACHE_DIR = `${FileSystem.cacheDirectory}audioCache/`;

/** Ensure the audio cache directory exists */
async function ensureCacheDir() {
    const dirInfo = await FileSystem.getInfoAsync(AUDIO_CACHE_DIR);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(AUDIO_CACHE_DIR, { intermediates: true });
    }
}

/**
 * Return a local URI for a remote audio file, downloading & caching if necessary.
 * @param remoteUri   The remote HTTP/HTTPS URL of the audio file.
 * @returns           The local filesystem URI to play via expo-av / expo-audio.
 */
export async function getCachedAudioUri(remoteUri: string): Promise<string> {
    if (!remoteUri) throw new Error('Remote URI is empty');

    await ensureCacheDir();

    // Generate a stable filename using an md5 hash of the URL
    const filenameHash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        remoteUri
    );
    const extensionMatch = remoteUri.match(/\.[a-zA-Z0-9]+(?=$|\?)/);
    const extension = extensionMatch ? extensionMatch[0] : '.mp3';
    const localPath = `${AUDIO_CACHE_DIR}${filenameHash}${extension}`;

    const info = await FileSystem.getInfoAsync(localPath);
    if (!info.exists) {
        // Download with cache option; if download fails, just return remote URI
        try {
            await FileSystem.downloadAsync(remoteUri, localPath);
            return localPath;
        } catch (err) {
            console.warn('Failed to cache audio; falling back to remote URL', err);
            return remoteUri;
        }
    }

    return localPath;
}

/**
 * Clear all cached audio files. Useful for debugging or storage management.
 */
export async function clearAudioCache() {
    const dirInfo = await FileSystem.getInfoAsync(AUDIO_CACHE_DIR);
    if (dirInfo.exists) {
        await FileSystem.deleteAsync(AUDIO_CACHE_DIR, { idempotent: true });
    }
    await FileSystem.makeDirectoryAsync(AUDIO_CACHE_DIR, { intermediates: true });
} 