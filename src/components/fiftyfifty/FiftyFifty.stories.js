import "./FiftyFifty.scss?inline";

// Static HTML from your Astro build - update this when the component changes
const ACCORDION_HTML = `
<div class="ast-container ast-container--main">
    
      <div class="ast-fifty-fifty ast-fifty-fifty--left">
  <div class="ast-fifty-fifty__container">
    
    <div class="ast-fifty-fifty__image-section">
      <div class="ast-fifty-fifty__image-wrapper">
            <img src="/html_templates/my-project/assets/img/image1.jpg" alt="Beautiful landscape" class="ast-fifty-fifty__image">
          </div>
    </div>

    
    <div class="ast-fifty-fifty__content-section">
      <div class="ast-fifty-fifty__content">
        <div class="ast-fifty-fifty__eyebrow">Featured</div>

        <h2 class="ast-fifty-fifty__header">Beautiful Mountain Vista</h2>

        <div class="ast-fifty-fifty__description">
              <p>Experience the breathtaking beauty of nature with stunning mountain views that stretch as far as the eye can see.</p>
            </div>

        <div class="ast-fifty-fifty__button-wrapper">
              <a href="#" class="ast-button ast-fifty-fifty__button ast-fifty-fifty__button--primary">
                Explore More
              </a>
            </div>       
      </div>
    </div>
  </div>
</div>
`;

export default {
  title: "Components/FiftyFifty",
};
