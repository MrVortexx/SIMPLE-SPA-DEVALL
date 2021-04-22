export default class{
    constructor(info, documentTitle)
    {
        this.documentTitle = documentTitle;
        this.info = info;
        this.apiUrl = "https://api.devall.com.br/api/v1";
    }
    async  makeHttpRequest(url, params)
    {   
        let api = `${url}/${params}`;

        let  data = await fetch (api);

        if (!data.ok) throw 'Failed to load posts';

        return await data.json();
    }
    navegateToPage(route, params)
    {
        const baseUrl = window.location.origin;
        const pathname = `/${route}/${params}`;
        let url = `${baseUrl}${pathname}`;
        history.pushState(pathname,this.getPageTitle(), url);
       
        const event = new CustomEvent('navegateTo',{
            detail: {
                pathname,
            }
        });
        window.dispatchEvent(event);
    }
    getPageTitle()
    {
        return this.documentTitle;
    }
    async nodesHTMLContainer()
    {
        return "";

    }
}