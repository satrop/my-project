function initComponent(name, callback) {
  if (typeof window === "undefined") return;
  try {
    const elements = document.querySelectorAll(`[data-js="${name}"]:not([data-init])`);
    elements.forEach((el) => {
      if (!el || typeof el.setAttribute !== "function") {
        console.error(`initComponent: Invalid element found for "${name}"`, el);
        return;
      }
      el.setAttribute("data-init", "true");
      if (typeof callback === "function" && callback.prototype && callback.prototype.constructor === callback) {
        new callback(el);
      } else {
        callback(el);
      }
    });
  } catch (error) {
    console.error(`initComponent failed for "${name}":`, error);
  }
}
class AccordionComponent {
  constructor(accordion) {
    this.accordion = accordion;
    this.allowMultiple = accordion.dataset.allowMultiple === "true";
    this.items = this.getDirectChildren(accordion, "[data-accordion-item]");
    this.triggers = this.items.map((item) => item.querySelector("[data-accordion-trigger]")).filter(Boolean);
    this.isCheckboxAccordion = accordion.classList.contains("ast-checkbox-accordion");
    this.mediaQuery = window.matchMedia("(min-width: 1024px)");
    if (this.triggers.length === 0 || this.items.length === 0) return;
    this.accordion.accordionComponent = this;
    this.init();
  }
  /**
   * Get only direct children matching a selector, excluding nested accordion items
   */
  getDirectChildren(parent, selector) {
    const allMatches = Array.from(parent.querySelectorAll(selector));
    return allMatches.filter((element) => {
      const closestAccordion = element.parentElement.closest('[data-js="accordion"]');
      return closestAccordion === parent;
    });
  }
  init() {
    this.triggers.forEach((trigger, index) => {
      trigger.addEventListener("click", (e) => this.handleClick(index, e));
      trigger.addEventListener("keydown", (e) => this.handleKeydown(e, index));
    });
    if (this.isCheckboxAccordion) {
      this.handleResponsiveState();
      this.mediaQuery.addEventListener("change", () => this.handleResponsiveState());
    }
  }
  handleClick(index, event) {
    const trigger = this.triggers[index];
    const item = this.items[index];
    if (!trigger || !item) return;
    const clickedAccordion = event.target.closest('[data-js="accordion"]');
    if (clickedAccordion && clickedAccordion !== this.accordion) {
      return;
    }
    if (this.isCheckboxAccordion && this.mediaQuery.matches) {
      return;
    }
    const isExpanded = item.getAttribute("data-expanded") === "true";
    if (!this.allowMultiple) {
      this.collapseAll(index);
    }
    this.setExpandedState(index, !isExpanded);
  }
  handleKeydown(event, index) {
    const keyMap = {
      ArrowDown: () => this.focusNextTrigger(index),
      ArrowUp: () => this.focusPreviousTrigger(index),
      Home: () => this.triggers[0].focus(),
      End: () => this.triggers[this.triggers.length - 1].focus(),
      Enter: () => this.handleClick(index),
      " ": () => this.handleClick(index)
    };
    const handler = keyMap[event.key];
    if (handler) {
      event.preventDefault();
      handler();
    }
  }
  setExpandedState(index, expanded) {
    const trigger = this.triggers[index];
    const item = this.items[index];
    const content = item.querySelector("[data-accordion-content]");
    const body = content == null ? void 0 : content.querySelector(".ast-accordion__body");
    trigger.setAttribute("aria-expanded", expanded.toString());
    item.setAttribute("data-expanded", expanded.toString());
    if (body) {
      if (expanded) {
        body.removeAttribute("inert");
      } else {
        body.setAttribute("inert", "");
      }
    }
    this.accordion.dispatchEvent(new CustomEvent(`accordion:${expanded ? "expand" : "collapse"}`, {
      detail: { index },
      bubbles: true
    }));
  }
  collapseAll(excludeIndex = -1) {
    this.triggers.forEach((_, index) => {
      if (index !== excludeIndex) {
        this.setExpandedState(index, false);
      }
    });
  }
  expandAll() {
    if (this.allowMultiple) {
      this.triggers.forEach((_, index) => {
        this.setExpandedState(index, true);
      });
    }
  }
  focusNextTrigger(currentIndex) {
    const next = (currentIndex + 1) % this.triggers.length;
    this.triggers[next].focus();
  }
  focusPreviousTrigger(currentIndex) {
    const prev = (currentIndex - 1 + this.triggers.length) % this.triggers.length;
    this.triggers[prev].focus();
  }
  handleResponsiveState() {
    if (!this.isCheckboxAccordion) return;
    if (this.mediaQuery.matches) {
      this.triggers.forEach((_, index) => {
        this.setExpandedState(index, true);
      });
    } else {
      this.triggers.forEach((_, index) => {
        this.setExpandedState(index, false);
      });
    }
  }
}
initComponent("accordion", (element) => {
  new AccordionComponent(element);
});
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      img.classList.add("ast-img--error");
    });
  });
});
function initAnimationObserver() {
  if (!window.IntersectionObserver) return;
  const isBackstopTesting = new URLSearchParams(window.location.search).get("backstop") === "true";
  const elements = document.querySelectorAll("[data-animate]");
  if (!elements.length) return;
  if (isBackstopTesting) {
    elements.forEach((element) => {
      const { animate, animateDelay, animateDuration } = element.dataset;
      element.classList.add("ast-animate__animated", `ast-animate__${animate}`, "in-viewport");
      const normalizedDelay = animateDelay ? animateDelay.replace(".", "_") : "";
      if (animateDelay) element.classList.add(`ast-animate__delay-${normalizedDelay}`);
      if (animateDuration) element.classList.add(`ast-animate__${animateDuration}`);
    });
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (isIntersecting) {
        const { animate, animateDelay, animateDuration } = target.dataset;
        target.classList.add("ast-animate__animated", `ast-animate__${animate}`, "in-viewport");
        const normalizedDelay = animateDelay ? animateDelay.replace(".", "_") : "";
        if (animateDelay) target.classList.add(`ast-animate__delay-${normalizedDelay}`);
        if (animateDuration) target.classList.add(`ast-animate__${animateDuration}`);
        observer.unobserve(target);
      }
    });
  }, {
    rootMargin: "0px 0px -50px 0px",
    threshold: 0.1
  });
  elements.forEach((el) => {
    el.classList.add("ast-animate-on-scroll");
    observer.observe(el);
  });
}
function initAnimations() {
  initAnimationObserver();
}
function initParentLinks(container = document) {
  if (!container || typeof container.querySelectorAll !== "function") {
    console.error("initParentLinks: Invalid container element", container);
    return;
  }
  const parentElements = container.querySelectorAll('[data-parent-link="true"]');
  parentElements.forEach((parent) => {
    if (parent.hasAttribute("data-parent-link-initialized")) {
      return;
    }
    let targetLink = parent.querySelector('[data-link-target="true"]');
    if (!targetLink && parent.nextElementSibling) {
      targetLink = parent.nextElementSibling.querySelector('[data-link-target="true"]');
      if (!targetLink && parent.nextElementSibling.hasAttribute("data-link-target")) {
        targetLink = parent.nextElementSibling;
      }
    }
    if (!targetLink && parent.previousElementSibling) {
      targetLink = parent.previousElementSibling.querySelector('[data-link-target="true"]');
      if (!targetLink && parent.previousElementSibling.hasAttribute("data-link-target")) {
        targetLink = parent.previousElementSibling;
      }
    }
    if (targetLink && targetLink.href) {
      parent.style.cursor = "pointer";
      parent.addEventListener("click", function(event) {
        if (event.target === targetLink || targetLink.contains(event.target)) {
          return;
        }
        if (event.ctrlKey || event.metaKey || event.button === 1) {
          window.open(targetLink.href, "_blank");
        } else {
          window.location.href = targetLink.href;
        }
      });
      parent.addEventListener("auxclick", function(event) {
        if (event.button === 1) {
          event.preventDefault();
          window.open(targetLink.href, "_blank");
        }
      });
      parent.addEventListener("keydown", function(event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          if (event.ctrlKey || event.metaKey) {
            window.open(targetLink.href, "_blank");
          } else {
            window.location.href = targetLink.href;
          }
        }
      });
      if (!parent.hasAttribute("tabindex")) {
        parent.setAttribute("tabindex", "0");
      }
      parent.setAttribute("role", "button");
      parent.setAttribute("aria-label", `Navigate to ${targetLink.textContent.trim() || targetLink.href}`);
      parent.addEventListener("mouseenter", function(event) {
        if (event.target === targetLink || targetLink.contains(event.target)) {
          return;
        }
        if (parent.hasAttribute("data-hover-active")) {
          return;
        }
        parent.setAttribute("data-hover-active", "true");
        targetLink.classList.add("hover-triggered");
      });
      parent.addEventListener("mouseleave", function(event) {
        if (event.relatedTarget === targetLink || event.relatedTarget && targetLink.contains(event.relatedTarget)) {
          return;
        }
        parent.removeAttribute("data-hover-active");
        targetLink.classList.remove("hover-triggered");
      });
      parent.setAttribute("data-parent-link-initialized", "true");
    }
  });
}
function reinitParentLinks() {
  initParentLinks();
}
if (typeof window !== "undefined") {
  window.initParentLinks = initParentLinks;
  window.reinitParentLinks = reinitParentLinks;
}
function initTruncate() {
  const elements = document.querySelectorAll("[data-truncate]");
  elements.forEach((el) => {
    const lines = parseInt(el.getAttribute("data-truncate"));
    if (lines > 0) {
      el.style.display = "-webkit-box";
      el.style.webkitLineClamp = lines.toString();
      el.style.webkitBoxOrient = "vertical";
      el.style.overflow = "hidden";
    }
  });
}
document.addEventListener("DOMContentLoaded", () => {
  initAnimations();
  initParentLinks();
  initTruncate();
});
