//Header
const headerElement = document.querySelector('.header');

const callback = function (entries, observer) {
   if (entries[0].isIntersecting) {
      headerElement.classList.remove('_scroll');
   } else {
      headerElement.classList.add('_scroll');
   }
};

const headerObserver = new IntersectionObserver(callback);
headerObserver.observe(headerElement);