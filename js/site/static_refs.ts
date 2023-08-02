export const keymap = {
  Enter: 'select',
  NumpadEnter: 'select',
  ArrowUp: 'move',
  Home: 'move',
  ArrowDown: 'move',
  End: 'move',
  Escape: 'close',
  Tab: 'close',
}
export const filter_components = {
  Time: ['first', 'selected', 'last'],
  summary: ['missing', 'min', 'q1', 'mean', 'median', 'q3', 'max'],
}

export const tooltip_icon_rule =
  'button.has-note::after,.button-wrapper.has-note ' +
  'button::before,.has-note legend::before,.has-note ' +
  'label::before,.wrapper.has-note > div > label::before{display:none}'
