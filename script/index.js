
const categoryContainer = document.getElementById('category-container')

const plantContainer = document.getElementById('plant-container')

const loadCategory = () => {
    fetch('https://openapi.programming-hero.com/api/categories')
.then((res) => res.json())
.then((data) => {
    const category = data.categories
    showCategory(category)
    
})
.Catch(err => {
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
    console.log(id)
    fetch(`https://openapi.programming-hero.com/api/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
        showPlantByCategory(data.plants)
    })

 }

 const showPlantByCategory = (plants) => {
    console.log(plants)
   plants.forEach(plant => {
    plantContainer.innerHTML += `
              <div class="card bg-base-100 w-full  shadow-sm">
  <figure class=" ">
    <img class="w-full h-40 p-3"
      src="${plant.image}"
      alt="" />
  </figure>
  <div class="card-body">
    <h2 class="card-title">
      ${plant.name}
    </h2>
    <p>${plant.description}</p>
    <div class="card-actions justify-between">
      <p class="badge  bg-green-200">${plant.category}</p>
      <p class="badge ">৳${plant.price}</p>
      
    </div>
    <button class="btn rounded-xl bg-green-600 text-white">Add to Cart</button>
  </div>
</div>
    `
   })
 }

loadCategory();