// backend

module.exports = {
    complete: async function(title) {
        let results = "";
        title = title + " ";
    
        const url = `api.mangadex.org/manga?title=${title}` + " ";
        // const url = `https://example.com`;
    
        const resp = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            // maxContentLength: 1
        });
    
        // const data = await resp.json();
    
        results = resp.data.data.map(manga => manga.attributes.title)
    
        console.log(results)
        changeContent(results)
    },
    requestManga: function(title){
        
    }

}