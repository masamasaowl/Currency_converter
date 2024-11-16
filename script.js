// we want three things to happen
// 1. All countries must be listed in the dropdown
// 2. Flag must change with the country
// 3. Accurate currency exchange rate must be displayed


// we use the currency converter API
const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies"
  // removed "/eur.json"" from BASE_URL to update the currency later


// ================= DOM ==================
  const dropDowns = document.querySelectorAll(".dropDown select")
  const btn = document.querySelector("form button")
  const fromCurr = document.querySelector(".from select")
  const toCurr = document.querySelector(".to select")
  const message = document.querySelector(".message")



// ================ Pick your country ================

// inside the two selects of dropDown
for(let select of dropDowns){

  // we access the countryList object in the countries.js 
  for(let currencyCode in countryList){

    // inside select we create the option tags
    let newOption = document.createElement("option");

    newOption.innerText = currencyCode;
    // this makes <option>INR</option>
    newOption.value = currencyCode;
    // this makes <option value = "IN"></option>

    // to add the selected attribute to the <option> tag
    if (select.name === "From" && currencyCode === "INR"){
      newOption.selected = "selected";
    }
    else if(select.name === "To" && currencyCode === "JPY"){
      newOption.selected = "selected";
    }

    // now add these changes into the select tag
    select.append(newOption);
  }
  
  // an eventListener to change flag
  select.addEventListener("change", (evt)=> {
    updateFlag(evt.target)
    // evt.target tells the eventListener what was changed
  })
}

//================= Update the flag ===============

const updateFlag = (country) => {
  // here (country) = evt.target which is the selected country & (country) contains the <select> tag which was changed
  
  // now store the value attribute in selectedcurr
  let selectedcurr = country.value;
  // and the country name in countryName
  countryName =countryList[selectedcurr];

  // now the the image link
  let newFlag = `https://flagsapi.com/${countryName}/flat/64.png`;

  // now to select the img tag in this func we notice the structure
  // country => evt => select => div and we wish to choose the <img> in this div 
  let newImg = country.parentElement.querySelector("img");

  // change the link
  newImg.src = newFlag;
}

// ==================== Show the exchange rates ==============

// when convert is clicked (we made the arrow func async so await can be used later)
btn.addEventListener("click", async (evt) =>{
  // the first thing we do is 
  evt.preventDefault();
  // this doesn't let the form perform its default behaviour so all control is with us

  // access the <input> tag
  let amount = document.querySelector("form input");
  
  // access the number entered
  let amtVal = amount.value;

  // prevent input error
  if(amtVal === "" || amtVal < 1){
    amtVal = 1;
    amount.value = "1";
  } 

  // fromCurr.value contains the selected currency eg. USD,INR,JPY etc. so we store it in a variable
  // we forward this data to the API & as it has values in lowercase so we used the string method
  let currentcurr = fromCurr.value.toLowerCase();
  let convertedcurr = toCurr.value.toLowerCase();

  // the URl contains the link + our inputs
  const URL = `${BASE_URL}/${currentcurr}.json`

  // now we fetch the exchange rates
  let response = await fetch(URL);
  let data = await response.json(); 

  // see, data (object) contains inr (another object) & data.inr gives the inr object which contains conversions to all the currencies
  // data.inr.usd gives exchange of inr => usd 
  // we can't use data.currentcurr as it stores inr (string)so we instead use data[currentcurr] which reads inr as a key even when it is a string 

  let exchangeRate = data[currentcurr][convertedcurr];
  
  // so the value returned to user is 
  let finalAmount = amtVal * exchangeRate;
  
  // print the value
  message.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`
})