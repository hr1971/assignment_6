
const categoryContainer = document.getElementById('category-container')

const plantContainer = document.getElementById('plant-container')

const cartContainer = document.getElementById('cart-container')

const cartCount = document.getElementById('cart-count')

let yourCart = []

const loadCategory = () => {
    fetch('https://openapi.programming-hero.com/api/categories')
.then((res) => res.json())
.then((data) => {
    const category = data.categories
    showCategory(category)
    
})
.catch(err => {
    console.log(err)
})
}

const showCategory = (category) => {
category.forEach(cate => {
        categoryContainer.innerHTML += `
        <li id="${cate.id}" class="hover:bg-green-600 cursor-pointer mb-2  font-medium ml-1">
        ${cate.category_name}</li>
        `
    });

    categoryContainer.addEventListener('click', (e) => {
        const allLi = document.querySelectorAll('li')
        allLi.forEach(li => {
            li.classList.remove('bg-green-600')
        })
        if (e.target.localName === 'li') {
            // console.log(e.target.id)
            e.target.classList.add('bg-green-600');
            loadPlantCategory(e.target.id)
            
        }
    })
}


 const loadPlantCategory = (id) => {
    fetch(`https://openapi.programming-hero.com/api/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
        showPlantByCategory(data.plants)
    })

 }

 const showPlantByCategory = (plants) => {
    // console.log(plants)
    plantContainer.innerHTML ="";
   plants.forEach(plant => {
    plantContainer.innerHTML += `

             <div class="max-w-xs w-full bg-white rounded-2xl shadow-lg overflow-hidden my-4">
        <div class="p-3">
            <img class="w-full h-40 object-cover rounded-xl"
                 src="${plant.image}"
                 alt="" />
        </div>
        
        <div id="${plant.id}" class="p-4">
            <h2 id="${plant.id}" class="text-xl font-bold text-gray-800">
              ${plant.name}
            </h2>
            <p class="text-sm text-gray-600 mt-1">
              ${plant.description}
            </p>
            
            <div class="flex items-center justify-between mt-4">
                <span class="inline-flex items-center px-3 py-1 text-xs font-medium bg-green-200 text-green-800 rounded-full">
                    ${plant.category}
                </span>
                <span id="${plant.id}" class="inline-flex items-center px-3 py-1 text-sm font-semibold bg-gray-200 text-gray-800 rounded-full">
                    ৳${plant.price}
                </span>
            </div>
            
            <button class="mt-4 w-full px-4 py-2 text-white font-semibold bg-green-600 hover:bg-green-700 transition duration-300 ease-in-out rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                Add to Cart
            </button>
        </div>
    </div>
    `
   })
 }

 plantContainer.addEventListener('click', (e) =>{
    // console.log(e.target)
if (e.target.innerText === 'Add to Cart') {
   
    handleCart(e)
}
 }

 )



 const handleCart = (e) => {
const name = e.target.parentNode.children[0].innerText
    const id = e.target.parentNode.id
    const price = e.target.parentNode.children[2].children[1].innerText

    yourCart.push({
        id:id,
        name: name,
        price:price
    })
    showCart(yourCart)
    // cartCount.innerText = yourCart.price
 }

 const showCart = (yourCart) => {
    cartContainer.innerHTML = "";
      let total = yourCart.reduce((sum, cart) => {
        const numericPrice = parseFloat(cart.price.replace('৳',''));
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
        `
    })
      cartCount.innerText = `Total:    ৳${total}`;
 }

 const handleDeleteCart = (cartDelete) => {
    // console.log(cartDelete)
    const filterCart = yourCart.filter(cart => cart.id !== cartDelete)
    console.log(filterCart)
    yourCart = filterCart
    showCart(yourCart)
 }
loadPlantCategory(1);
loadCategory();
