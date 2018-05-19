mongoose = require('../config/db');

var bookSchema = new mongoose.Schema({ 
    book_name:        'string', 
    book_description: 'string',
    filename:         'string' 
});

var Book = mongoose.model('Book', bookSchema);

module.exports = Book;