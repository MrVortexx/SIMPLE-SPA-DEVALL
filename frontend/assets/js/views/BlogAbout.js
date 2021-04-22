import SuperPage from './SuperPage.js';

export default class extends SuperPage{
    #apiBlogUrl = "https://api.devall.com.br/api/v1/blog";
    constructor(params){
        super(params);
        this.params = params;
        this.blogId = params.blogId;
        this.about = [];
    }

    getBlogId(){
        return this.id;
    }
    getPageTitle()
    {
        return this.title;
    }
    async nodesHTMLContainer()
    {
        let data;
        try{
            data = await this.makeHttpRequest(this.#apiBlogUrl, this.blogId);
        }catch(e){
            console.log(e);
        }
        let aboutElement = `
            <div class="blog-about-content"> 
                <span class="blog-about-title">${data.nome} </span>
                <span class="blog-about-description">${data.resumo} </span>

                <div class="blog-about-included-by"> 
                    <b>Incluido por ${data.autor.nome}</b>
                </div>

                <a class="blog-about-link" href= "${data.url}" target="_blank">Conheça o trabalho deles! CLIQUE AQUI</url>
            </div>
        `;
        aboutElement = new DOMParser().parseFromString(aboutElement, 'text/html').body.childNodes[0];
        this.about.push(aboutElement);

        return this.about;
    }
}