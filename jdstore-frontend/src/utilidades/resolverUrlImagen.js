export function resolverUrlImagen(url) {
  if (!url) return ''
  if (typeof window === 'undefined') return url

  try {
    const urlResuelta = new URL(url, window.location.origin)
    const hostsLocales = new Set(['127.0.0.1', 'localhost', 'jdstore.test'])

    if (hostsLocales.has(urlResuelta.hostname)) {
      return `${window.location.origin}${urlResuelta.pathname}`
    }

    return urlResuelta.toString()
  } catch {
    return url
  }
}
