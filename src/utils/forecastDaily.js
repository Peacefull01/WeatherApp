// 3-hour slots → days (max 5).
export function aggregateForecastByDay(list) {
  if (!list?.length) return [];

  const buckets = {};

  for (const item of list) {
    const d = new Date(item.dt * 1000);
    const p = n => String(n).padStart(2, '0');
    const key = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
    if (!buckets[key]) {
      buckets[key] = {
        date: d,
        min: Infinity,
        max: -Infinity,
        samples: [],
      };
    }
    const b = buckets[key];
    const tMin = item.main?.temp_min ?? item.main?.temp;
    const tMax = item.main?.temp_max ?? item.main?.temp;
    b.min = Math.min(b.min, tMin, item.main?.temp ?? tMin);
    b.max = Math.max(b.max, tMax, item.main?.temp ?? tMax);
    b.samples.push({item, hour: d.getHours()});
  }

  const sortedKeys = Object.keys(buckets).sort(
    (a, b) => new Date(a) - new Date(b),
  );

  return sortedKeys.slice(0, 5).map(key => {
    const b = buckets[key];
    // Icon from slot closest to noon.
    let best = b.samples[0];
    let bestDiff = 24;
    for (const s of b.samples) {
      const diff = Math.abs(s.hour - 12);
      if (diff < bestDiff) {
        bestDiff = diff;
        best = s;
      }
    }
    const w = best.item.weather?.[0] ?? {};
    return {
      key,
      date: b.date,
      min: Math.round(b.min),
      max: Math.round(b.max),
      weatherMain: w.main ?? 'Clouds',
      description: w.description ?? '',
    };
  });
}
