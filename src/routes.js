const {Router} = require('express');
const api = require('./api');
const utils = require("./utils");
const router = new Router();

router.get("/", (req, res) => {
    api.getRecentBlogs().then((resp) => {  
        res.render("index",{blogs: utils.addBlogs(resp.content)});
     }).catch((err) => res.render('404',{image: "images/day-toolbox.svg", title: "Tuvimos un error.", message: "El blog no existe o no pudimos encontrarlo revisa que el ID del blog este bien escrito."}));
});

router.get("/blog", (req, res) => {
    api.getBlogs().then((resp) => {  
         res.render("blog",{count: resp.length, blogs: utils.addBlogs(resp)});
     }).catch((err) => res.render('404',{image: "/images/day-toolbox.svg", title: "Se a producido un error.", message: "El blog no existe o no pudimos encontrarlo revisa que el ID del blog este bien escrito."}));
});

router.get("/blog/:slug", async(req, res) => {
    const slug = req.params.slug;
    await api.getBlog(slug).then(async(resp) => {
        let time = {
            "created": utils.getDate(resp.created_at),
            "updated": utils.getDate(resp.update_at)
        }
    let comments = await api.getComments(resp.id).then((c) => c).catch((err) => "");
    let parsedComments = utils.parseComments(comments);

     res.render("blogs/index", {data: resp, time: time, content: utils.parseMarkdown(resp.content), tags: utils.addTags(resp.tags), player: utils.addVideo(resp), comments: parsedComments});
    }).catch((err) => res.render('404',{image: "/images/day-owl.svg", title: "Blog no Encontrado.", message: "El blog no existe o no pudimos encontrarlo revisa que el ID del blog este bien escrito."}));
});

router.get('/search', (req, res) => {
    const {title, category, tag} = req.query;
    api.search(title, category, tag).then((resp) => {
        res.render("search", {filter: title || category || tag, blogs: Array.isArray(resp.results) ? utils.addBlogs(resp.results) : `<p class="not-found">${resp.results}</p>`, count: resp.count});
    }).catch((err) => res.render('404',{image: "/images/day-owl.svg", title: "No hay resultados.", message: "Esta buscando algo fuera de nuestro alcanze lo sentimos."}));
});

router.get('/category', (req, res) => {
    api.getCategories().then((resp) => {
       res.render("list", {title: "Categorias", msg: "Estas son las categorias que se usa en todos los blogs existentes.", list: utils.addList("category", resp)});
    }).catch((err) => res.render('404',{image: "/images/day-owl.svg", title: "No hay resultados.", message: "Esta buscando algo fuera de nuestro alcanze lo sentimos."}));
});

router.get('/tags', (req, res) => {
    api.getTags().then((resp) => {
       res.render("list", {title: "Etiquetas", msg: "Estas son las etiquetas que se usa en todos los blogs existentes.", list: utils.addList("tags",resp)});
    }).catch((err) => res.render('404',{image: "/images/day-owl.svg", title: "No hay resultados.", message: "Esta buscando algo fuera de nuestro alcanze lo sentimos."}));
});

router.get('/category/:category', (req, res) => {
    const {category} = req.params;
    api.search(undefined, category, undefined).then((resp) => {
        res.render("search", {filter: category, blogs: Array.isArray(resp.results) ? utils.addBlogs(resp.results) : `<p class="not-found">${resp.results}</p>`, count: resp.count});
    }).catch((err) => res.render('404',{image: "/images/day-owl.svg", title: "No hay resultados.", message: "Esta buscando algo fuera de nuestro alcanze lo sentimos."}));
});

router.get('/tags/:tag', (req, res) => {
    const {tag} = req.params;
    api.search(undefined, undefined, tag).then((resp) => {
        res.render("search", {filter: tag, blogs: Array.isArray(resp.results) ? utils.addBlogs(resp.results) : `<p class="not-found">${resp.results}</p>`, count: resp.count});
    }).catch((err) => res.render('404',{image: "/images/day-owl.svg", title: "No hay resultados.", message: "Esta buscando algo fuera de nuestro alcanze lo sentimos."}));
});
module.exports = router;
