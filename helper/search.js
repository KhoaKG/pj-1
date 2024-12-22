module.exports = (query)=>{
    let searchObject = {
        keyword: "",
    }
    if(query.keyword){
        searchObject.keyword = query.keyword
        searchObject.regex = new RegExp(searchObject.keyword, "i");
    }

    return searchObject
}