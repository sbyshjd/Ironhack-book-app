document.addEventListener('DOMContentLoaded', () => {

const container = document.querySelector('.search-ammount .pages')
const aTag = document.createElement("a");   
let pages = document.querySelector('.search-ammount h4')
let arrPages = []

for(i = 1 ; i < Number(pages.innerHTML) / 10 ; i++) {
  arrPages.push(i)
}
//const number = Math.ceil(Number(pages.innerHTML)/10)
console.log(Math.ceil(Number(pages.innerHTML)/10))
console.log(arrPages)

if(arrPages.length == 0 || arrPages.length < 10){
container.innerHTML = ``
} else if (arrPages.length > 10 && arrPages.length < 20) {
  container.innerHTML =
  `
  <a href="/search-results/${arrPages[0]}">${arrPages[0]}</a>
  `
} else if (arrPages.length > 20 && arrPages.length < 30) {
  container.innerHTML =
  `
  <a href="/search-results/${arrPages[0]}">${arrPages[0]}</a>
  <a href="/search-results/${arrPages[1]}">${arrPages[1]}</a>
  `
} else if (arrPages.length > 30 && arrPages.length < 40) {
  container.innerHTML =
  `
  <a href="/search-results/${arrPages[0]}">${arrPages[0]}</a>
  <a href="/search-results/${arrPages[1]}">${arrPages[1]}</a>
  <a href="/search-results/${arrPages[3]}">${arrPages[3]}</a>
  `
} else if (arrPages.length > 40 && arrPages.length < 50) {
  container.innerHTML = 
  `
  <a href="/search-results/${arrPages[0]}">${arrPages[0]}</a>
  <a href="/search-results/${arrPages[1]}">${arrPages[1]}</a>
  <a href="/search-results/${arrPages[3]}">${arrPages[3]}</a>
  <a href="/search-results/${arrPages[4]}">${arrPages[4]}</a>
  `
} else if (arrPages.length > 50) {
  container.innerHTML =
  `<button id="start">|</button>
  <button id="back">|<|</button>
  <div class="page">
  <a href="/search-results/${arrPages[0]}">${arrPages[0]}</a>
  <a href="/search-results/${arrPages[1]}">${arrPages[1]}</a>
  <a href="/search-results/${arrPages[2]}">${arrPages[2]}</a>
  <a href="/search-results/${arrPages[3]}">${arrPages[3]}</a>
  </div>
  <button id="forth">|>|</button>
  <button id="end">|</button>`
} 

const back  = document.querySelector('.search-ammount #back')
const forth = document.querySelector('.search-ammount #forth')

const start = document.querySelector('.search-ammount #start')
const end = document.querySelector('.search-ammount #end')

let one = 0; 
let two = 1; 
let three = 2; 
let four = 3;

forth.addEventListener('click',() => {
  const pageContainer = document.querySelector('.search-ammount .pages .page')

  if(four > Math.ceil(Number(pages.innerHTML)/10) -2 || four == Math.ceil(Number(pages.innerHTML)/10) -2) {
    return
  } else {
  one += 1 
  two += 1 
  three += 1 
  four += 1 
  pageContainer.innerHTML =
  `
  <a href="/search-results/${arrPages[one]}">${arrPages[one]}</a>
  <a href="/search-results/${arrPages[two]}">${arrPages[two]}</a>
  <a href="/search-results/${arrPages[three]}">${arrPages[three]}</a>
  <a href="/search-results/${arrPages[four]}">${arrPages[four]}</a>
  `
  }
})

back.addEventListener('click',() => {
  const pageContainer = document.querySelector('.search-ammount .pages .page')

  if(one < 0 || one == 0) {
    return
  } else {
  one -= 1 
  two -= 1 
  three -= 1 
  four -= 1 
  pageContainer.innerHTML =
  `
  <a href="/search-results/${arrPages[one]*10}">${arrPages[one]}</a>
  <a href="/search-results/${arrPages[two]*10}">${arrPages[two]}</a>
  <a href="/search-results/${arrPages[three]*10}">${arrPages[three]}</a>
  <a href="/search-results/${arrPages[four]*10}">${arrPages[four]}</a>
  `
  }
})



}, false);
