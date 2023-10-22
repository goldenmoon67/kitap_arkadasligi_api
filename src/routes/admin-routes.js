const express = require('express');
const router = express.Router()

const importBookService=require("../features/database_importing/import_books/import_book");
const multer = require('multer')

var excelStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/excelUploads');    
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

var excelUploads = multer({ storage: excelStorage });

router.post('/uploadExcelFile', excelUploads.single("uploadfile"),importBookService.importCSV2MongoDB);
module.exports = router;
