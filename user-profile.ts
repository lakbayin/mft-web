import type { User } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function createUserProfile(user: User, displayName: string) {
  await setDoc(
    doc(db, "userProfiles", user.uid),
    {
      uid: user.uid,
      email: user.email || "",
      displayName,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function touchUserProfile(user: User) {
  await setDoc(
    doc(db, "userProfiles", user.uid),
    {
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "",
      lastLoginAt: serverTimestamp(),
    },
    { merge: true },
  );
}
