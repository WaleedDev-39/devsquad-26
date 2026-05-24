import { menuData, reviewsData, similarRestaurants } from './data.js';

let cart = [];

function init() {
  renderMenu();
  renderReviews();
  renderSimilarRestaurants();
  setupCartListeners();
  setupReviewSlider();
}

function renderMenu() {
  const burgersContainer = document.getElementById("burgers-container");
  const friesContainer = document.getElementById("fries-container");
  const drinksContainer = document.getElementById("drinks-container");

  if (burgersContainer) burgersContainer.innerHTML = '';
  if (friesContainer) friesContainer.innerHTML = '';
  if (drinksContainer) drinksContainer.innerHTML = '';

  menuData.forEach((item) => {
    const cardHTML = `
      <div class="flex items-center gap-3 p-4 bg-white rounded-[12px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] cursor-pointer hover:shadow-lg transition-all h-full transform hover:-translate-y-1">
        <div class="flex flex-col gap-3 w-[65%]">
          <h4 class="font-bold text-[16px] md:text-[20px] leading-tight text-[#03081F]">${item.name}</h4>
          <p class="text-[13px] md:text-[14px] text-gray-500 font-medium leading-snug line-clamp-3">${item.description}</p>
          <p class="font-extrabold text-[16px] md:text-[20px] ">GBP ${item.price.toFixed(2)}</p>
        </div>
        <div class="relative w-[35%] flex justify-end items-end h-[120px] md:h-[150px]">
          <img src="${item.image}" alt="${item.name}" class="object-contain w-full h-full p-2" />
          <button data-id="${item.id}" class="add-to-cart-btn absolute bottom-0 right-0 bg-white shadow-xl rounded-tl-[30px] rounded-br-[8px] pl-4 pt-4 pb-2 pr-2 cursor-pointer transition-transform hover:scale-110 active:scale-95 group border-t border-l border-gray-100">
            <img src="./images/Plus.png" alt="Add" width="36" class="pointer-events-none group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
      </div>
    `;

    if (item.category === 'Burgers' && burgersContainer) {
      burgersContainer.insertAdjacentHTML("beforeend", cardHTML);
    } else if (item.category === 'Fries' && friesContainer) {
      friesContainer.insertAdjacentHTML("beforeend", cardHTML);
    } else if (item.category === 'Cold Drinks' && drinksContainer) {
      drinksContainer.insertAdjacentHTML("beforeend", cardHTML);
    }
  });
}

function renderReviews() {
  const container = document.getElementById("reviews-container");
  if (!container) return;

  container.innerHTML = '';
  reviewsData.forEach(review => {
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    const reviewHTML = `
        <div class="bg-white p-6 md:p-8 min-w-[500px] border border-gray-100/50">
          <div class="flex justify-between items-center mb-6">
             <div class="flex items-center gap-4">
               <div class="w-12 h-12 md:w-14 md:h-14 overflow-hidden shadow-sm relative mr-2">
                 <img src="${review.avatar}" alt="${review.name}" class="w-full h-full object-cover">
               </div>
               <div class="border-l-[2px] border-[#FC8A06] pl-4">
                 <h5 class="font-bold text-[15px] md:text-[18px] text-[#03081F]">${review.name}</h5>
                 <p class="text-[#FC8A06] text-[13px] md:text-[14px] font-semibold">${review.location}</p>
               </div>
             </div>
             <div class="flex gap-4 items-center">
                <div class="text-right flex flex-col items-end">
                  <div class="text-[#FC8A06] tracking-widest text-[20px] leading-none mb-1">${stars}</div>
                  <div class="text-gray-900 text-[12px] md:text-[13px] flex items-center justify-end gap-2 font-medium">
                    <img src="./images/Time Span.png" class="w-5 h-5" alt="time" /> ${review.date}
                  </div>
                </div>
             </div>
          </div>
          <p class="text-[14px] md:text-[15px] text-[#03081F] font-medium pt-2 pr-6">"${review.text}"</p>
        </div>
      `;
    container.insertAdjacentHTML("beforeend", reviewHTML);
  });
}

function renderSimilarRestaurants() {
  const container = document.getElementById("similar-rest-container");
  if (!container) return;
  container.innerHTML = '';

  similarRestaurants.forEach((value, key) => {
    const bgColor = value.bg || "bg-[#FC8A06]";

    let imgPath = `./images/${value.image}.png`;
    if (value.image === 'mcdonalds') imgPath = './images/mac.png';
    else if (value.image === 'papajohns') imgPath = './images/papa-johns.png';
    else if (value.image === 'burgerking') imgPath = './images/burger-king.png';

    const el = `
        <div class="group rounded-[16px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transition-all hover:-translate-y-2 bg-white">
          <div class="w-full h-full flex items-center justify-center">
             <!-- Adding white bg layer on the box if needed, but keeping original design color -->
             <img src="${imgPath}" alt="${key}" class="w-full h-full object-cover" />
          </div>
          <div class="text-white w-full text-center py-4 px-2 font-bold text-[12px] md:text-[14px] bg-[#FC8A06] transition-colors line-clamp-1">
             ${key}
          </div>
        </div>
      `;
    container.insertAdjacentHTML("beforeend", el);
  });
}

function setupReviewSlider() {
  const reviewsContainer = document.getElementById("reviews-container");
  const prevBtn = document.getElementById("prev-review");
  const nextBtn = document.getElementById("next-review");

  if (reviewsContainer && prevBtn && nextBtn) {
    nextBtn.addEventListener("click", () => {
      const scrollAmount = window.innerWidth < 768 ? 320 : 400;
      reviewsContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
    prevBtn.addEventListener("click", () => {
      const scrollAmount = window.innerWidth < 768 ? -320 : -400;
      reviewsContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    reviewsContainer.addEventListener("scroll", () => {
      if (reviewsContainer.scrollLeft <= 0) {
        prevBtn.classList.replace('bg-[#FC8A06]', 'bg-white');
        prevBtn.classList.replace('text-white', 'text-black');
      } else {
        // If we scrolled right, highlight prev btn
        prevBtn.classList.replace('bg-white', 'bg-[#FC8A06]');
        prevBtn.classList.replace('text-black', 'text-white');
      }
    });
  }
}

function setupCartListeners() {
  const badge = document.getElementById("cart-badge");
  const modal = document.getElementById("cart-modal");
  const cartBtn = document.getElementById("cart-btn");
  const closeCartBtn = document.getElementById("close-cart");
  const closeCartBtnBottom = document.getElementById("close-cart-btn");
  const itemsContainer = document.getElementById("cart-items");
  const totalAmountEl = document.getElementById("cart-total");

  document.addEventListener('click', (e) => {
    // Handle opening modal via add button AND add to cart
    const btn = e.target.closest('.add-to-cart-btn');
    if (btn) {
      const itemId = parseInt(btn.dataset.id);
      const item = menuData.find(i => i.id === itemId);
      if (item) {
        const existing = cart.find(c => c.id === item.id);
        if (existing) {
          existing.quantity += 1;
        } else {
          cart.push({ ...item, quantity: 1 });
        }
        updateCartUI();

        // Animate badge
        badge.classList.add('scale-150');
        setTimeout(() => badge.classList.remove('scale-150'), 200);
      }
    }

    // increase/decrease cart logic
    const increaseBtn = e.target.closest('.cart-increase');
    if (increaseBtn) {
      const id = parseInt(increaseBtn.dataset.id);
      const cartItem = cart.find(c => c.id === id);
      if (cartItem) { cartItem.quantity += 1; updateCartUI(); }
    }

    const decreaseBtn = e.target.closest('.cart-decrease');
    if (decreaseBtn) {
      const id = parseInt(decreaseBtn.dataset.id);
      const cartItem = cart.find(c => c.id === id);
      if (cartItem) {
        cartItem.quantity -= 1;
        if (cartItem.quantity <= 0) {
          cart = cart.filter(c => c.id !== id);
        }
        updateCartUI();
      }
    }

    const removeBtn = e.target.closest('.cart-remove');
    if (removeBtn) {
      const id = parseInt(removeBtn.dataset.id);
      cart = cart.filter(c => c.id !== id);
      updateCartUI();
    }
  });

  if (cartBtn && modal) {
    cartBtn.addEventListener('click', () => {
      modal.classList.remove('hidden');
      // Small delay to allow display flex to apply before opacity transition
      setTimeout(() => modal.classList.remove('opacity-0'), 10);
    });

    const closeModal = () => {
      modal.classList.add('opacity-0');
      setTimeout(() => modal.classList.add('hidden'), 300);
    };

    if (closeCartBtn) closeCartBtn.addEventListener('click', closeModal);
    if (closeCartBtnBottom) closeCartBtnBottom.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) { // clicked backdrop
        closeModal();
      }
    });
  }

  function updateCartUI() {
    let count = 0;
    let total = 0;
    itemsContainer.innerHTML = '';

    if (cart.length === 0) {
      itemsContainer.innerHTML = `
          <div class="flex flex-col items-center justify-center py-16 text-gray-400">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
             </svg>
             <p class="font-bold text-[18px]">Your cart is empty.</p>
             <p class="text-[14px] mt-2 text-center max-w-[250px]">Looks like you haven't added any delicious meals yet!</p>
          </div>
        `;
    }

    cart.forEach(c => {
      count += c.quantity;
      total += c.price * c.quantity;

      itemsContainer.insertAdjacentHTML("beforeend", `
           <div class="flex flex-col sm:flex-row sm:items-center justify-between bg-white px-4 md:px-6 py-4 md:py-5 rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-50 gap-4">
             <div class="flex items-center gap-4 w-full sm:w-[55%]">
               <div class="w-16 h-16 flex-shrink-0 border border-gray-100 rounded-full overflow-hidden shadow-sm flex items-center justify-center p-2.5 bg-gray-50/50">
                 <img src="${c.image}" class="w-full h-full object-contain filter drop-shadow-sm"/>
               </div>
               <div>
                  <h4 class="font-bold text-[15px] md:text-[16px] text-[#03081F] line-clamp-2 leading-tight">${c.name}</h4>
                  <p class="font-bold text-[#FC8A06] text-[14px] mt-1">£${c.price.toFixed(2)}</p>
               </div>
             </div>
             
             <div class="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-[45%]">
                 <div class="flex items-center bg-gray-50 rounded-full p-1 border border-gray-100 shadow-inner">
                   <button class="cart-decrease w-8 h-8 flex justify-center items-center bg-white border border-gray-200 text-gray-800 rounded-full font-bold shadow-sm hover:bg-gray-100 transition-colors" data-id="${c.id}">
                     <svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M20 12H4"></path></svg>
                   </button>
                   <span class="font-bold text-[16px] w-10 text-center text-gray-800">${c.quantity}</span>
                   <button class="cart-increase w-8 h-8 flex justify-center items-center bg-white border border-gray-200 text-gray-800 rounded-full font-bold shadow-sm hover:bg-gray-100 transition-colors" data-id="${c.id}">
                     <svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"></path></svg>
                   </button>
                 </div>
                
             </div>
           </div>
        `);
    });

    badge.innerText = count;
    // simple pulse animation on updates
    badge.classList.add('transition-transform');
    totalAmountEl.innerText = '£' + total.toFixed(2);
  }
}

document.addEventListener("DOMContentLoaded", init);
