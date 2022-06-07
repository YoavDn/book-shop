'use strict'

const STORAGE_KEY = 'booksDB'
const PAGE_SIZE = 5

var gId = 1
var gPageIdx = 0

const gBooksTitle = [
  'Mobby Dick',
  'Harry potter',
  'The Subtle Art of Not Giving a F*ck',
  'JavaScript for dummies',
]

var gBooks
var gFilterBy = { title: '', maxPrice: 100, minRating: 0 }

_createBooks()

function getCurPage() {
  return gPageIdx
}

function selectPage(pageIdx) {
  const booksOnPage = getBooksOnPage(pageIdx)
  console.log(pageIdx)
  console.log(booksOnPage)

  if (booksOnPage > 0) gPageIdx = pageIdx
}

function _createBook(title) {
  return {
    id: makeId(),
    title,
    price: getRandomIntInclusive(3, 20),
    rating: 0,
  }
}

function _createBooks() {
  var books = loadFromStorage(STORAGE_KEY)

  if (!books || !books.length) {
    gId = 0
    books = gBooksTitle.map(book => _createBook(book))
  }
  gBooks = books
  _saveBooksToStorage()
}

function getBooks(isAll) {
  var books = gBooks.filter(book => {
    return (
      book.title.includes(gFilterBy.title) &&
      +book.price <= +gFilterBy.maxPrice &&
      +book.rating >= +gFilterBy.minRating
    )
  })
  if (!isAll) {
    const startIdx = gPageIdx * PAGE_SIZE
    books = books.slice(startIdx, startIdx + PAGE_SIZE)
  }

  return books
}

function _saveBooksToStorage() {
  saveToStorage(STORAGE_KEY, gBooks)
}

function addBook(title, price) {
  var book = _createBook(title)

  book.price = price
  gBooks.unshift(book)
  _saveBooksToStorage()
}

function removeBook(bookId) {
  var bookIdx = gBooks.findIndex(book => book.id === bookId)
  console.log(bookIdx)
  gBooks.splice(bookIdx, 1)
  _saveBooksToStorage()
}

function updateBooks(bookId, bookPrice) {
  console.log(bookId)
  var bookIdx = gBooks.findIndex(book => '' + book.id === bookId)
  console.log(gBooks)

  gBooks[bookIdx].price = bookPrice
  _saveBooksToStorage()
}

function getBook(bookId) {
  return gBooks.find(book => '' + book.id === bookId)
}

function updateBookRating(value, book) {
  if (book.rating >= 10 && value === '+') return
  if (book.rating <= 0 && value === '-') return

  value === '+' ? book.rating++ : book.rating--

  _saveBooksToStorage()
}

function setBookSort(value) {
  console.log(value)
  if (value === 'name') {
    gBooks.sort((b1, b2) => b1.title.localeCompare(b2.title))
  }
  gBooks = gBooks.sort((b1, b2) => +b2[value] - +b1[value])

  _saveBooksToStorage()
}

function setFilterBooks(filterBy = {}) {
  if (filterBy.maxPrice !== undefined) gFilterBy.maxPrice = filterBy.maxPrice
  if (filterBy.minRating !== undefined) gFilterBy.minRating = filterBy.minRating
  if (filterBy.title !== undefined) gFilterBy.title = filterBy.title
  // var books = gBooks.filter(book => book.title === value)

  return gFilterBy
}

function getBooksOnPage(pageIdx) {
  return gBooks.slice(pageIdx * PAGE_SIZE, pageIdx * PAGE_SIZE + 5).length
}
