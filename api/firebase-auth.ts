const FIREBASE_API_KEY = "AIzaSyDTx4QDE7opjVT0qZ3WqR_pkhnExi4Kt04";

export type VerifiedFirebaseUser = {
  localId: string;
  email?: string;
  displayName?: string;
};

export async function verifyFirebaseIdToken(token: string) {
  if (!token) return null;
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: token }),
    },
  );
  if (!response.ok) return null;
  const data = (await response.json()) as {
    users?: VerifiedFirebaseUser[];
  };
  return data.users?.[0] || null;
}

export async function getFirebaseUser(request: Request) {
  const authorization = request.headers.get("authorization") || "";
  const token = authorization.startsWith("Bearer ")
    ? authorization.slice(7)
    : "";
  return verifyFirebaseIdToken(token);
}
