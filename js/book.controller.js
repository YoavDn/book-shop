'use strict '

function onInit() {
  renderFilterByQueryStringParams()
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
            <td>&bigstar;${book.rating}</td>
            <td>${book.price}</td>
            <td><button class="read-btn"onclick=onOpenModal("${book.id}")>Read</button></td>
            <td><button class="update-btn" onclick=onUpdateBook("${book.id}")>Update</button></td>
            <td><button class="delete-btn" onclick=onDeleteBook("${book.id}")>Delete</button></td>
          </tr>`
    })
    .join('')
  renderPagesNav()
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
  console.log(book)
  updateModalInfo(book)

  const elModal = document.querySelector('.modal')
  const elOverlay = document.querySelector('.overlay')

  elModal.classList.remove('hidden')
  elOverlay.classList.remove('hidden')
}

function updateModalInfo(book, isNewDesc = true) {
  const elModalTitle = document.querySelector('.book-title')
  const elModalPrice = document.querySelector('.book-price')
  const elModalId = document.querySelector('.book-id')
  const elModalRating = document.querySelector('.book-rating')
  const elModalDesc = document.querySelector('.book-desc')

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

  const queryStringParams = `?maxPrice=${filterBy.maxPrice}&minRating=${filterBy.minRating}`
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
    title: +queryStringParams.get('title') || '',
  }

  if (!filterBy.maxPrice && !filterBy.minRating) return

  document.querySelector('[name=min-rating]').value = filterBy.minRating
  document.querySelector('[name=max-price]').value = filterBy.maxPrice
  setFilterBooks(filterBy)
}

function onNextPage() {
  selectPage(1)
  renderBooks()
}

function onPrevPage() {
  selectPage(-1)
  renderBooks()
}

function renderPagesNav() {
  let booksLength = getBooks(true).length
  let pagesNum = 0

  const elPagesUi = document.querySelector('.query-pages')
  elPagesUi.innerHTML = ''

  while (booksLength % PAGE_SIZE > 0) {
    booksLength -= 5
    pagesNum++
  }

  for (var i = 0; i < pagesNum; i++) {
    elPagesUi.innerHTML += `<button class="page-btn" onclick="onSelectPage(${i})">${
      i + 1
    }</button>`
  }
}

function onSelectPage(pageIdx) {
  console.log('wnat to go here to page', pageIdx)
  selectPage(pageIdx)
  renderBooks()
}
