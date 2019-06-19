// main javascript file

const apiKey = '60a3dcf9cae641079c0b61b24157da4c';
const selectMain = document.querySelector('main');
const selectSources = document.querySelector('#sources');
const defaultSource = 'the-washington-post';

window.addEventListener('load', async event => {
  //console.log('LISTENER window load event');
  updateNews();
  await updateSources();
  selectSources.value = defaultSource;
  
  selectSources.addEventListener('change', event => {
    //console.log('LISTENER selectSources change event');
    updateNews(event.target.value);
  });

  if ('serviceWorker' in navigator) {
    console.log('MAIN.JS serviceWorker in navigator');
    try {
      navigator.serviceWorker.register('sw.js');
      console.log('MAIN.JS service worker sw.js registered');
    } catch (error) {
      console.log('MAIN.JS service worker sw.js NOT registered');
    }
  } else {
    console.log('MAIN.JS serviceWorker NOT in navigator');
  }
});

async function updateNews(source = defaultSource) {
  //console.log('MAIN.JS updateNews function, source =', source);
  const res = await fetch(`https://newsapi.org/v1/articles?source=${source}&apiKey=${apiKey}`);
  const json = await res.json();
  selectMain.innerHTML = json.articles.map(createArticle).join('\n');
}

async function updateSources() {
  //console.log('MAIN.JS updateSources function');
  const res = await fetch(`https://newsapi.org/v1/sources`);
  const json = await res.json();
  selectSources.innerHTML = json.sources
  .map(src => `<option value="${src.id}">${src.name}</option>`).join('\n');
}

function createArticle(article) {
  //console.log('MAIN.JS createArticle function');
  return `
    <div class="article">
      <a href="${article.url}">
        <h2>${article.title}</h2>
        <img src="${article.urlToImage}" alt="Article Image">
        <p>${article.description}</p>
      </a>
    </div>
  `
}
