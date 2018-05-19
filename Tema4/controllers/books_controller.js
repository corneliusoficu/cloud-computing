const bookService = require('../services/books/books_service');

exports.save_book = function(req, res, next) {

    bookService.uploadNewFileFromFormStream(req)
    .then((book)=>{
        return bookService.uploadBookInformationToDb(book);
    })
    .then((value)=>{
        var response = `{message: Upload succesfull!}`;
        res.send(response);
    })
    .catch( (error) => {
        console.log(error);
        res.send(error);
    });
}

exports.book_list = function(req, res, next) {
    bookService.getAllBooks(req)
    .then((books)=>{
        res.render('index', { title: 'Books', books: books });
    })
    .catch((error)=>{
        res.status(500).send('error');
    });
  };