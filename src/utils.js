const marked = require('marked');

const { response } = require('express');

marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function(code, lang) {
    const hljs = require('highlight.js');
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class.
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartypants: false,
  xhtml: false
});

const days = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio","Julio", "Agosto", "Septembre", "Octubre", "Noviembre", "Diciembre"];

// get day name from index
function dayName(index = 0) {
  if(index > days.length || index < 0) return "Unknown Day";
  return days[index];
}
// get month name from index
function monthName(index = 0) {
  if(index > monthNames.length || index < 0) return "Unknown Month";
  return monthNames[index];
}

function getDate(date){
   // if(date !== "string") return "Unknown Date";

    date = new Date(date);
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    var dayWeekend = date.getDay();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    return monthName(month) + " " + day + " " + year + " " + hours + ":" + (minutes < 10 ? "0" + minutes : minutes);
}

// create li and add parent

function addTags(tags) {
  let ul = `<ul class="tags">`;
  tags.forEach((tag,index) => {
    if(index + 1 == tags.length){
      ul += `<li class="tag-chip"><a href=\"../../tags/${tag}\" target="_blank">${tag}.</a></li>`;
    }else{
      ul += `<li class="tag-chip"><a href=\"../../tags/${tag}\" target="_blank">${tag},</a></li>`;
    }
  });
  ul += "</ul>";
  return ul;
}
function addBlogs(blogs){
  let blogList = `<div class="bricks" id="bricks">`
  
  for(let i = 0; i < blogs.length; i++){
    blogList += addBlog(blogs[i]);
  }
  blogList += `</div>`;
  return blogList;
}

function addBlog(blog){
  let htmlBlog = `<div class="brick entry" data-title=\"${blog.title}\">\n<div class="brick thumb">`;
      htmlBlog += `<img class="unselectable" src=\"${blog.banner}\">\n</div>\n<div class="brick text">`;
      htmlBlog += `<p class="updated-text">${getDate(blog.updated)}</p>`
      htmlBlog += `<p class="title-text">${blog.title}</p>`;
      htmlBlog += `<p class="description-text">${blog.description}</p>`;
      htmlBlog += `<a class="read-more" href=\"/blog/${blog.slug}\">Leer Mas</a>\n</div></div>`;
  return htmlBlog;
}

function addList(base,items){
  let list = `<div class="list">\n<ul class="items">\n`;
  items.map((item) => {
    list += addItem(base,item);
  })
  list += `</ul>\n</div>`;
  return list;
}

function addItem(base, text){
  return `<li class="item"><a href="/${base}/${text}">${text}</a></li>`;
}

function parseComments(comments){
  let commentList = "<ol id=\"comments-list\" class=\"comments-list\">";
  let count = "Comentarios";

  if(Array.isArray(comments)){
    count = comments.length > 1 ? comments.length + " Comentarios" : comments.length + " Comentario";
    
    comments.map((comment) =>{
      commentList += addComment(comment);
    })
  }
  commentList += "</ol>"
  return {commentList, count};
}
function addComment(comment){
  let c = ` <li id=\"${comment.id}\" class="comment">\n<div class="comment-content">\n<div class="comment-info">\n<a class="comment-author" target="_blank" href=\"${comment.web}\">${comment.name}</a>`;
      c += `<div class="comment-meta">\n<p class="comment-time">${getDate(comment.publish)}</p>\n${comment.isHeart ? `<i class="fi fi-rr-heart-arrow"></i>` : ""}</div></div>\n<div class="comment-text">`;
      c += `<p>${comment.message}</p>\n</div></div>`;
      if(comment.isResponse){
        let response = comment.response;
      c += `<ul class="children">\n<li class="comment">\n<div class="comment-content">\n<div class="comment-info">\n<a class="comment-author" href=\"${response.web}\">${response.name}</a>\n<div class="comment-meta">`;
      c += `<p class="comment-time">${getDate(response.publish)}</p></div></div><div class="comment-text"><p>${response.message}</p></div></li></ul>`;
  }
      c += "</li>";
  return c;
}
function parseMarkdown(str) {
  return marked.parse(str);
}
function addVideo(data){
  if(data.isVideo === true){
      return {isVideo: true, video: parseVideo(data)};
  }
  return {isVideo: false};
}
function parseVideo(data){
  switch(data.videoApi.toLowerCase()){
    case "vimeo":
      return `<div class="player"><iframe src=\"https://player.vimeo.com/video/${data.video}\"  frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
    case "youtube":
      return `<div class="player"><iframe src=\"https://www.youtube.com/embed/${data.video}\" title=\"${data.title}\" frameborder="0" allow="accelerometer"; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
    case "native":
      default:
        return `<div class="player"><video src=\"${data.video}\" poster=\"${data.banner}\" controls></video></div>`;
  }
}
module.exports = {
    getDate: getDate,
    dayName: dayName,
    monthName: monthName,
    parseMarkdown: parseMarkdown,
    addTags: addTags,
    addBlogs: addBlogs,
    addList,
    addVideo,
    parseComments,
    addComment
}
