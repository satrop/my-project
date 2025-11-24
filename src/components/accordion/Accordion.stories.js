/**
 * Example Story for Accordion Component
 *
 * To update this story with new HTML:
 * 1. Run: npm run build
 * 2. Open dist/components/accordion.html (or any page with the accordion)
 * 3. Copy the .ast-accordion HTML from the built page
 * 4. Replace ACCORDION_HTML below
 */

import "./Accordion.scss?inline";
import { AccordionComponent } from "./Accordion.js";

// Static HTML from your Astro build - update this when the component changes
const ACCORDION_HTML = `
<article class="ast-accordion" data-allow-multiple="false" data-js="accordion">
  <div class="ast-accordion__item" data-accordion-item data-expanded="false">
    <div class="ast-h3">
      <button
        class="ast-accordion__trigger"
        type="button"
        aria-expanded="false"
        aria-controls="ast-accordion-content-item-1"
        id="ast-accordion-trigger-item-1"
        data-accordion-trigger>
        <div class="ast-accordion__icon-wrapper">
          <i class="icon icon-minus" aria-hidden="true"></i>
          <i class="icon icon-plus" aria-hidden="true"></i>
        </div>
        <div class="ast-accordion__title">First Accordion Item</div>
      </button>
    </div>
    <div 
      class="ast-accordion__content ast-accordion__left"
      id="ast-accordion-content-item-1"
      role="region"
      aria-labelledby="ast-accordion-trigger-item-1"
      data-accordion-content>
      <div class="ast-accordion__body" inert>
        <p>This is the content of the first accordion item. It can contain any HTML or text content.</p>
      </div>
    </div>
  </div>
  <div class="ast-accordion__item" data-accordion-item data-expanded="false">
    <div class="ast-h3">
      <button
        class="ast-accordion__trigger"
        type="button"
        aria-expanded="false"
        aria-controls="ast-accordion-content-item-2"
        id="ast-accordion-trigger-item-2"
        data-accordion-trigger>
        <div class="ast-accordion__icon-wrapper">
          <i class="icon icon-minus" aria-hidden="true"></i>
          <i class="icon icon-plus" aria-hidden="true"></i>
        </div>
        <div class="ast-accordion__title">Second Accordion Item</div>
      </button>
    </div>
    <div 
      class="ast-accordion__content ast-accordion__left"
      id="ast-accordion-content-item-2"
      role="region"
      aria-labelledby="ast-accordion-trigger-item-2"
      data-accordion-content>
      <div class="ast-accordion__body" inert>
        <p>This is the content of the second accordion item. Each item can be expanded independently.</p>
      </div>
    </div>
  </div>
  <div class="ast-accordion__item" data-accordion-item data-expanded="false">
    <div class="ast-h3">
      <button
        class="ast-accordion__trigger"
        type="button"
        aria-expanded="false"
        aria-controls="ast-accordion-content-item-3"
        id="ast-accordion-trigger-item-3"
        data-accordion-trigger>
        <div class="ast-accordion__icon-wrapper">
          <i class="icon icon-minus" aria-hidden="true"></i>
          <i class="icon icon-plus" aria-hidden="true"></i>
        </div>
        <div class="ast-accordion__title">Third Accordion Item</div>
      </button>
    </div>
    <div 
      class="ast-accordion__content ast-accordion__left"
      id="ast-accordion-content-item-3"
      role="region"
      aria-labelledby="ast-accordion-trigger-item-3"
      data-accordion-content>
      <div class="ast-accordion__body" inert>
        <p>This is the content of the third accordion item. Click the headers to toggle visibility.</p>
      </div>
    </div>
  </div>
</article>
`;

export default {
  title: "Components/Accordion",
  argTypes: {
    allowMultiple: {
      control: "boolean",
      description: "Allow multiple accordion items to be open at once",
    },
  },
};

const Template = ({ allowMultiple }) => {
  const container = document.createElement("div");
  container.innerHTML = ACCORDION_HTML;

  // Update the allowMultiple attribute
  const accordion = container.querySelector(".ast-accordion");
  accordion.dataset.allowMultiple = allowMultiple.toString();

  // Initialize the accordion component after DOM is ready
  setTimeout(() => {
    if (accordion && !accordion.accordionComponent) {
      new AccordionComponent(accordion);
    }
  }, 0);

  return accordion;
};

export const Default = Template.bind({});
Default.args = {
  allowMultiple: false,
};

export const AllowMultiple = Template.bind({});
AllowMultiple.args = {
  allowMultiple: true,
};
