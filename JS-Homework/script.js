document.addEventListener("DOMContentLoaded", () => {

    const menuContainer = document.querySelector(".menu");
    const cartContainer = document.querySelector(".cart");
    const cartItemsContainer = document.querySelector(".cart-items");
    const totalAmountSpan = document.querySelector(".total-amount");
    const viewCartBtn = document.querySelector(".view-cart-btn");
    const checkoutBtn = document.querySelector(".checkout-btn");
    let previousCategory = "Всё";
    const keyLocalStorage = "cartItems";

    let menuItems = [];

    initializeMenu();

    const categories = ["Всё", "Супы", "Мясо", "Напитки"]

    let cartItems = [];

    function displayMenu(menuItems) {
        menuContainer.innerHTML = "";
        menuItems.forEach(item => {
            const menuItem = document.createElement("div");
            menuItem.className = "menu-item";
        menuItem.innerHTML = `
                        <img class="item-img" src="${item.image}">
                        <div class="item-content">
                            <h3 class="item-name">${item.name}</h3>
                            <p class="item-description">${item.description}</p>
                            <p class="price">${item.price} ₽</p>
                        </div>
                        <div class="item-actions">
                            <div class="quantity-control">
                                <button class="quantity-btn" data-action="decrease">
                                    <i class='fa fa-minus'></i>
                                </button>
                                <span class="quantity" data-quantity="1">1</span>
                                <button class="quantity-btn" data-action="increase">
                                    <i class='fa fa-plus'></i>
                                </button>
                            </div>
                            <button class="add-to-cart-btn" data-item-id="${item.id}">
                                <i class='fa fa-cart-plus'></i>
                            </button>
                        </div>
                        `;
            menuContainer.appendChild(menuItem);
        });

        const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const itemId = parseInt(btn.dataset.itemId);
                const quantityElement = btn.parentElement.querySelector('.quantity');
                const quantity = parseInt(quantityElement.dataset.quantity);

                addToCart(itemId, quantity);
                quantityElement.textContent = 1;
                quantityElement.dataset.quantity = 1;
            });
        });

        const quantityBtns = document.querySelectorAll('.quantity-btn');
        quantityBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                const quantityElement = btn.parentElement.querySelector('.quantity');
                const dataQuantity = quantityElement.dataset.quantity;
                let quantity = parseInt(dataQuantity);

                if (action === 'increase') {
                    quantity++;
                } else if (action === 'decrease' && quantity > 1) {
                    quantity--;
                }

                quantityElement.textContent = quantity;
                quantityElement.dataset.quantity = quantity;
            });
        });

        const images = document.querySelectorAll('.item-img');
        images.forEach(img => {
        img.addEventListener('click', function() {
            const modal = document.getElementById('imageModal');
            const modalImg = document.getElementById("img01");
            const captionText = document.getElementById("caption");
            const itemName = this.nextElementSibling.querySelector('.item-name').textContent; 
            modal.style.display = "block";
            modalImg.src = this.src;            
            captionText.innerHTML = itemName; 
        });
    });
    }

    async function getMenuItems() {
    const result = await fetch('menu.json').then(res => res.json());

    const soups = result.soups.map(item => ({ ...item, category: 'Супы' }));
    const drinks = result.drinks.map(item => ({ ...item, category: 'Напитки' }));
    const meats = result.meats.map(item => ({ ...item, category: 'Мясо' }));
    return [...soups, ...drinks, ...meats];
    }

    async function initializeMenu() {
        menuItems = await getMenuItems();
        displayMenu(menuItems);
    }

    function addToCart(itemId, quantity = 1) {
        const selectedItem = menuItems.find(item => item.id === itemId);

        const existingItem = cartItems.find(item => item.id === itemId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            selectedItem.quantity = quantity;
            cartItems.push(selectedItem);
        }

        updateCart();
    }

    function updateCart() {
        cartContainer.style.position = "fixed";
        cartContainer.style.bottom = "20px";
        cartContainer.style.right = "20px";
        cartContainer.style.backgroundColor = "#ffffffff"; // Замените #darkerColor на желаемый цвет
        cartContainer.style.width = "300px"; // или другой желаемый размер
        cartContainer.style.height = "auto";
        cartContainer.style.overflowY = "scroll";
        cartContainer.style.zIndex = 100;

        cartItemsContainer.innerHTML = "";
        let totalAmount = 0;
        if (cartItems.length > 0) {
            checkoutBtn.disabled = false;
        } else {
            checkoutBtn.disabled = true;
        }
        localStorage.setItem(keyLocalStorage, JSON.stringify(cartItems));

        cartItems.forEach(item => {
            const cartItem = document.createElement("li");
            cartItem.className = "cart-item";

            cartItem.innerHTML = `
            <div class="name-remove-button">
                <span>${item.name}</span>
                <button class="remove-from-cart-btn" data-item-id="${item.id}">&times;</button>
            </div>
            <div class="cart-item-actions">
                <span class="amount-cart-item">${item.price * item.quantity} ₽</span>
                <button class="quantity-btn" data-action="decrease" data-item-id="${item.id}">
                    <i class='fa fa-minus'></i>
                </button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" data-action="increase" data-item-id="${item.id}">
                    <i class='fa fa-plus'></i>
                </button>
            </div>
            `;

            cartItemsContainer.appendChild(cartItem);
            totalAmount += item.price * item.quantity;
        });

        totalAmountSpan.textContent = totalAmount;
        cartContainer.style.display = "block";
        cartContainer.style.width = "20%";
        menuContainer.style.width = "78%";
        const headerHeight = document.querySelector('header').offsetHeight;
        cartContainer.style.top = headerHeight + "px";


        const quantityBtns = document.querySelectorAll('.quantity-btn');
        quantityBtns.forEach(btn => {
            btn.addEventListener('click', () =>  {
                const action = btn.dataset.action;
                const itemId = parseInt(btn.dataset.itemId);
                updateQuantityInCart(itemId, action);
            });
        });

        const removeFromCartBtns = document.querySelectorAll('.remove-from-cart-btn');
        removeFromCartBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const itemId = parseInt(btn.dataset.itemId);
                removeFromCart(itemId);
            });
        });
    }

    function updateQuantityInCart(itemId, action) {
        const selectedItem = cartItems.find(item => item.id === itemId);

        if (selectedItem) {
            if (action === 'increase') {
                selectedItem.quantity++;
            } else if (action === 'decrease' && selectedItem.quantity > 1) {
                selectedItem.quantity--;
            }

            updateCart();
        }
    }

    function removeFromCart(itemId) {
        cartItems = cartItems.filter(item => item.id !== itemId);
        updateCart();
    }

    function loadFromLocalStorage() {
        let data = localStorage.getItem(keyLocalStorage);

        cartItems = data ? JSON.parse(data) : [];
    }

    viewCartBtn.addEventListener("click", () => {
        loadFromLocalStorage();
        updateCart();
    });

    checkoutBtn.addEventListener("click", () => {
        if (!document.querySelector(".checkout-box-container")) {
            const checkoutBoxContainer = document.createElement('div');
            checkoutBoxContainer.classList.add("checkout-box-container");
            checkoutBoxContainer.innerHTML = `
            <div class="checkout-box">
                <div class="checkout-box-content">
                    <div class="checkout-box-header">
                        <h2>Ваш заказ</h2>
                        <button class="close-checkout-box">&times;</button>
                    </div>
                    <p>Введите номер банковской карты...</p>
                    <div class="phone-order">
                    <input class="credit-card" type="text" name="creditCard" placeholder="Номер кредитной карты" required>

                    <label for="credit-card-date">Дата:</label>
                    <input class="credit-card-date" type="text" name="creditCardDate" id="credit-card-date" placeholder="ММ/ГГ" required>
                    
                    <label for="credit-card-cvc">CVC:</label>
                    <input class="credit-card-cvc" type="text" name="creditCardCvc" id="credit-card-cvc" placeholder="CVC" required>
                    

                    <button class="place-order">ЗАКАЗАТЬ</button>
                    </div>
                </div>
            </div>
            `
            document.body.appendChild(checkoutBoxContainer);
            checkoutBoxContainer.style.display = "block";
            const closeCheckoutBoxBtn = document.querySelector(".close-checkout-box");

            closeCheckoutBoxBtn.addEventListener('click', () => {
                checkoutBoxContainer.style.display = "none";
            });

            createThanksOrder(false);
        } else {
            const checkoutBoxContainer = document.querySelector(".checkout-box-container");
            checkoutBoxContainer.style.display = "block";
            const closeCheckoutBoxBtn = document.querySelector(".close-checkout-box");

            closeCheckoutBoxBtn.addEventListener('click', () => {
                checkoutBoxContainer.style.display = "none";
            });

            createThanksOrder(true);
        }
    });

    function createThanksOrder(isThanksForOrderContainer) {
        const checkoutBoxContainer = document.querySelector(".checkout-box-container")
        const placeOrder = document.querySelector(".place-order");

        placeOrder.addEventListener('click', () => {
            checkoutBoxContainer.style.display = "none";
            if (!isThanksForOrderContainer) {
                const thanksForOrderContainer = document.createElement('div');
                thanksForOrderContainer.classList.add("thanks-for-order-container");
                thanksForOrderContainer.innerHTML = `
                <div class="thanks-for-order">
                    <div class="thanks-for-order-content">
                        <div class="thanks-close-thanks-container">
                            <p class="thanks">Спасибо за заказ!</p>
                            <button class="close-thanks-btn">&times;</button>
                        </div>
                        <p class="thanks-description">В течении 10 минут с вами свяжутся</p>
                    </div>
                </div>
                `
                document.body.appendChild(thanksForOrderContainer);
            }
            const thanksForOrderContainer = document.querySelector(".thanks-for-order-container")
            thanksForOrderContainer.style.display = "block";

            const closeThanksBtn = document.querySelector(".close-thanks-btn");
            closeThanksBtn.addEventListener('click', () => {
                thanksForOrderContainer.style.display = "none";
                localStorage.removeItem(keyLocalStorage);
                cartItems = [];
                updateCart();
            });
        });
    }

    const cartHeader = document.querySelector('.cart');
    const closeCartBtn = document.createElement('button');
    closeCartBtn.className = 'close-cart-btn';
    closeCartBtn.innerHTML = '&times;';
    cartHeader.appendChild(closeCartBtn);

    closeCartBtn.addEventListener('click', () => {
        cartContainer.style.display = "none";
        menuContainer.style.width = "100%";
    });

    const barsBtn = document.querySelector(".bars-btn");
    const filterMenuContainer = document.createElement("div");
    filterMenuContainer.classList.add("filter-menu");
    document.body.appendChild(filterMenuContainer);

    barsBtn.addEventListener("click", () => {
        displayFilterMenu();
        filterMenuContainer.classList.toggle("show");
    });

    function displayFilterMenu() {
        filterMenuContainer.innerHTML = "";

        categories.forEach(category => {
            const filterItem = document.createElement("div");
            filterItem.classList.add("filter-item");
            filterItem.textContent = category;
            if (category === previousCategory) {
                filterItem.classList.add("active");
            }

            filterItem.addEventListener("click", () => {
                filterMenu(category)
                filterMenuContainer.classList.toggle("show");
                previousCategory = category;
            });

            filterMenuContainer.appendChild(filterItem);
        });
    }

    function filterMenu(category) {
        if (category === "Всё") {
            displayMenu(menuItems);
        } else {
            const filteredMenu = menuItems.filter(item => item.category === category);
            menuContainer.innerHTML = "";
            displayMenu(filteredMenu);
        }
    }

    const upButton = document.querySelector(".arrow-up-btn");
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            upButton.classList.add("show-arrow-up-btn");
        } else {
            upButton.classList.remove("show-arrow-up-btn");
        }
    });

    upButton.addEventListener('click', () => {
        window.scrollTo(0, 0);
    });

    displayMenu(menuItems);    

// Получение модального окна
const modal = document.getElementById('imageModal');
const span = document.getElementsByClassName("close")[0];
span.onclick = function() {
    modal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

});