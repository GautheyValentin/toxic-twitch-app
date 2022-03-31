export function loadState(key: string) {
  try {
    const serializedState = localStorage.getItem(key);
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    return undefined;
  }
}

export async function saveState(states: { key: string; value: any }) {
  try {
    const serializedState = JSON.stringify(states.value);
    localStorage.setItem(states.key, serializedState);
  } catch {}
}
