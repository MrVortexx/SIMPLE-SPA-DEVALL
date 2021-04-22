import Post from './views/Post.js';
import BlogAbout from './views/BlogAbout.js';

function makeShowMoreBtn( onClickCallBack)
{
    const showMoreBtn = document.createElement('button');
    showMoreBtn.setAttribute("id", "load-more-btn");
    showMoreBtn.innerHTML = "Carregar mais";
    showMoreBtn.addEventListener('click', ()=>{
        onClickCallBack();
    });

    return showMoreBtn;
}

function makeSearchDiv(onClickCallBack){
    let searchDiv, searchInput, searchBtn;
    searchDiv = document.createElement('div')
    searchDiv.classList.add("search-form");

    searchInput = document.createElement('input');
    searchInput.classList.add("search-input");
    searchInput.setAttribute("type", "search");
    searchInput.setAttribute("placeholder", "Digite o nome de um blog ou de um artigo aqui!");

    searchBtn = document.createElement('button');
    searchBtn.classList.add("search-btn");
    searchBtn.innerHTML = '<i class="fa fa-search" aria-hidden="true"></i>';

    searchDiv.insertAdjacentElement('beforeend', searchInput);
    searchDiv.insertAdjacentElement('beforeend', searchBtn);


    searchInput.addEventListener('change', (e)=>{
        onClickCallBack(e.target.value);
    })
    
    return searchDiv;
}
function clearElement(element)
{
    while(element.firstChild) element.removeChild(element.firstChild);
}
 function BlogCaller(blogId, source)
{
    
    let app = document.getElementById('main-container');
    if (source != "blog-about") app.innerHTML = "";

    let postList = document.getElementById('posts');
    if (!postList){
        postList = document.createElement('div');
        postList.setAttribute("id", "posts");
    }else postList.innerHTML = "";
    
  

    app.insertAdjacentElement('beforeend', postList);

    const postInstance = new Post(null, "Home");

    let showMoreBtn = document.getElementById("load-more-btn");

    this.setPosts = async () => {
        if (!showMoreBtn){
            showMoreBtn = makeShowMoreBtn(this.setPosts);
            app.insertAdjacentElement('beforeend', showMoreBtn);
        }
        showMoreBtn.classList.add('dont-show');
       
        let posts =  await postInstance.nodesHTMLContainer(blogId);

        posts.map(async (post)=>{ postList.insertAdjacentElement('beforeend', post); }); 

        showMoreBtn.classList.remove('dont-show');
      

    }

    this.searchPosts = async (value)=>{
        showMoreBtn.classList.add('dont-show');
        clearElement(postList)

        let posts =  await postInstance.nodesHTMLContainer(null, value);

        posts.map(async (post)=>{ postList.insertAdjacentElement('beforeend', post); });
        

        console.log(postList)

        showMoreBtn.classList.add('dont-show');

    }

    if (source != 'blog-about'){
        let searchDiv = makeSearchDiv(this.searchPosts);
        app.insertAdjacentElement('afterbegin', searchDiv);
    }
 
}

function BlogAboutCaller(blogId){
    let app = document.getElementById("main-container");
    app.innerHTML = "";
    let blogAboutDiv = document.createElement('div');
    blogAboutDiv.setAttribute("id", "blog-about");
    app.insertAdjacentElement('afterbegin', blogAboutDiv);

    const blogAboutInstance = new BlogAbout({blogId: blogId}, "Blog info");

    this.setPosts = async () => {
        let blogAbout =  await blogAboutInstance.nodesHTMLContainer();
        
        blogAbout.map(async (post)=>{ blogAboutDiv.insertAdjacentElement('afterbegin', post); }); 

        const lastPosts = document.createElement('div');
        lastPosts.classList.add("blog-about-last-posts");
        lastPosts.innerHTML = "<span/> Veja as ultimas postagens deles:";
        app.insertAdjacentElement('beforeend', lastPosts);

        const blog = new BlogCaller(blogId, "blog-about");
        blog.setPosts();
    }   
}



/* NAVEGATE ROUTES */
const routes = [
    {   path: "/home", showHtml:()=>        {setBlogPosts()}},
    {   path: "/blog", showHtml:(id)=>    {setBlogAbout(id)}},
    {   path: "/about", showHtml: BlogAbout},
    {   path: "/register", showHtml: Post},
    {   path: "/signin", showHtml: Post}
];
/* NAVEGATE ROUTES */

function setBlogPosts(){
   


    const blog =  new BlogCaller();
    blog.setPosts();
}
function setBlogAbout(blogId){
    const blogAbout = new BlogAboutCaller(blogId);
    blogAbout.setPosts();
}

async function navegateToPage(pathname, target){
    if (pathname.length == 1 ){
       navegateToPage('/home');
        return;
    }
    
    const view = routes.find(route =>  pathname.includes(route.path));
    if (!view){
        setBlogPosts();
        return;
    }

    let id = pathname.split('/');
    
    view.showHtml(id[2]);
}

document.addEventListener('DOMContentLoaded', () => {
    navegateToPage(location.pathname);
});

window.addEventListener('navegateTo', (e)=>{
    navegateToPage(e.detail.pathname);
})

window.onpopstate = (e)=>{
    let pathname = "/";
    if (e.state){
        navegateToPage(e.state.pathname);
    }
    navegateToPage(pathname);
}