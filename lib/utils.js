export function normalizeData(data) {
  const normalized = { ...data };
  if (/^\n$/.test(normalized?.contents?.ops?.[0]?.insert)) {
    normalized.contents = null;
  }
  if (normalized?.zooms?.length) {
    normalized.zooms = normalized.zooms.map((z) => ({
      ...z,
      contents: !/^\n$/.test(z?.contents?.ops?.[0]?.insert) ? z?.contents : null,
    }));
  }

  return normalized;
}
