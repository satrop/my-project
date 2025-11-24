import { initComponent } from '../../utils/initComponent.js'

class AccordionComponent {
  constructor(accordion) {
    this.accordion = accordion
    this.allowMultiple = accordion.dataset.allowMultiple === 'true'
    // Only select direct child accordion items to support nesting
    this.items = this.getDirectChildren(accordion, '[data-accordion-item]')
    this.triggers = this.items.map(item => item.querySelector('[data-accordion-trigger]')).filter(Boolean)
    this.isCheckboxAccordion = accordion.classList.contains('ast-checkbox-accordion')
    this.mediaQuery = window.matchMedia('(min-width: 1024px)')

    if (this.triggers.length === 0 || this.items.length === 0) return

    this.accordion.accordionComponent = this
    this.init()
  }

  /**
   * Get only direct children matching a selector, excluding nested accordion items
   */
  getDirectChildren(parent, selector) {
    const allMatches = Array.from(parent.querySelectorAll(selector))
    return allMatches.filter(element => {
      // Find the closest accordion parent
      const closestAccordion = element.parentElement.closest('[data-js="accordion"]')
      // Only include if this accordion is the direct parent
      return closestAccordion === parent
    })
  }

  init() {
    this.triggers.forEach((trigger, index) => {
      trigger.addEventListener('click', (e) => this.handleClick(index, e))
      trigger.addEventListener('keydown', (e) => this.handleKeydown(e, index))
    })

    // Handle responsive behavior for checkbox accordions
    if (this.isCheckboxAccordion) {
      this.handleResponsiveState()
      this.mediaQuery.addEventListener('change', () => this.handleResponsiveState())
    }
  }

  handleClick(index, event) {
    const trigger = this.triggers[index]
    const item = this.items[index]
    if (!trigger || !item) return

    // Check if the click originated from a nested accordion
    const clickedAccordion = event.target.closest('[data-js="accordion"]')
    if (clickedAccordion && clickedAccordion !== this.accordion) {
      // Click is from a nested accordion, ignore it
      return
    }

    // Prevent toggling on desktop for checkbox accordions
    if (this.isCheckboxAccordion && this.mediaQuery.matches) {
      return
    }

    const isExpanded = item.getAttribute('data-expanded') === 'true'

    if (!this.allowMultiple) {
      this.collapseAll(index)
    }

    this.setExpandedState(index, !isExpanded)
  }

  handleKeydown(event, index) {
    const keyMap = {
      ArrowDown: () => this.focusNextTrigger(index),
      ArrowUp: () => this.focusPreviousTrigger(index),
      Home: () => this.triggers[0].focus(),
      End: () => this.triggers[this.triggers.length - 1].focus(),
      Enter: () => this.handleClick(index),
      ' ': () => this.handleClick(index)
    }

    const handler = keyMap[event.key]
    if (handler) {
      event.preventDefault()
      handler()
    }
  }

  setExpandedState(index, expanded) {
    const trigger = this.triggers[index]
    const item = this.items[index]
    const content = item.querySelector('[data-accordion-content]')
    const body = content?.querySelector('.ast-accordion__body')

    trigger.setAttribute('aria-expanded', expanded.toString())
    item.setAttribute('data-expanded', expanded.toString())

    if (body) {
      if (expanded) {
        body.removeAttribute('inert')
      } else {
        body.setAttribute('inert', '')
      }
    }

    this.accordion.dispatchEvent(new CustomEvent(`accordion:${expanded ? 'expand' : 'collapse'}`, {
      detail: { index },
      bubbles: true
    }))
  }

  collapseAll(excludeIndex = -1) {
    this.triggers.forEach((_, index) => {
      if (index !== excludeIndex) {
        this.setExpandedState(index, false)
      }
    })
  }

  expandAll() {
    if (this.allowMultiple) {
      this.triggers.forEach((_, index) => {
        this.setExpandedState(index, true)
      })
    }
  }

  focusNextTrigger(currentIndex) {
    const next = (currentIndex + 1) % this.triggers.length
    this.triggers[next].focus()
  }

  focusPreviousTrigger(currentIndex) {
    const prev = (currentIndex - 1 + this.triggers.length) % this.triggers.length
    this.triggers[prev].focus()
  }

  handleResponsiveState() {
    if (!this.isCheckboxAccordion) return

    if (this.mediaQuery.matches) {
      // Desktop: expand all accordions
      this.triggers.forEach((_, index) => {
        this.setExpandedState(index, true)
      })
    } else {
      // Mobile: collapse all accordions so users can interact with them
      this.triggers.forEach((_, index) => {
        this.setExpandedState(index, false)
      })
    }
  }
}

initComponent('accordion', (element) => {
  new AccordionComponent(element)
})

export { AccordionComponent }