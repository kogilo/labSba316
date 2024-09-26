// Shopping List
const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const itemFilter = document.getElementById("filter");
const formBtn = itemForm.querySelector("button");
let isEditMode = false;

function displayItems(){
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item => addItemToDOM(item));
    checkUI();
}

function onAddItemSubmit(e) {
    e.preventDefault();

    const newItem = itemInput.value;
    // Validate Input
    if(newItem === ""){
        alert("Please add an item");
        return;
    }
    
    // Create item DOM element
    addItemToDOM(newItem);
    // Add item to local storage
    addItemToStorage(newItem);

    checkUI();

    itemInput.value = "";

}

function addItemToDOM(item) {
    // Create list item
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(item));
    
    const button = createButton("remove-item btn-link text-red");
    li.appendChild(button);

    // Add li to the DOM
    itemList.appendChild(li);

}


function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon("fa-solid fa-xmark");
    button.appendChild(icon);
    return button;
}

function createIcon(classes){
    const icon = document.createElement("i");
    icon.className = classes;
    return icon;
}


function addItemToStorage(item) {
    const itemsFromStorage = getItemsFromStorage(); //DRY

    // Add new item to array
    itemsFromStorage.push(item);

    // Convert to JSON string and set to local storage
    localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage(){
    let itemsFromStorage;

    if (localStorage.getItem("items")=== null){
        itemsFromStorage = [];

    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem("items"));
    }
    return itemsFromStorage;
}

function onClickItem(e) {
    if(e.target.parentElement.classList.contains('remove-item')){
        removeItem(e.target.parentElement.parentElement);
    } else {
        setItemToEdit(e.target);
    }

}

function setItemToEdit(item){
    isEditMode = true;

    itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'));


    item.classList.add("edit-mode");
    formBtn.innerHTML = '<i class="fa-solid fa-pen"> Update Item </li>';
    formBtn.style.backgroundColor = "#228B22";
    itemInput.value = item.textContent;
}

function removeItem(item) {
    if (confirm("Are you sure?")) {
        // Remove item from DOM
        item.remove();
        // Remove item from Storage
        removeItemFromStorage(item.textContent);

        checkUI();
    }
}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();
    // Filter out item to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);
    // Re-set to localStorage 
    localStorage.setItem("items", JSON.stringify(itemsFromStorage))

}

function clearItems() {
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }

    // Clear from Local Storage
    localStorage.removeItem("items");

    checkUI();
}

function FilterItems(e) {
    const items = itemList.querySelectorAll("li"); //copied from below
    const text = e.target.value.toLowerCase();
    
    items.forEach(item => {
       const itemName = item.firstChild.textContent.toLowerCase(); 
       if (itemName.indexOf(text) != -1){
            item.style.display = "flex";

       } else {
             item.style.display = "none";
       }
    });
}

function checkUI(){
    const items = itemList.querySelectorAll("li");
    if (items.length === 0){ //No item
        clearBtn.style.display = "none";
        itemFilter.style.display = "none";
    } else {
        clearBtn.style.display = "block";
        itemFilter.style.display = "block";
    }
}

// Initialize app

function init() {
    // Event Listeners
itemForm.addEventListener("submit", onAddItemSubmit);
itemList.addEventListener("click", onClickItem);
clearBtn.addEventListener("click", clearItems);
itemFilter.addEventListener("input", FilterItems);
document.addEventListener("DOMContentLoaded", displayItems);

checkUI()

}

init();




////////////////

// Weather Display

const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apikey = "e32204053692af0c546bc2d23f921c27";

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();
    const city = cityInput.value;
    if(city) {
        try{
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);

        }
        catch(error){
            console.error(error);
            displayError(error);
        }

    } else {
        displayError("Please enter a city");
    }
})

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;
    const response = await fetch(apiUrl);
    
    if(!response.ok){
        throw new Error(`Could not fetch weather data for ${city}`);
    }
    return await response.json();
}


function displayWeatherInfo(data){
    const {name: city, 
        main: {temp, humidity}, 
        weather: [{description, id}]} = data;
        card.textContent = "";
        card.style.display = "flex";
        const cityDisplay = document.createElement("h1");
        const tempDisplay = document.createElement("p");
        const humidityDisplay = document.createElement("p");
        const descDisplay = document.createElement("p");
        const weatherEmoji = document.createElement("p");


        cityDisplay.textContent = city;
        tempDisplay.textContent = `${((temp - 273.15) * (9/5) + 32).toFixed(1)}°F`; 
        humidityDisplay.textContent = `Humidity: ${humidity}%`;
        descDisplay.textContent = description;
        weatherEmoji.textContent = getWeatherEmoji(id);
        

        cityDisplay.classList.add("cityDisplay");
        tempDisplay.classList.add("tempDisplay");
        humidityDisplay.classList.add("humidityDisplay");
        descDisplay.classList.add("descDisplay");
        weatherEmoji.classList.add("weatherEmoji");

        card.appendChild(cityDisplay);
        card.appendChild(tempDisplay);
        card.appendChild(humidityDisplay);
        card.appendChild(descDisplay);
        card.appendChild(weatherEmoji);


};

function getWeatherEmoji(weatherId) {
    switch(true) {
        case (weatherId >= 200 && weatherId < 300):
            return "⛈";
        case (weatherId >= 300 && weatherId < 400):
            return "🌧";
        case (weatherId >= 400 && weatherId < 500):
            return "🌧";
        case (weatherId >= 600 && weatherId < 700):
            return "❄";
        case (weatherId >= 700 && weatherId < 800):
            return "🌫";
        case (weatherId === 800):
            return "☀";
        case (weatherId >= 801 && weatherId < 810):
            return "☁";
        default:
            return "??";
}
}



function displayError(message) {
    const errorDisplay = document.createElement("p")
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay)



}