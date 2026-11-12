const firebaseStorageBase = "https://firebasestorage.googleapis.com/v0/b/beh-kain-kita.firebasestorage.app/o";

export function firebaseStorageUrl(path: string) {
  return `${firebaseStorageBase}/${encodeURIComponent(path)}?alt=media`;
}
