const path = require('path');
const storage = require('azure-storage');
const uuidv1 = require('uuid/v1');
var multiparty = require('multiparty');
var Book = require('../../models/book');

const blobService = storage.createBlobService();
const containerName = 'books';

const DOWNLOAD_LINK = 'https://csb4362e957c180x4f25xa0f.blob.core.windows.net/books/'

service = {};

service.uploadBookInformationToDb = function(book) {

    return new Promise((resolve, reject)=>{

        book_information = {
            book_name: book['book-name'], 
            book_description: book['book-description'], 
            filename: book['file_name']
        };

        Book.create(book_information, function(err, small){
            if(err){
                reject("Error when storing user!");
                console.log(err);
            } else {
                resolve();
            }
        });
    });  
}

service.uploadNewFileFromFormStream = function(req) {
    return new Promise((resolve, reject) => {

        book = {}

        if(req.is('multipart/form-data')) {
            var form = new multiparty.Form();

            form.on('part', (part) => {

                if(part.filename) {
                    var name = uuidv1();
                    console.log(part.headers['content-type']);
                    if(part.headers['content-type'] != 'application/pdf'){
                        reject('Filetype not supported!');
                    }
                    name = name + '.pdf';
                    blobService.createBlockBlobFromStream(containerName, name, part, part.byteCount, function(error){
                        if(!error){
                            book["file_name"] = name;
                            resolve(book);
                        } else {
                            reject(error);
                        }
                    });
                } else {
                    part.resume();
                }
            });

            form.on('field',(name,value) => {
                book[name] = value;
            });

            form.on('error', function(err){
                console.log(err);
                reject(err);
            });

            form.parse(req);
        } else {
            reject('Unsuported content type!');
        }
    });
}

service.getAllBooks = function(req) {
    return new Promise((resolve,reject)=>{       
        Book.find({},function(err, books){
            if(err){
                reject(err);
            } else {
                books.map(x => x.filename = DOWNLOAD_LINK + x.filename);
                resolve(books);
            }
        });
    });
}

module.exports = service;