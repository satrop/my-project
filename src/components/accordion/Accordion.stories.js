/**
 * Example Story for Accordion Component
 *
 * Since Astro components can't be directly used in Storybook,
 * we'll render the HTML output and initialize the JS behavior.
 */

import "./Accordion.scss";
import "../../../public/assets/fonts/icons/font-icons.css";
import { AccordionComponent } from "./Accordion.js";

export default {
  title: "Components/Accordion",
  tags: ["autodocs"],
  argTypes: {
    allowMultiple: {
      control: "boolean",
      description: "Allow multiple accordion items to be open at once",
    },
    onExpand: {
      action: "expanded",
      table: { disable: true },
    },
    onCollapse: {
      action: "collapsed",
      table: { disable: true },
    },
  },
};

const Template = ({ allowMultiple, onExpand, onCollapse }) => {
  const items = [
    {
      id: "item-1",
      title: "First Accordion Item",
      content: "This is the content of the first accordion item. It can contain any HTML or text content.",
    },
    {
      id: "item-2",
      title: "Second Accordion Item",
      content: "This is the content of the second accordion item. Each item can be expanded independently.",
    },
    {
      id: "item-3",
      title: "Third Accordion Item",
      content: "This is the content of the third accordion item. Click the headers to toggle visibility.",
    },
  ];

  const container = document.createElement("div");

  container.innerHTML = `
    <article class="ast-accordion" data-allow-multiple="${allowMultiple}" data-js="accordion">
      ${items
        .map(
          (item) => `
        <div class="ast-accordion__item" data-accordion-item data-expanded="false">
          <div class="ast-h3">
            <button
              class="ast-accordion__trigger"
              type="button"
              aria-expanded="false"
              aria-controls="ast-accordion-content-${item.id}"
              id="ast-accordion-trigger-${item.id}"
              data-accordion-trigger>
              <div class="ast-accordion__icon-wrapper">
                <i class="icon icon-minus" aria-hidden="true"></i>
                <i class="icon icon-plus" aria-hidden="true"></i>
              </div>
              <span>${item.title}</span>
            </button>
          </div>
          <div 
            class="ast-accordion__content" 
            id="ast-accordion-content-${item.id}"
            role="region"
            aria-labelledby="ast-accordion-trigger-${item.id}"
            data-accordion-content>
            <div class="ast-accordion__content-inner">
              ${item.content}
            </div>
          </div>
        </div>
      `
        )
        .join("")}
    </article>
  `;

  // Initialize the accordion component after DOM is ready
  setTimeout(() => {
    const accordion = container.querySelector('[data-js="accordion"]');
    if (accordion && !accordion.accordionComponent) {
      new AccordionComponent(accordion);

      // Add event listeners to track accordion interactions
      const triggers = accordion.querySelectorAll("[data-accordion-trigger]");
      triggers.forEach((trigger) => {
        trigger.addEventListener("click", () => {
          // Use setTimeout to check state after the accordion component updates it
          setTimeout(() => {
            const isExpanded = trigger.getAttribute("aria-expanded") === "true";
            const itemTitle = trigger.querySelector("span").textContent;

            if (isExpanded) {
              onExpand?.({ item: itemTitle });
            } else {
              onCollapse?.({ item: itemTitle });
            }
          }, 10);
        });
      });
    }
  }, 0);

  return container;
};

export const Default = Template.bind({});
Default.args = {
  allowMultiple: false,
};

export const AllowMultiple = Template.bind({});
AllowMultiple.args = {
  allowMultiple: true,
};
