'use strict '

function onInit() {
  renderFilterByQueryStringParams()
  renderQueryStringModalParam()
  renderBooks()
}
function renderBooks() {
  var books = getBooks(false)

  const elTbody = document.querySelector('tbody')

  elTbody.innerHTML = books
    .map(book => {
      return `<tr>
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>&bigstar; ${book.rating}</td>
            <td>${formatCurrency(book.price, gCurrLang)}</td>
            <td><button data-trans="btn-read" class="read-btn"onclick=onOpenModal("${
              book.id
            }")>Read</button></td>
            <td><button data-trans="btn-update" class="update-btn" onclick=onUpdateBook("${
              book.id
            }")>Update</button></td>
            <td><button data-trans="btn-delete"class="delete-btn" onclick=onDeleteBook("${
              book.id
            }")>Delete</button></td>
          </tr>`
    })
    .join('')
  renderPagesNav()
  doTrans()
}

function onAddBook() {
  var bookName = prompt('Enter book name:')
  var bookPrice = prompt('Enter book Price:')
  if (bookName === null || bookPrice === null) return
  addBook(bookName, bookPrice)
  renderBooks()
}

function onDeleteBook(bookId) {
  removeBook(bookId)
  renderBooks()
}

function onUpdateBook(bookId) {
  var bookPrice = prompt('Enter book Price:')
  updateBooks(bookId, bookPrice)
  renderBooks()
}

function onOpenModal(bookId) {
  const book = getBook(bookId)

  updateModalInfo(book)

  const elModal = document.querySelector('.modal')
  const elOverlay = document.querySelector('.overlay')

  elModal.classList.remove('hidden')
  elOverlay.classList.remove('hidden')
  saveQueryString(book.id)
}

function updateModalInfo(book, isNewDesc = true) {
  const elModalTitle = document.querySelector('.book-title')
  const elModalPrice = document.querySelector('.book-price')
  const elModalId = document.querySelector('.book-id')
  const elModalRating = document.querySelector('.book-rating')
  const elModalDesc = document.querySelector('.book-desc')
  const elUpdateRate = document.querySelector('.update-rate')

  elUpdateRate.innerText = book.rating
  elModalId.innerText = book.id
  elModalPrice.innerText = book.price
  elModalTitle.innerText = book.title
  elModalRating.innerText = book.rating
  if (isNewDesc) {
    elModalDesc.innerText = makeLorem(getRandomIntInclusive(30, 70))
  }
}

function onCloseModal() {
  const elModal = document.querySelector('.modal')
  const elOverlay = document.querySelector('.overlay')
  elModal.classList.add('hidden')
  elOverlay.classList.add('hidden')
  saveQueryString()

  renderBooks()
}

function onRateBook(elBtn) {
  const elRateNum = document.querySelector('.update-rate')
  const bookId = document.querySelector('.book-id').innerText
  const book = getBook(bookId)
  const value = elBtn.innerText

  updateBookRating(value, book)
  elRateNum.innerText = book.rating
  updateModalInfo(book, false)
}

function onSortBooks() {
  const value = document.querySelector('[name=sort-books]').value

  setBookSort(value)
  console.log(value)
  renderBooks()
}

function onFilterBooks(filterBy) {
  filterBy = setFilterBooks(filterBy)
  renderBooks()

  const queryStringParams = `?maxPrice=${filterBy.maxPrice}&minRating=${filterBy.minRating}&title=${filterBy.title}`
  const newUrl =
    window.location.protocol +
    '//' +
    window.location.host +
    window.location.pathname +
    queryStringParams
  window.history.pushState({ path: newUrl }, '', newUrl)
}

function renderFilterByQueryStringParams() {
  // Retrieve data from the current query-params
  const queryStringParams = new URLSearchParams(window.location.search)

  const filterBy = {
    maxPrice: queryStringParams.get('maxPrice') || '',
    minRating: +queryStringParams.get('minRating') || 0,
    title: queryStringParams.get('title') || '',
  }

  if (!filterBy.maxPrice && !filterBy.minRating) return

  document.querySelector('[name=min-rating]').value = filterBy.minRating
  document.querySelector('[name=max-price]').value = filterBy.maxPrice
  setFilterBooks(filterBy)
}

function onNextPage() {
  const nextPage = getCurPage() + 1
  selectPage(nextPage)
  renderBooks()
}

function onPrevPage() {
  const prevPage = getCurPage() - 1

  selectPage(prevPage)
  renderBooks()
}

function renderPagesNav() {
  let booksLength = getBooks(true).length
  let pagesNum = 0
  const currPage = getCurPage()
  if (!booksLength) {
    renderMsg()
    doTrans()
  }
  const elPagesUi = document.querySelector('.query-pages')
  elPagesUi.innerHTML = ''

  while (booksLength % PAGE_SIZE > 0) {
    booksLength -= 5
    pagesNum++
  }

  for (var i = 0; i < pagesNum; i++) {
    var className = 'page-btn'
    if (i === currPage) className += ' active'
    elPagesUi.innerHTML += `<button class="${className}" onclick="onSelectPage(${i})">${
      i + 1
    }</button>`
  }
}

function onSelectPage(pageIdx) {
  selectPage(pageIdx)
  renderBooks()
}

function renderMsg() {
  const elTbody = document.querySelector('tbody')
  elTbody.innerHTML = `<tr> <td data-trans="no-books-found" class="eror-msg" colspan="5">No books found...</td> </tr>`
}

function updateRatingValue(val) {
  document.getElementById('rating-value').innerText = val
}

function updatePriceValue(val) {
  document.getElementById('price-value').innerText = val
}

function onChangeLang(lang) {
  var shortLang = lang === 'english' ? 'en' : 'he'
  var elBody = document.querySelector('body')
  setLang(shortLang)
  if (shortLang === 'he') elBody.classList.add('rtl')
  else elBody.classList.remove('rtl')
  renderBooks()
}

function saveQueryString(bookId = '') {
  const filter = getFilterBy()

  const queryStringParams = `?name=${filter.name}&maxPrice=${filter.maxPrice}&readingId=${bookId}`
  const newUrl =
    window.location.protocol +
    '//' +
    window.location.host +
    window.location.pathname +
    queryStringParams
  window.history.pushState({ path: newUrl }, '', newUrl)
}

function renderQueryStringModalParam() {
  const queryStringParams = new URLSearchParams(window.location.search)
  const readingId = queryStringParams.get('readingId') || ''
  if (readingId) onOpenModal(readingId)
}

//handle click outside of overlay
const elDocument = document.querySelector('body')

elDocument.addEventListener('click', e => {
  if (e.target.classList.contains('overlay')) onCloseModal()
})
