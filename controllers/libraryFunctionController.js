const { Book } = require('../config/dbConfig');

//borrow book
//return book

class LibraryFunctions {
    static borrowBook = async(req, res) => {
        const { book_id, numDays } = req.body;
        if(!book_id || !numDays){
            return res.status(400).send("Data missing");
        }

        const user_id = req.user_id;

        const bookforstatus = await Book.checkAvailability(book_id);

        if(bookforstatus.length === 0){
            return res.status(404).send("Book not found");
        }

        if(bookforstatus[0].dateBorrowed != null){
            const dateAns = (bookforstatus[0].returnDate).toDateString();
            return res.status(200).send(`Book has already been borrowed. It will be available again on ${dateAns}`);
        }

        let bDate = new Date();

        let rDate = new Date(bDate);
        rDate.setDate(rDate.getDate() + numDays);

        try{
            const bookBorrowed = await Book.borrow(book_id, user_id, bDate, rDate);

            if(bookBorrowed.affectedRows === 0){
                return res.status(404).send("Book not found");
            }

            res.status(200).send("Book borrowed successfully.");

        } catch(error){
            res.status(500).send(error);
        }
    }

    static returnBook = async(req, res) => {
        const user_id = req.user_id;

        const { book_id } = req.body;
        if(!book_id){
            return res.status(400).send("Data missing");
        }

        const checkBook = await Book.checkBorrow(book_id, user_id);
        if(checkBook.length === 0){
            return res.status(404).send("You have not borrowed/already returned this book");
        }

        try{
            const return_today = new Date();

            //test
            // let return_today = new Date();
            // return_today.setDate(return_today.getDate() + 2);

            const daysElapsed = Math.round((return_today - checkBook[0].returnDate) / (1000 * 60 * 60 * 24));
            const return_fine = daysElapsed * 10;

            const bookReturned = await Book.return(book_id);

            if(bookReturned[0].affectedRows === 1 && return_fine > 0){
                res.status(200).send(`Book returned. Late return fine is: ${return_fine}`);
            } else if(bookReturned[0].affectedRows === 1 && return_fine <= 0){
                res.status(200).send("Book returned");
            }

        } catch(error){
            res.status(500).send(error);
        }
    }

    static returnReminder = async(req, res) => {
        const user_id = req.user_id;

        try{
            const booksBorrowed = await Book.borrowedList(user_id);
           
            const today_date = new Date();

            const reminders = booksBorrowed.filter((book) => {
                return (Math.floor((book.returnDate - today_date) / (1000 * 60 * 60 * 24))) === 1;
            });

            if(reminders.length === 0){
                res.status(404).send("You have no books to return within 1 day.");
            }

            res.status(200).send(reminders);

        } catch(error){
            console.log(error);
            res.status(500).send(error);
        }
    }
}

module.exports = LibraryFunctions;