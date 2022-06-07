'use strict'

var gTrans = {
  title: {
    en: 'Book Shop',
    he: 'חנות ספרים',
  },
  'option-name': {
    en: 'Name',
    he: 'שם',
  },
  'label-sort': {
    en: 'Sort By:',
    he: 'מיין לפי:',
  },
  'option-price': {
    en: 'Price',
    he: 'מחיר',
  },
  'option-rating': {
    en: 'Rating',
    he: 'דירוג',
  },
  'add-book-btn': {
    en: 'Add new book',
    he: 'הוסף ספר',
  },
  'filter-label': {
    en: 'Filter by:',
    he: 'סנן לפי:',
  },
  'filter-max-price': {
    en: 'Max Price:',
    he: 'מחיר:',
  },
  'filter-min-rating': {
    en: 'Min Rating:',
    he: 'דירוג',
  },
  'book-id': {
    en: 'ID',
    he: 'שם מזהה',
  },
  'book-title': {
    en: 'Title',
    he: 'שם',
  },
  'book-rating': {
    en: 'Rating',
    he: 'דירוג',
  },
  'book-price': {
    en: 'Price',
    he: 'מחיר',
  },
  'book-actions': {
    en: 'Actions',
    he: 'פעולות',
  },
  'btn-update': {
    en: 'Update',
    he: 'עדכן',
  },
  'btn-delete': {
    en: 'Delete',
    he: 'מחק',
  },
  'btn-read': {
    en: 'Read',
    he: 'קרא',
  },
  'no-books-found': {
    en: 'No books Found..',
    he: '..לא נמצאו ספרים',
  },
  'name-input': {
    en: 'Name:',
    he: 'שם:',
  },
  //   'modal-rating': {
  //     en: 'Rating:',
  //     he: 'דירוג:',
  //   },
  //   'modal-price': {
  //     en: 'Price:',
  //     he: 'מחיר:',
  //   },
  //   'modal-id': {
  //     en: 'ID:',
  //     he: 'שם מזהה:',
  //   },
}

var gCurrLang = 'en'

function getTrans(transKey) {
  var keyTrans = gTrans[transKey]
  if (!keyTrans) return 'UNKNOWN'
  var txt = keyTrans[gCurrLang]

  if (!txt) txt = keyTrans.en
  return txt
}

function doTrans() {
  const els = document.querySelectorAll('[data-trans]')
  console.log(els)
  els.forEach(el => {
    var transKey = el.dataset.trans
    console.log(el)
    var txt = getTrans(transKey)
    el.innerText = txt
  })
}

function formatCurrency(num) {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
  }).format(num)
}

// var title = document.querySelectorAll('[data-trans]')
// console.log(title[5].firstChild.data)

function setLang(lang) {
  gCurrLang = lang
}

function isModal(el) {
  var [isModal] = el.dataset.trans.split('-')
  if (isModal === 'modal') return true
}
