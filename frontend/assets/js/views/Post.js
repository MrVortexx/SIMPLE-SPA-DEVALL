import SuperPage from  './SuperPage.js'

export default class extends SuperPage {
    constructor(...args)
    {
        super(...args);
        
        this.page = 0;
        this.posts = [];
        this.postsHtml = [];
    }

    async  navegateToPostContent(openNewTab = false, postId)
    {
        let data;
        try{
            data = await this.makeHttpRequest(this.apiUrl, 'post/clique/'+ postId);
        }catch(e){
            console.log(e);
        }
        console.log(data);

        if (openNewTab) window.open(data.url);
        else window.location.href = data.url;
    }

    async nodesHTMLContainer( blogId, searchByString)
    {   
        let posts, postElements;
        postElements    = [];
        posts           = await this.#getPosts( blogId, searchByString );
    
        if (!posts) return;

        posts.map((post)=> {

            let postElement = `
                <div class="post-content">
                    <div class="post-header">
                        <a href="javascript:;" link-site-about>${post.blog.nome}</a>
                    </div>
                    <div class="post-main">
                        
                        <a class="post-link" href="javascript:;" link-post>
                            <img class="post-img" src="${post.thumbnail || "/static/assets/img/standard-post-img.jpg"}" alt="">
                            <span class ="post-title"> ${post.titulo} </span>
                        </a>
                    </div>
                    <div class="post-footer">
                        <span class="post-info">
                            18/04/2021 18:20 - Cliques: ${post.cliques}
                        </span>
                        <a href="javascript:;" link-post-new-tab>      
                            <img  class="popup-link" src="/static/assets/icons/popup.png" alt="">
                        </a>
                    </div>
                </div>
                `;
                postElement = new DOMParser().parseFromString(postElement, 'text/html').body.childNodes[0];
                postElement.querySelector(['a[link-post]']).addEventListener('click', ()=>{this.navegateToPostContent(false, post.id)});
                postElement.querySelector(['a[link-post-new-tab]']).addEventListener('click', ()=>{this.navegateToPostContent(true, post.id)});
                postElement.querySelector(['a[link-site-about]']).addEventListener('click', ()=>{this.navegateToPage('blog', post.blog.id)});
            
           postElements.push(postElement);
        });

        if (!searchByString) this.page =  this.page + 1;
        
        return postElements;
    }
    async #getPosts(blogId, searchByString){
        let params;
        if (blogId) params =  `post?sort=publicacao&page=${this.page}&blog=${blogId}`
        else if (searchByString){
            this.page = 0;
            params = `post?sort=publicacao&page=${this.page}&search=${searchByString}`
        }
        else params = `post?sort=publicacao&page=${this.page}`;

        let posts = [];
        try{
            posts = await this.makeHttpRequest(this.apiUrl, params);   
        }catch(e){
            console(e);
            return false;
        }
        return posts;
    }
}