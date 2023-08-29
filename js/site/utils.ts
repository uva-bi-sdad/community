import {MeasureInfo} from '../types'
import {patterns} from './patterns'
export function set_description(e: HTMLElement, info: MeasureInfo) {
  let description = info.long_description || info.description || info.short_description || ''
  const subs: Map<string, string> = new Map()
  for (let l; (l = patterns.href.exec(description)); ) {
    subs.set(l[0], '<a href="' + l[1] + '" target="_blank" rel="noreferrer">' + (l.length > 2 ? l[2] : l[1]) + '</a>')
  }
  if (subs.size) {
    subs.forEach((f, r) => {
      description = description.replace(r, f)
    })
  }
  let has_html = patterns.has_html.test(description)
  if (has_html) {
    const tags = description.split(patterns.bracket_content)
    for (let i = tags.length; i--; ) {
      const t = tags[i]
      if (t && '/' !== t.substring(0, 1)) {
        const p = t.split(patterns.space),
          n = p.length
        has_html = patterns.html_tags.test(p[0])
        if (!has_html) break
        for (let a = 1; a < n; a++) {
          has_html = patterns.html_attributes.test(p[a])
          if (!has_html) break
        }
        if (!has_html) break
      }
    }
  }
  e[has_html ? 'innerHTML' : 'innerText'] = description
}
