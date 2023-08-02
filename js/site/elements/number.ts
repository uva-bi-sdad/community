import {BaseInput} from '.'
import Community from '..'

export class InputNumber extends BaseInput {
  e: HTMLInputElement
  parsed: {min: number; max: number}
  min_indicator?: HTMLElement
  max_indicator?: HTMLElement
  current_default: number
  constructor(e: HTMLElement, site: Community) {
    super(e, site)
  }
}
