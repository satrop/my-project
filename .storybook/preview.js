import "../src/styles/main.scss";
import "../public/assets/fonts/icons/font-icons.css";
import { withCopyHTML } from "./decorators/withCopyHTML";

/** @type { import('storybook').Preview } */
const preview = {
  decorators: [withCopyHTML],
  parameters: {
    actions: { disable: true },
    interactions: { disable: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#ffffff",
        },
        {
          name: "dark",
          value: "#1a1a1a",
        },
      ],
    },
  },
};

export default preview;
