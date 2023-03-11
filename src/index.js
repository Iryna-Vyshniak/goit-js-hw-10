import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const countriesList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const searchBox = document.querySelector('#search-box');
const body = document.querySelector('body');

body.style.backgroundImage =
  'radial-gradient( circle 610px at 5.2% 51.6%,  rgba(5,8,114,1) 0%, rgba(7,3,53,1) 97.5% )';
countriesList.style.visibility = 'hidden';
countryInfo.style.visibility = 'hidden';

searchBox.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

// ---------- 1st variant --------------------
// function onInputSearch(e) {
//     e.preventDefault();

//     const searchCountries = e.target.value.trim();

//     if (!searchCountries) {
//         countriesList.style.visibility = "hidden";
//         countryInfo.style.visibility = "hidden";
//         countriesList.innerHTML = '';
//         countryInfo.innerHTML = '';
//         return;
//     }

//     fetchCountries(searchCountries)
//         .then(result => {
//             if (result.length > 10) {
//                 Notify.info('Too many matches found. Please, enter a more specific name.');
//                 return;
//             }
//             renderedCountries(result);
//         })
//         .catch(error => {
//             countriesList.innerHTML = '';
//             countryInfo.innerHTML = '';
//             Notify.failure('Oops, there is no country with that name');
//         })
// };

// function renderedCountries(result) {
//     const inputLetters = result.length;

//     if (inputLetters === 1) {
//         countriesList.innerHTML = '';
//         countriesList.style.visibility = "hidden";
//         countryInfo.style.visibility = "visible";
//         countryCardMarkup(result);
//     }

//     if (inputLetters > 1 && inputLetters <= 10) {
//         countryInfo.innerHTML = '';
//         countryInfo.style.visibility = "hidden";
//         countriesList.style.visibility = "visible";
//         countriesListMarkup(result);
//     }
// }

// function countriesListMarkup(result) {
//     const listMarkup = result.map((({ name, flags }) => {
//         return /*html*/ `<li>
//                         <img src="${flags.svg}" alt="${name}" width="60" height="auto">
//                         <span>${name.official}</span>
//                 </li>`;
//     })).join('');
//     countriesList.innerHTML = listMarkup;
//     return listMarkup;
// }

// function countryCardMarkup(result) {
//     const cardMarkup = result.map(({ flags, name, capital, population, languages }) => {
//         languages = Object.values(languages).join(", ");
//         return /*html*/ `
//             <img src="${flags.svg}" alt="${name}" width="320" height="auto">
//             <p> ${name.official}</p>
//             <p>Capital: <span> ${capital}</span></p>
//             <p>Population: <span> ${population}</span></p>
//             <p>Languages: <span> ${languages}</span></p>`;
//     }).join('');
//     countryInfo.innerHTML = cardMarkup;
//     return cardMarkup;
// }

//  ---------- 2nd variant -------------------------

function onInputSearch(e) {
  const value = searchBox.value.trim();
  console.log(value);

  if (!value) {
    addHidden();
    clearInterfaceUI();
    return;
  }

  fetchCountries(value)
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      renderCountries(data);
    })
    .catch(err => {
      clearInterfaceUI();
      Notify.failure('Oops, there is no country with that name');
    });
}

const generateMarkupCountryInfo = data =>
  data.reduce(
    (acc, { flags: { svg }, name, capital, population, languages }) => {
      console.log(languages);
      languages = Object.values(languages).join(', ');
      console.log(name);
      return (
        acc +
        ` <img src="${svg}" alt="${name}" width="320" height="auto">
            <p> ${name.official}</p>
            <p>Capital: <span> ${capital}</span></p>
            <p>Population: <span> ${population}</span></p>
            <p>Languages: <span> ${languages}</span></p>`
      );
    },
    ''
  );

const generateMarkupCountryList = data =>
  data.reduce((acc, { name: { official, common }, flags: { svg } }) => {
    return (
      acc +
      `<li>
        <img src="${svg}" alt="${common}" width="70">
        <span>${official}</span>
      </li>`
    );
  }, '');

function renderCountries(result) {
  if (result.length === 1) {
    countriesList.innerHTML = '';
    countriesList.style.visibility = 'hidden';
    countryInfo.style.visibility = 'visible';
    countryInfo.innerHTML = generateMarkupCountryInfo(result);
  }
  if (result.length >= 2 && result.length <= 10) {
    countryInfo.innerHTML = '';
    countryInfo.style.visibility = 'hidden';
    countriesList.style.visibility = 'visible';
    countriesList.innerHTML = generateMarkupCountryList(result);
  }
}

function clearInterfaceUI() {
  countriesList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function addHidden() {
  countriesList.style.visibility = 'hidden';
  countryInfo.style.visibility = 'hidden';
}
