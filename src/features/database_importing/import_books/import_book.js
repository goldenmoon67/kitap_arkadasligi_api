const BookHandler = require('../../../features/social/book/handler');
const authorHandler = require('../../../features/social/author/handler');
const csvtojson = require('csvtojson')

// upload excel file and import in mongodb
exports.importCSV2MongoDB = (req, res,next) => {
    importFile('./public' + '/excelUploads/' + req.file.filename);
    function importFile(filePath) {
        //  Read Excel File to Json Data
        csvtojson().fromFile(filePath).then(async source => {
            // Fetching the all data from each row
            for (var i = 0; i < source.length; i++) {
                var categories = [];
                if (source[i]["categories"] != null) {

                    var categoriesStr= source[i]["categories"]
                    const categoriesJSON = JSON.parse(categoriesStr);

                    for (var j = 0; j <categoriesJSON.length; j++) {
                        var item = categoriesJSON[j];
                        if(item!=null){
                            categories.push(item["categories"]);

                        }
                    }

                }
                var authorName = source[i]["yazarname"];
                var authorDesc = source[i]["yazardesc"];
                var authorImageResponse = source[i]["yazarid"];
                var authorImageUrl=authorImageResponse.substring(22)//TODO::burada bi ayristirma olacak
                authorImageUrl=authorImageUrl.substring(0, authorImageUrl.length - 1);
                if(!authorName){
                    continue;
                }
                if(authorImageResponse==""){
                    authorImageUrl=null;
                }
                var author= await authorHandler.createAuthorForDB(authorName,authorImageUrl,authorDesc);
                var singleRow = {
                    name: source[i]["name"],
                    author:author.id,
                    description: source[i]["description"],
                    imageUrl: source[i]["image"],
                    pageCount: source[i]["page_count"],
                    orginalName: source[i]["original_name"],
                    categories: categories,

                };

                await BookHandler.createBookForDBConvert(singleRow, authorName);

            }
            res.status(200).send();
        });
    }
}