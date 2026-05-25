export function normalizeDeveloperName(name: string) {
  return name.trim().replace(/\s+/g, ' ');
}

export function getDeveloperKey(name: string) {
  return normalizeDeveloperName(name).toLowerCase();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function getDeveloperNameRegex(name: string) {
  return new RegExp(`^${escapeRegExp(normalizeDeveloperName(name))}$`, 'i');
}
