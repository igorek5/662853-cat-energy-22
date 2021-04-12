const sliderRange = document.querySelector(".slider__toggle");
const beforeCat = document.querySelector(".slider__image--before");
const afterCat = document.querySelector(".slider__image--after");
const beforeButton = document.querySelector(".slider__button--before");
const afterButton = document.querySelector(".slider__button--after");

const rangeValue = function (e) {
  const value = e.target.value;
  afterCat.style.width = value + "%";
  let widthCat = 100 - value
  beforeCat.style.width = widthCat + "%";
}

sliderRange.addEventListener("input", rangeValue)

if (beforeButton) {
  beforeButton.addEventListener("click", function (evt) {
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
