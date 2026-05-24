const fs = require('fs');
const files = [
  "e:\\my coding stuff\\devsquad'26\\week4\\day19_hackathon\\frontend\\src\\components\\ShowsListComponent\\TrendingShows.jsx",
  "e:\\my coding stuff\\devsquad'26\\week4\\day19_hackathon\\frontend\\src\\components\\ShowsListComponent\\MustShows.jsx",
  "e:\\my coding stuff\\devsquad'26\\week4\\day19_hackathon\\frontend\\src\\components\\MoviesListComponents\\TrendingMovies.jsx",
  "e:\\my coding stuff\\devsquad'26\\week4\\day19_hackathon\\frontend\\src\\components\\MoviesListComponents\\PopularMovies.jsx",
  "e:\\my coding stuff\\devsquad'26\\week4\\day19_hackathon\\frontend\\src\\components\\MoviesListComponents\\MustMovies.jsx",
  "e:\\my coding stuff\\devsquad'26\\week4\\day19_hackathon\\frontend\\src\\components\\homeComponents\\CategoriesSlider.jsx",
  "e:\\my coding stuff\\devsquad'26\\week4\\day19_hackathon\\frontend\\src\\components\\homeComponents\\SupportedDevices.jsx",
  "e:\\my coding stuff\\devsquad'26\\week4\\day19_hackathon\\frontend\\src\\components\\homeComponents\\FAQs.jsx"
];

files.forEach(f => {
  try {
    let content = fs.readFileSync(f, 'utf8');
    if (content.includes('"../../../../data"')) {
      content = content.replace(/"\.\.\/\.\.\/\.\.\/\.\.\/data"/g, '"../../data"');
      fs.writeFileSync(f, content, 'utf8');
      console.log("Updated " + f);
    }
  } catch (e) {
    console.error("Error with file: " + f, e);
  }
});
