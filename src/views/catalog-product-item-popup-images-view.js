export const createImageSliderPopup = ({images, authorPhoto}) => images.map((image) => {
    return `<div class="image-slides-list__item swiper-slide">
              <div class="image-slide">
                <picture>
                  <source type="image/webp" srcset="${image}">
                    <img src="${image}" width="1274" height="1789" alt="">
                </picture>
                <span class="image-author image-slide__author">${authorPhoto}</span>
              </div>
             </div>
          `
});
