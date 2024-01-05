function getSongsEntries(target) {
  // can't read: Entries._collection._docs._map
  return JSON.parse(target.dataset.text || "{}");
}


// TODO sync app.norless.com with app-ua.norless.com
// Source
//  http://app.norless.com/playlist/h7e98MEHrJsD4sQHC

// function getElementIndex (element) {
//   return Array.from(element.parentNode.children).indexOf(element);
// }
//
// document.querySelector('.playlist').addEventListener('click', e => {
//   const entry = e.target.closest('.entry')
//   const index = getElementIndex(entry)
//   console.info('click', index, entry)
// });

// Target:
//  http://app-ua.norless.com/playlist/LYSyR9pAxc2tg5Nvp

// const entry = document.querySelector('.playlist .entry:nth-of-type(5)');
// entry.click()

