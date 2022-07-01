window.onload = function () {

   const spollersArray = document.querySelectorAll('[data-spollers]');
   if (spollersArray.length > 0) {

      //Получение обычных спойлеров
      const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
         return !item.dataset.spollers.split(",")[0];
      });

      //Инициализация обычный спойлеров
      if (spollersRegular.length > 0) {
         initSpollers(spollersRegular);
      }

      //Получение спойлеров с медиа запросами
      const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
         return item.dataset.spollers.split(",")[0];
      });

      //Инициализация спойлеров с медиа запросами
      if (spollersMedia.length > 0) {
         const breakpointsArray = [];
         spollersMedia.forEach(item => {
            const params = item.dataset.spollers;
            const breakpoint = {};
            const paramsArray = params.split(",");
            breakpoint.value = paramsArray[0];
            breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
            breakpoint.item = item;
            breakpointsArray.push(breakpoint);
         });

         //Получаем уникальные брейкпоинты
         let mediaQueries = breakpointsArray.map(function (item) {
            return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
         });
         mediaQueries = mediaQueries.filter(function (item, index, self) {
            return self.indexOf(item) === index;
         });

         //Работаем с каждым брейкпоинтом
         mediaQueries.forEach(breakpoint => {
            const paramsArray = breakpoint.split(",");
            const mediaBreakpoint = paramsArray[1];
            const mediaType = paramsArray[2];
            const matchMedia = window.matchMedia(paramsArray[0]);

            //Объекты с нужными условиями
            const spollersArray = breakpointsArray.filter(function (item) {
               if (item.value === mediaBreakpoint && item.type === mediaType) {
                  return true;
               }
            });

            //Событие
            matchMedia.addListener(function () {
               initSpollers(spollersArray, matchMedia);
            });
            initSpollers(spollersArray, matchMedia);
         });
      }
      //Инициализация
      function initSpollers(spollersArray, matchMedia = false) {
         spollersArray.forEach(spollersBlock => {
            spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
            if (matchMedia.matches || !matchMedia) {
               spollersBlock.classList.add('_init');
               initSpollerBody(spollersBlock);
               spollersBlock.addEventListener("click", setSpollerAction);
            } else {
               spollersBlock.classList.remove('_init');
               initSpollerBody(spollersBlock, false);
               spollersBlock.removeEventListener("click", setSpollerAction);
            }
         });
      }

      //Работа с контентом 
      function initSpollerBody(spollersBlock, hideSpollerBody = true) {
         const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
         if (spollerTitles.length > 0) {
            spollerTitles.forEach(spollerTitle => {
               if (hideSpollerBody) {
                  spollerTitle.removeAttribute('tabindex');
                  if (!spollerTitle.classList.contains('_active')) {
                     spollerTitle.nextElementSibling.hidden = true;
                  }
               } else {
                  spollerTitle.setAttribute('tabindex', '-1');
                  spollerTitle.nextElementSibling.hidden = false;
               }
            });
         }
      }

      function setSpollerAction(e) {
         const el = e.target;
         if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
            const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
            const spollersBlock = spollerTitle.closest('[data-spollers]');
            const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
            if (!spollersBlock.querySelectorAll('._slide').length) {
               if (oneSpoller && !spollerTitle.classList.contains('_active')) {
                  hideSpollersBody(spollersBlock);
               }
               spollerTitle.classList.toggle('_active');
               _slideToggle(spollerTitle.nextElementSibling, 500);
            }
            e.preventDefault();
         }
      }

      function hideSpollersBody(spollersBlock) {
         const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
         if (spollerActiveTitle) {
            spollerActiveTitle.classList.remove('_active');
            _slideUp(spollerActiveTitle.nextElementSibling, 500);
         }
      }
   }

   //SlideToggle
   let _slideUp = (target, duration = 500) => {
      if (!target.classList.contains('_slide')) {
         target.classList.add('_slide');
         target.style.transitionProperty = 'height, margin, padding';
         target.style.transitionDuration = duration + 'ms';
         target.style.height = target.offsetHeight + 'px';
         target.offsetHeight;
         target.style.overflow = 'hidden';
         target.style.height = 0;
         target.style.paddingTop = 0;
         target.style.paddingBottom = 0;
         target.style.marginTop = 0;
         target.style.marginBottom = 0;
         window.setTimeout(() => {
            target.hidden = true;
            target.style.removeProperty('height');
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');
         }, duration);
      }
   }
   let _slideDown = (target, duration = 500) => {
      if (!target.classList.contains('_slide')) {
         target.classList.add('_slide');
         if (target.hidden) {
            target.hidden = false;
         }
         let height = target.offsetHeight;
         target.style.overflow = 'hidden';
         target.style.height = 0;
         target.style.paddingTop = 0;
         target.style.paddingBottom = 0;
         target.style.marginTop = 0;
         target.style.marginBottom = 0;
         target.offsetHeight;
         target.style.transitionProperty = "height, margin, padding";
         target.style.transitionDuration = duration + 'ms';
         target.style.height = height + 'px';
         target.style.removeProperty('padding-top');
         target.style.removeProperty('padding-bottom');
         target.style.removeProperty('margin-top');
         target.style.removeProperty('margin-bottom');
         window.setTimeout(() => {
            target.style.removeProperty('height');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');
         }, duration);
      }
   }
   let _slideToggle = (target, duration = 500) => {
      if (target.hidden) {
         return _slideDown(target, duration);
      } else {
         return _slideUp(target, duration);
      }
   }

   document.addEventListener("click", documentActions);

   var isMobile = {
      Android: function () {
         return navigator.userAgent.match(/Android/i);
      },
      BlackBerry: function () {
         return navigator.userAgent.match(/BlackBerry/i);
      },
      iOS: function () {
         return navigator.userAgent.match(/iPhone|iPad|iPod/i);
      },
      Opera: function () {
         return navigator.userAgent.match(/Opera Mini/i);
      },
      Windows: function () {
         return navigator.userAgent.match(/IEMobile/i);
      },
      any: function () {
         return (
            isMobile.Android()
            || isMobile.BlackBerry()
            || isMobile.iOS()
            || isMobile.Opera()
            || isMobile.Windows()
         );
      }
   };

   // Actions (делегирование события click)
   function documentActions(e) {
      const targetElement = e.target;
      if (window.innerWidth > 992 && isMobile.any()) {

         if (targetElement.classList.contains('menu__arrow')) {
            targetElement.closest('.menu__item').classList.toggle('_hover');
         }
         if (!targetElement.closest('.menu__item') && document.querySelectorAll('.menu__item._hover')) {
            document.querySelector('.menu__item._hover').classList.remove('_hover');
         }
      }

      if (targetElement.classList.contains('header__search-form-icon')) {
         document.querySelector('.header__search-form').classList.toggle('_active');
      }
      else if (!targetElement.closest('.header__search-form') && document.querySelector('.header__search-form._active')) {
         document.querySelector('.header__search-form').classList.remove('_active');
      }

      //*====================================================

      //*Для добавления товаров в корзину
      if (targetElement.classList.contains('actions-product__button')) {
         const productId = targetElement.closest('.item-product').dataset.pid;
         addToCart(targetElement, productId);
         e.preventDefault();
      }

      //!Удаление товаров из корзины======================
      if (targetElement.classList.contains('cart-list__delete')) {
         const productId = targetElement.closest('.cart-list__item').dataset.cartPid;
         updateCart(targetElement, productId, false);
         e.preventDefault();
      }

      //?Показ корзины при нажатии на иконку===============
      if (targetElement.classList.contains('cart-header__icon') || targetElement.closest('.cart-header__icon')) {
         if (document.querySelector('.cart-list').children.length > 0) {
            document.querySelector('.cart-header').classList.toggle('_active');
         }
         e.preventDefault();
      } else if (!targetElement.closest('.cart-header') && !targetElement.classList.contains('actions-product__button')) {
         document.querySelector('.cart-header').classList.remove('_active');
      }

      //Для Load More Products
      if (targetElement.classList.contains('products__more')) {
         getProducts(targetElement);
         e.preventDefault();
      }

   }

   //Load More Products
   async function getProducts(button) {
      if (!button.classList.contains('_hold')) {
         button.classList.add('_hold');
         const file = "json/products.json";
         let response = await fetch(file, {
            method: "GET"
         });
         if (response.ok) {
            let result = await response.json();
            loadProducts(result);
            button.classList.remove('_hold');
            button.remove();
         } else {
            alert("Ошибка");
         }
      }
   }

   function loadProducts(data) {
      const productsItems = document.querySelector('.products__items');

      data.products.forEach(item => {
         const productId = item.id;
         const productUrl = item.url;
         const productImage = item.image;
         const productTitle = item.title;
         const productText = item.text;
         const productPrice = item.price;
         const productOldPrice = item.priceOld;
         const productShareUrl = item.shareUrl;
         const productLikeUrl = item.likeUrl;
         const productLabels = item.labels;

         let productTemplateStart = `<article data-pid="${productId}" class="products__item item-product">`;
         let productTemplateEnd = `</article>`;

         let productTemplateLabels = '';
         if (productLabels) {
            let productTemplateLabelsStart = `<div class="item-product__labels">`;
            let productTemplateLabelsEnd = `</div>`;
            let productTemplateLabelsContent = '';

            productLabels.forEach(labelItem => {
               productTemplateLabelsContent += `<div class="item-product__label item-product__label_${labelItem.type}">${labelItem.value}</div>`;
            });

            productTemplateLabels += productTemplateLabelsStart;
            productTemplateLabels += productTemplateLabelsContent;
            productTemplateLabels += productTemplateLabelsEnd;
         }

         let productTemplateImage = `
		<a href="${productUrl}" class="item-product__image _ibg">
			<img src="img/products/${productImage}" alt="${productTitle}">
		</a>
	`;

         let productTemplateBodyStart = `<div class="item-product__body">`;
         let productTemplateBodyEnd = `</div>`;

         let productTemplateContent = `
		<div class="item-product__content">
			<h3 class="item-product__title">${productTitle}</h3>
			<div class="item-product__text">${productText}</div>
		</div>
	`;

         let productTemplatePrices = '';
         let productTemplatePricesStart = `<div class="item-product__prices">`;
         let productTemplatePricesCurrent = `<div class="item-product__price">Rp ${productPrice}</div>`;
         let productTemplatePricesOld = `<div class="item-product__price item-product__price_old">Rp ${productOldPrice}</div>`;
         let productTemplatePricesEnd = `</div>`;

         productTemplatePrices = productTemplatePricesStart;
         productTemplatePrices += productTemplatePricesCurrent;
         if (productOldPrice) {
            productTemplatePrices += productTemplatePricesOld;
         }
         productTemplatePrices += productTemplatePricesEnd;

         let productTemplateActions = `
		<div class="item-product__actions actions-product">
			<div class="actions-product__body">
				<a href="" class="actions-product__button btn btn_white">Add to cart</a>
				<a href="${productShareUrl}" class="actions-product__link _icon-share">Share</a>
				<a href="${productLikeUrl}" class="actions-product__link _icon-favorite">Like</a>
			</div>
		</div>
	`;

         let productTemplateBody = '';
         productTemplateBody += productTemplateBodyStart;
         productTemplateBody += productTemplateContent;
         productTemplateBody += productTemplatePrices;
         productTemplateBody += productTemplateActions;
         productTemplateBody += productTemplateBodyEnd;

         let productTemplate = '';
         productTemplate += productTemplateStart;
         productTemplate += productTemplateLabels;
         productTemplate += productTemplateImage;
         productTemplate += productTemplateBody;
         productTemplate += productTemplateEnd;

         productsItems.insertAdjacentHTML('beforeend', productTemplate);
      });

   }

   //=======================================================

   //*================================================

   //* Добавление товаров в корзину (addToCart)================

   function addToCart(productButton, productId) {
      if (!productButton.classList.contains('_hold')) {
         productButton.classList.add('_hold');
         productButton.classList.add('_fly');

         const cart = document.querySelector('.cart-header__icon');
         const product = document.querySelector(`[data-pid="${productId}"]`);
         const productImage = product.querySelector('.item-product__image');

         const productImageFly = productImage.cloneNode(true);

         const productImageFlyWidth = productImage.offsetWidth;
         const productImageFlyHeight = productImage.offsetHeight;
         const productImageFlyTop = productImage.getBoundingClientRect().top;
         const productImageFlyLeft = productImage.getBoundingClientRect().left;

         productImageFly.setAttribute('class', '_flyImage _ibg');
         productImageFly.style.cssText =
            `
         left: ${productImageFlyLeft}px;
         top: ${productImageFlyTop}px;
         width: ${productImageFlyWidth}px;
         height: ${productImageFlyHeight}px;
      `;

         document.body.append(productImageFly);

         const cartFlyLeft = cart.getBoundingClientRect().left;
         const cartFlyTop = cart.getBoundingClientRect().top;

         productImageFly.style.cssText =
            `
         left: ${cartFlyLeft}px;
         top: ${cartFlyTop}px;
         width: 0px;
         height: 0px;
         opacity: 0;
         `;

         productImageFly.addEventListener('transitionend', function () {
            if (productButton.classList.contains('_fly')) {
               productImageFly.remove();
               updateCart(productButton, productId);
               productButton.classList.remove('_fly');
            }
         });
      }
   }

   function updateCart(productButton, productId, productAdd = true) {
      const cart = document.querySelector('.cart-header');
      const cartIcon = cart.querySelector('.cart-header__icon');
      const cartQuantity = cartIcon.querySelector('span');
      const cartProduct = document.querySelector(`[data-cart-pid="${productId}"]`);
      const cartList = document.querySelector('.cart-list');

      //*Добавляем
      if (productAdd) {
         if (cartQuantity) {
            cartQuantity.innerHTML = ++cartQuantity.innerHTML;
         } else {
            cartIcon.insertAdjacentHTML('beforeend', `<span>1</span>`);
         }
         if (!cartProduct) {
            const product = document.querySelector(`[data-pid="${productId}"]`);
            const cartProductImage = product.querySelector('.item-product__image').innerHTML;
            const cartProductTitle = product.querySelector('.item-product__title').innerHTML;
            const cartProductContent = `
            <a href="#" class="cart-list__image _ibg">${cartProductImage}</a>
            <div class="cart-list__body">
               <a href="#" class="cart-list__title">${cartProductTitle}</a>
               <div class="cart-list__quantity">Quantity: <span>1</span></div>
               <a href="#" class="cart-list__delete">Delete</a>
            </div>`;
            cartList.insertAdjacentHTML('beforeend', `<li data-cart-pid="${productId}" class="cart-list__item">${cartProductContent}</li>`);
         } else {
            const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
            cartProductQuantity.innerHTML = ++cartProductQuantity.innerHTML;
         }

         //*После этих действий отбираем класс _hold у кнопки добавлеия в корзину
         productButton.classList.remove('_hold');

         //!Для удаления товаров из корзины
      } else {
         const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
         cartProductQuantity.innerHTML = --cartProductQuantity.innerHTML;
         if (!parseInt(cartProductQuantity.innerHTML)) {
            cartProduct.remove();
         }

         const cartQuantityValue = --cartQuantity.innerHTML;

         if (cartQuantityValue) {
            cartQuantity.innerHTML = cartQuantityValue;
         } else {
            cartQuantity.remove();
            cart.classList.remove('_active');
         }
      }

   }


   //*=======================================================

   $('.icon-menu').click(function (event) {
      $('.icon-menu, .menu__body').toggleClass('_active');
      $('body').toggleClass('lock');
   })

   if (document.querySelector('.slider-main__body')) {
      new Swiper('.slider-main__body', {
         observer: true,
         observeParents: true,
         slidesPerView: 1,
         spaceBetween: 32,
         watchOverflow: true,
         speed: 800,
         loop: true,
         loopAdditionalSlides: 5,
         preloadImages: false,
         parallax: true,
         pagination: {
            el: '.controls-slider-main__dotts',
            clickable: true,
         },
         navigation: {
            nextEl: '.slider-main .slider-arrow_next',
            prevEl: '.slider-main .slider-arrow_prev',
         },
      });
   }

   if (document.querySelector('.slider-rooms__body')) {
      new Swiper('.slider-rooms__body', {
         observer: true,
         observeParents: true,
         slidesPerView: 'auto',
         spaceBetween: 24,
         watchOverflow: true,
         speed: 800,
         loop: true,
         loopAdditionalSlides: 5,
         preloadImages: false,
         parallax: true,
         pagination: {
            el: '.slider-rooms__dotts',
            clickable: true,
         },
         navigation: {
            nextEl: '.slider-rooms .slider-arrow_next',
            prevEl: '.slider-rooms .slider-arrow_prev',
         },
      });
   }

   if (document.querySelector('.slider-tips__body')) {
      new Swiper('.slider-tips__body', {
         observer: true,
         observeParents: true,
         slidesPerView: 3,
         spaceBetween: 32,
         watchOverflow: true,
         speed: 800,
         loop: true,
         pagination: {
            el: '.slider-tips__dotts',
            clickable: true,
         },
         navigation: {
            nextEl: '.slider-tips .slider-arrow_next',
            prevEl: '.slider-tips .slider-arrow_prev',
         },
         breakpoints: {
            320: {
               slidesPerView: 1.1,
               spaceBetween: 15
            },
            768: {
               slidesPerView: 2,
               spaceBetween: 20
            },
            992: {
               slidesPerView: 3,
               spaceBetween: 32
            },
         }
      });
   }

   //Прокрутка галереи при ведении мышью
   const furniture = document.querySelector('.furniture__body');
   if (furniture && !isMobile.any()) {
      const furnitureItems = document.querySelector('.furniture__items');
      const furnitureColumn = document.querySelectorAll('.furniture__column');

      //Скорость анимации
      const speed = furniture.dataset.speed;

      let positionX = 0;
      let coordXprocent = 0;

      function setMouseGalleryStyle() {
         let furnitureItemsWidth = 0;
         furnitureColumn.forEach(element => {
            furnitureItemsWidth += element.offsetWidth;
         });

         const furnitureDifferent = furnitureItemsWidth - furniture.offsetWidth;
         const distX = Math.floor(coordXprocent - positionX);

         positionX = positionX + (distX * speed);
         let position = furnitureDifferent / 200 * positionX;

         furnitureItems.style.cssText = `transform: translate3d(${-position}px,0,0);`;

         if (Math.abs(distX) > 0) {
            requestAnimationFrame(setMouseGalleryStyle);
         } else {
            furniture.classList.remove('_init');
         }
      }
      furniture.addEventListener("mousemove", function (e) {
         //Получение ширины
         const furnitureWidth = furniture.offsetWidth;

         //Ноль по середине
         const coordX = e.pageX - furnitureWidth / 2;

         //Получаем проценты
         coordXprocent = coordX / furnitureWidth * 200;

         if (!furniture.classList.contains('_init')) {
            requestAnimationFrame(setMouseGalleryStyle);
            furniture.classList.add('_init');
         }
      });
   }
}