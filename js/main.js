// main javascript file

const apiKey = '60a3dcf9cae641079c0b61b24157da4c';
const selectMain = document.querySelector('main');
const selectSources = document.querySelector('#sources');
const defaultSource = 'the-washington-post';

window.addEventListener('load', async (event) => {
  updateNews();
  await updateSources();
  selectSources.value = defaultSource;
  
  selectSources.addEventListener('change', event => {
    updateNews(event.target.value);
  });

  //document.getElementById('butRefresh').addEventListener('click', (event) => {
  //  console.log('refresh clicked');
  //});

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(registration => {
        console.log(`Service Worker registered! Scope: ${registration.scope}`);
      })
      .catch(err => {
        console.log(`Service Worker registration failed: ${err}`);
      });
  };
}); // end window load event ----------

async function updateNews(source = defaultSource) {
  const res = await fetch(`https://newsapi.org/v1/articles?source=${source}&apiKey=${apiKey}`);
  const json = await res.json();
  selectMain.innerHTML = json.articles.map(createArticle).join('\n');
}

async function updateSources() {
  const res = await fetch(`https://newsapi.org/v1/sources`);
  const json = await res.json();
  selectSources.innerHTML = json.sources
  .map(src => `<option value="${src.id}">${src.name}</option>`).join('\n');
}

function createArticle(article) {
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
