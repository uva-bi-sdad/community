import {patterns} from './patterns'
export function set_description(e: HTMLElement, info) {
  const description = info.long_description || info.description || info.short_description || ''
  let has_equation = patterns.has_equation.test(description)
  if (has_equation) {
    const tags = description.split(patterns.bracket_content)
    for (let i = tags.length; i--; ) {
      const t = tags[i]
      if (t && '/' !== t.substring(0, 1)) {
        const p = t.split(patterns.space),
          n = p.length
        has_equation = patterns.math_tags.test(p[0])
        if (!has_equation) break
        for (let a = 1; a < n; a++) {
          has_equation = patterns.math_attributes.test(p[a])
          if (!has_equation) break
        }
        if (!has_equation) break
      }
    }
  }
  e[has_equation ? 'innerHTML' : 'innerText'] = description
}
