function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function featuresToHtml(features: string[]) {
  if (!features.length) return '<ul><li><br></li></ul>'
  return `<ul>${features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join('')}</ul>`
}

export function htmlToFeatures(html: string) {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const items = Array.from(doc.querySelectorAll('li'))
    .map((item) => item.textContent?.replace(/\u00a0/g, ' ').trim() ?? '')
    .filter(Boolean)
  if (items.length) return items
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}
