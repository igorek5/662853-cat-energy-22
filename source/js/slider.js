const sliderRange = document.querySelector(".slider__toggle");
const beforeCat = document.querySelector(".slider__image--before");
const afterCat = document.querySelector(".slider__image--after");
const beforButton = document.querySelector(".slider__button--before");
const afterButton = document.querySelector(".slider__button--after");


const rangeValue = function (value) {
  afterCat.style.width=value + "%";
  let widthCat = 100 - value
  beforeCat.style.width=widthCat + "%";
}

if (beforButton) {
  beforButton.addEventListener("click", function (evt) {
    evt.preventDefault();
    sliderRange.value = 0;
    afterCat.style.width="0%";
    beforeCat.style.width="100%";
  });
}

if (afterButton) {
  afterButton.addEventListener("click", function (evt) {
    evt.preventDefault();
    sliderRange.value = 100;
    afterCat.style.width="100%";
    beforeCat.style.width="0%";
  });
}
