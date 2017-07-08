const articles_JSON = require('../articles.json');

exports.home = (req, res)=> {
    const articles = articles_JSON.articles;
    const portfolio = articles_JSON.portfolio;
    res.render('index', {
        title: 'Magazine | Home',
        articles: articles,
        portfolio: portfolio
    });
};

exports.single_article = (req, res)=> {
    const article_number = req.params.article_number;
    const articles = articles_JSON.articles;
    const portfolio = articles_JSON.portfolio;

    if(article_number >= 1 && article_number <= articles.length){
        const article = articles[article_number-1];
        const title = article.title;
        res.render('single_article', {
            title: title,
            articles: articles,
            article: article,
            portfolio: portfolio
        });
    }else{
        res.redirect('/');
    }
};

exports.not_found = (req, res)=> {
    res.send('<h1>404</h1>');
};
