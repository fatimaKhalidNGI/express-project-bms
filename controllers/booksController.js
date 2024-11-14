const { Book } = require('../config/dbConfig');

class BookController {
    static addNewBook = async(req, res) => {
        const { title, author } = req.body;
        if(!title || !author){
            return res.status(400).send("Data missing");
        }

        try{
            const book = await Book.addBook(title, author);
            res.status(200).send("Book added successfully");
            
        } catch(error){
            res.status(500).send(error);
        }
    }

    static listOfBooks = async(req, res) => {
        try{
            const booksList = await Book.listBooks();
            res.status(200).send(booksList);
    
        } catch(error){
            res.status(500).send(error);
        }
    }

    static updateBook = async(req, res) => {
        const { book_id } = req.params;
        const updates = req.body;
        if(!book_id || !updates){
            return res.status(400).send("Data missing!");
        }

        try{
            const updated = await Book.updateDetails(book_id, updates);
            
            if(!updated){
                return res.status(400).send("Book not found!");
            }

            res.status(200).send("Book updated successfully");

        } catch(error){
            res.status(500).send(error);
        }
    }

    static removeBook = async(req, res) => {
        const { book_id } = req.body;
        if(!book_id){
            return res.status(400).send("Book ID missing");
        }

        try{
            const removedBook = await Book.removeBook(book_id);

            if(removedBook === "Not found"){
                return res.status(404).send("Book not found");
            }

            res.status(200).send("Book removed from list successfully!");
            
        } catch(error){
            console.log(error);
            res.status(500).send(error);
        }
    }

    static searchByAuthor = async(req, res) => {
        const { searchTerm } = req.body;
        if(!searchTerm){
            return res.status(400).send("Data missing!");
        }

        try{
            const results = await Book.searchByAuthor(searchTerm);

            if(results.length === 0){
                return res.status(404).send("Book not found");
            }

            res.status(200).send(results);

        } catch(error){
            console.log(error);
            res.status(500).send(error);
        }
    }

    static searchByTitle = async(req, res) => {
        const { searchTerm } = req.body;
        if(!searchTerm){
            return res.status(400).send("Data missing!");
        }

        try{
            const results = await Book.searchByTitle(searchTerm);

            if(results.length === 0){
                return res.status(404).send("Book not found");
            }

            res.status(200).send(results);

        } catch(error){
            console.log(error);
            res.status(500).send(error);
        } 
    }
}

module.exports = BookController;