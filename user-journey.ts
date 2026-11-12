import type { User } from "firebase/auth";
import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";

export type VisitStatus = Record<string, "visited" | "want">;
export type VisitEntry = {
  timestamp: number;
  dish?: string;
  note?: string;
};

export type UserJourney = {
  favorites: string[];
  visitStatus: VisitStatus;
  visitedAt: Record<string, number>;
  visitLog: Record<string, VisitEntry[]>;
};

const EMPTY_JOURNEY: UserJourney = { favorites: [], visitStatus: {}, visitedAt: {}, visitLog: {} };

const journeyRef = (uid: string) => doc(db, "userJourneys", uid);

function readLocalJourney(): UserJourney {
  try {
    return normalizeJourney({
      favorites: JSON.parse(
        localStorage.getItem("beh-kain-kita-favorites") || "[]",
      ),
      visitStatus: JSON.parse(
        localStorage.getItem("beh-kain-kita-visit-status") || "{}",
      ),
      visitedAt: JSON.parse(
        localStorage.getItem("beh-kain-kita-visited-at") || "{}",
      ),
      visitLog: JSON.parse(
        localStorage.getItem("beh-kain-kita-visit-log") || "{}",
      ),
    });
  } catch {
    return EMPTY_JOURNEY;
  }
}

function saveLocalJourney(journey: UserJourney) {
  localStorage.setItem(
    "beh-kain-kita-favorites",
    JSON.stringify(journey.favorites),
  );
  localStorage.setItem(
    "beh-kain-kita-visit-status",
    JSON.stringify(journey.visitStatus),
  );
  localStorage.setItem(
    "beh-kain-kita-visited-at",
    JSON.stringify(journey.visitedAt),
  );
  localStorage.setItem(
    "beh-kain-kita-visit-log",
    JSON.stringify(journey.visitLog),
  );
}

function normalizeJourney(value: Partial<UserJourney> | undefined): UserJourney {
  const visitedAt =
    value?.visitedAt && typeof value.visitedAt === "object"
      ? value.visitedAt
      : {};
  const storedLog =
    value?.visitLog && typeof value.visitLog === "object"
      ? value.visitLog
      : {};
  const visitLog: Record<string, VisitEntry[]> = Object.fromEntries(
    Object.entries(storedLog).map(([name, entries]) => [
      name,
      Array.isArray(entries)
        ? entries
            .map((entry) =>
              typeof entry === "number"
                ? { timestamp: entry }
                : entry && typeof entry === "object" && "timestamp" in entry
                  ? (entry as VisitEntry)
                  : null,
            )
            .filter((entry): entry is VisitEntry => Boolean(entry))
        : [],
    ]),
  );
  Object.entries(visitedAt).forEach(([name, timestamp]) => {
    if (!Array.isArray(visitLog[name]) || !visitLog[name].length) {
      visitLog[name] = [{ timestamp }];
    }
  });
  return {
    favorites: Array.isArray(value?.favorites) ? value.favorites : [],
    visitStatus:
      value?.visitStatus && typeof value.visitStatus === "object"
        ? value.visitStatus
        : {},
    visitedAt,
    visitLog,
  };
}

export async function connectUserJourney(user: User): Promise<UserJourney> {
  const local = readLocalJourney();
  const snapshot = await getDoc(journeyRef(user.uid));
  const remote = normalizeJourney(
    snapshot.exists() ? (snapshot.data() as Partial<UserJourney>) : undefined,
  );
  const merged: UserJourney = {
    favorites: Array.from(new Set([...remote.favorites, ...local.favorites])),
    visitStatus: { ...local.visitStatus, ...remote.visitStatus },
    visitedAt: { ...local.visitedAt, ...remote.visitedAt },
    visitLog: Object.fromEntries(
      Array.from(
        new Set([...Object.keys(local.visitLog), ...Object.keys(remote.visitLog)]),
      ).map((name) => [
        name,
        Array.from(
          new Map(
            [...(local.visitLog[name] || []), ...(remote.visitLog[name] || [])].map(
              (entry) => [`${entry.timestamp}:${entry.dish || ""}:${entry.note || ""}`, entry],
            ),
          ).values(),
        ).sort((a, b) => a.timestamp - b.timestamp),
      ]),
    ),
  };

  await setDoc(
    journeyRef(user.uid),
    {
      ...merged,
      ownerId: user.uid,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
  saveLocalJourney(merged);
  return merged;
}

export function subscribeToUserJourney(
  user: User,
  onChange: (journey: UserJourney) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    journeyRef(user.uid),
    (snapshot) => {
      const journey = normalizeJourney(
        snapshot.exists() ? (snapshot.data() as Partial<UserJourney>) : undefined,
      );
      saveLocalJourney(journey);
      onChange(journey);
    },
    onError,
  );
}

export async function saveUserJourney(user: User, journey: UserJourney) {
  saveLocalJourney(journey);
  await setDoc(
    journeyRef(user.uid),
    {
      ...journey,
      ownerId: user.uid,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export function getLocalJourney() {
  return readLocalJourney();
}
