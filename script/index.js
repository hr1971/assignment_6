const categoryContainer = document.getElementById('category-container');
const plantContainer = document.getElementById('plant-container');
const cartContainer = document.getElementById('cart-container');
const cartCount = document.getElementById('cart-count');
const cartTotalPrice = document.getElementById('cart-total-price');

let yourCart = [];

const manageSpinner = (status) => {
    if (status === true) {
        document.getElementById('spinner').classList.remove("hidden");
        document.getElementById('plant-container').classList.add("hidden");
    } else {
        document.getElementById('plant-container').classList.remove("hidden");
        document.getElementById('spinner').classList.add("hidden");
    }
};

// ✅ Load all plants first
const loadAllPlants = () => {
    manageSpinner(true);
    fetch('https://openapi.programming-hero.com/api/plants')
        .then((res) => res.json())
        .then((data) => {
            showPlantByCategory(data.plants);
        })
        .catch(err => console.error(err));
};

const loadCategory = () => {
    fetch('https://openapi.programming-hero.com/api/categories')
        .then((res) => res.json())
        .then((data) => {
            const category = data.categories;
            showCategory(category);
        })
        .catch(err => console.log(err));
};

const showCategory = (category) => {
    category.forEach(cate => {
        categoryContainer.innerHTML += `
        <li id="${cate.id}" class="hover:bg-green-600 cursor-pointer mb-2 font-medium ml-1">
        ${cate.category_name}</li>
        `;
    });

    categoryContainer.addEventListener('click', (e) => {
        const allLi = document.querySelectorAll('li');
        allLi.forEach(li => {
            li.classList.remove('bg-green-600');
        });
        if (e.target.localName === 'li') {
            e.target.classList.add('bg-green-600');
            loadPlantCategory(e.target.id);
        }
    });
};

const loadPlantCategory = (id) => {
    manageSpinner(true);
    fetch(`https://openapi.programming-hero.com/api/category/${id}`)
        .then((res) => res.json())
        .then((data) => {
            showPlantByCategory(data.plants);
        });
};

//  load plant details
const loadPlantDetails = async (id) => {
    const url = `https://openapi.programming-hero.com/api/plant/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    displayPlantDetails(details.plants);
};

const displayPlantDetails = (plant) => {
    const detailsBox = document.getElementById('details-container');
    detailsBox.innerHTML = `
      <div>
          <h1 class="text-xl font-bold text-gray-800 mb-2">${plant.name}</h1>

          <img class="w-full h-60 object-cover rounded-xl mb-2" src="${plant.image}" alt="">

          <p class="font-semibold mb-2"><span class="text-xl font-semibold">Category</span> : ${plant.category} </p>

          <p class="font-semibold mb-2"><span class="text-xl font-semibold">Price</span> : ${plant.price} </p>

          <p class="text-sm mt-1 mb-2"><span class="text-xl font-semibold">Description</span> - ${plant.description} </p>
      </div>
    `;
    document.getElementById('plantModal').showModal();
};

const showPlantByCategory = (plants) => {
    plantContainer.innerHTML = "";
    plants.forEach(plant => {
        plantContainer.innerHTML += `
             <div class="max-w-xs w-full bg-white rounded-2xl shadow-lg overflow-hidden my-4">
                <div class="p-3">
                    <img class="w-full h-40 object-cover rounded-xl"
                         src="${plant.image}"
                         alt="" />
                </div>
                
                <div id="${plant.id}" class="p-4">
                    <h2 onclick="loadPlantDetails(${plant.id})" class="text-xl font-bold text-gray-800 cursor-pointer">
                      ${plant.name}
                    </h2>
                    <p class="text-sm text-gray-600 mt-1">
                      ${plant.description}
                    </p>
                    
                    <div class="flex items-center justify-between mt-4">
                        <span class="inline-flex items-center px-3 py-1 text-xs font-medium bg-green-200 text-green-800 rounded-full">
                            ${plant.category}
                        </span>
                        <span class="inline-flex items-center px-3 py-1 text-sm font-semibold bg-gray-200 text-gray-800 rounded-full">
                            ৳${plant.price}
                        </span>
                    </div>
                    
                    <button onclick="loadCartModal(${plant.id})" class="mt-4 w-full px-4 py-2 text-white font-semibold bg-green-600 ease-in-out rounded-xl shadow-md">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
    });
    manageSpinner(false);
};

//  add cart modal
const loadCartModal = async (id) => {
    const url = `https://openapi.programming-hero.com/api/plant/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    displayAddCartDetails(details.plants);
};

const displayAddCartDetails = (plant) => {
    if (!plant) {
        console.error("No plant data received for cart modal");
        return;
    }

    const detailsBox = document.getElementById('addCart-container');
    detailsBox.innerHTML = `
      <div>
          <h1 class="text-xl font-bold text-gray-800 mb-2">${plant.name} has been added to Cart</h1>
          <button onclick="document.getElementById('addCartModal').close()" class="mt-2 px-4 py-2 bg-red-500 text-white rounded">Close</button>
      </div>
    `;
    document.getElementById('addCartModal').showModal();
};

plantContainer.addEventListener('click', (e) => {
    if (e.target.innerText === 'Add to Cart') {
        handleCart(e);
    }
});

const handleCart = (e) => {
    const name = e.target.parentNode.children[0].innerText;
    const id = e.target.parentNode.id;
    const price = e.target.parentNode.children[2].children[1].innerText;

    yourCart.push({
        id: id,
        name: name,
        price: price
    });
    showCart(yourCart);
};

const showCart = (yourCart) => {
    cartContainer.innerHTML = "";
    let total = yourCart.reduce((sum, cart) => {
        const numericPrice = parseFloat(cart.price.replace('৳', ''));
        return sum + numericPrice;
    }, 0);
    yourCart.forEach(cart => {
        cartContainer.innerHTML += `
        <div class="bg-emerald-50 w-full max-w-sm p-4 rounded-xl flex justify-between items-center shadow-md mb-1">
        
        <div>
            <h1 class="text-lg font-semibold text-gray-800">${cart.name}</h1>
            <p class="text-sm text-gray-500 mt-1">${cart.price} × 1</p>
        </div>

        <button onclick="handleDeleteCart('${cart.id}')" class="text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none">
            <i class="fa-solid fa-xmark text-lg"></i>
        </button>

    </div>
        `;
    });
    cartCount.innerText = `Total:    ৳${total}`;
};

const handleDeleteCart = (cartDelete) => {
    const filterCart = yourCart.filter(cart => cart.id !== cartDelete);
    yourCart = filterCart;
    showCart(yourCart);
};

// ✅ Call loadAllPlants first to show all plants
loadAllPlants();
loadCategory();