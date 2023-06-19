import {describe, expect, test} from '@jest/globals'
import {RegisteredElements} from '../../js/types'
import {TutorialManager, Tutorials} from '../../js/site/tutorials'

const button_wrap = document.createElement('div'),
  button = document.createElement('button')
button_wrap.className = 'nav-item'
button.id = 'dom_element'
button.innerText = 'Menu Button'
button.addEventListener('click', function () {
  this.dataset.clicked = 'true'
})
button_wrap.appendChild(button)
document.body.appendChild(button_wrap)

const _u: RegisteredElements = {
  registered_element: {
    id: 'registered_element',
    e: document.createElement('div'),
    set: function (value: string) {
      this.e.innerText = value
    },
  },
}

const example: Tutorials = {
  minimal: {
    name: 'minimal',
    title: 'Minimal',
    description: 'Minimal tutorial.',
    steps: [
      {
        focus: '#target',
        description: 'step description',
      },
    ],
  },
  expanded: {
    name: 'expanded',
    title: 'Expanded',
    description: 'Tutorial with initial settings.',
    steps: [
      {
        focus: '#target',
        description: 'step description',
        before: {'settings.setting_name': 'value'},
      },
    ],
  },
  running: {
    name: 'running',
    title: 'Running',
    reset: true,
    description: 'Tutorial to be run.',
    steps: [
      {
        focus: '#dom_element',
        description: 'Focus element in DOM.',
        before: ['click'],
      },
      {
        focus: 'registered_element',
        description: 'Focus registered element.',
        before: ['value:a'],
        option: 'b',
        after: ['set'],
        time: 1e5,
      },
      {
        focus: 'nav:Menu Button',
        description: 'Focus nav button.',
        after: {registered_element: 'c', 1: 'click'},
      },
    ],
  },
}
const manager = new TutorialManager(example, _u)

describe('when initialized', () => {
  test('entries are initialized', async () => {
    expect(manager.tutorials.minimal.n_steps).toEqual(1)
  })
  test('menu is filled', async () => {
    const header = manager.menu.querySelector('.tutorial-listing .card-header') as HTMLDivElement
    expect(header && header.innerText).toEqual(example.minimal.title)
  })
  test('initial settings are displayed', async () => {
    const value = manager.menu.querySelector('.syntax-value') as HTMLSpanElement
    expect(value && value.innerText).toEqual('value')
  })
})

describe('when running a tutorial', () => {
  test('steps advance as expected', async () => {
    jest.useFakeTimers()
    manager.start_tutorial(void 0, 'running')
    jest.runOnlyPendingTimers()

    // step 1
    expect(manager.container.classList).not.toContain('hidden')
    expect(manager.in_progress).toEqual('running')
    expect(manager.header.innerText).toEqual(example.running.title)
    expect(manager.dialog.innerText).toEqual(example.running.steps[0].description)
    expect(manager.current_element).toStrictEqual(button)
    expect(button.dataset.clicked).toEqual('true')

    // step 2
    manager.progress_tutorial()
    jest.runOnlyPendingTimers()
    expect(manager.dialog.innerText).toEqual(example.running.steps[1].description)
    expect(manager.current_site_element).toStrictEqual(_u.registered_element)
    expect(manager.current_element).toStrictEqual(_u.registered_element.e)
    expect(_u.registered_element.e.innerText).toEqual('a')

    // step 3
    manager.current_time = 0
    jest.runAllTimers()
    expect(manager.dialog.innerText).toEqual(example.running.steps[2].description)
    expect(manager.current_element).toStrictEqual(button)
    expect(_u.registered_element.e.innerText).toEqual('b')

    // end
    manager.progress_tutorial()
    jest.runOnlyPendingTimers()
    expect(_u.registered_element.e.innerText).toEqual('c')
    expect(manager.container.classList).toContain('hidden')
    expect(manager.in_progress).toEqual('')
  })
})
