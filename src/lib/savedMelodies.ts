const SAVED_MELODIES_KEY = "absolutepitch:saved-melodies";

export interface SavedMelody {
  id: string;
  notes: number[];
  label: string; // e.g. "도(C) 메이저 · I - V - vi - IV"
  createdAt: string;
}

export function loadSavedMelodies(): SavedMelody[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SAVED_MELODIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persist(melodies: SavedMelody[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SAVED_MELODIES_KEY, JSON.stringify(melodies));
}

export function saveMelody(notes: number[], label: string): SavedMelody[] {
  const melodies = loadSavedMelodies();
  const entry: SavedMelody = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    notes,
    label,
    createdAt: new Date().toISOString(),
  };
  // Newest first.
  const updated = [entry, ...melodies];
  persist(updated);
  return updated;
}

export function deleteMelody(id: string): SavedMelody[] {
  const updated = loadSavedMelodies().filter((m) => m.id !== id);
  persist(updated);
  return updated;
}
