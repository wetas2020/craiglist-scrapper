const results = document.querySelectorAll('li.cl-search-result');

// .cl-search-result .posting-title .label
results.forEach((element) => {
    const titleElement = element.querySelector('.label');
    const title = titleElement ? titleElement.textContent : '';
    console.log(title);
});
