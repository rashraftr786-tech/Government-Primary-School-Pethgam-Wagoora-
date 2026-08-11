const DB_NAME = "ps-pethgam-offline";
const STORE = "mutations";

type PendingMutation = {
  id?: number;
  endpoint: string;
  method: "POST" | "PUT" | "PATCH" | "DELETE";
  body: unknown;
  createdAt: string;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function queueMutation(mutation: PendingMutation) {
  if (typeof indexedDB === "undefined") return;
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).add(mutation);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function flushMutationQueue() {
  if (typeof indexedDB === "undefined") return;
  const db = await openDb();
  const rows: PendingMutation[] = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const request = tx.objectStore(STORE).getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  for (const row of rows) {
    try {
      const response = await fetch(row.endpoint, {
        method: row.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(row.body)
      });
      if (response.ok && row.id !== undefined) {
        const tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).delete(row.id);
      }
    } catch {
      // Keep mutation queued for the next online event.
    }
  }
}

export function registerOfflineSync() {
  if (typeof window === "undefined") return;
  window.addEventListener("online", () => void flushMutationQueue());
}
