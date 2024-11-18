module.exports = ( sequelize, DataTypes ) => {
    const Book = sequelize.define('Book', {
        book_id : {
            type : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey : true
        },
    
        title : {
            type : DataTypes.STRING,
            allowNull : false,
            unique : true
        },
    
        author : {
            type : DataTypes.STRING,
            allowNull : false
        },

        dateBorrowed : {
            type : DataTypes.DATE,
            allowNull : true,
            default : null
        },
    
        returnDate : {
            type : DataTypes.DATE,
            allowNull : true,
            default : null
        }
    });

    //db methods
    Book.addBook = async(title, author) => {
        const query = `INSERT INTO books (title, author) VALUES (:title, :author)`;
        const replacements = {
            title : title,
            author : author
        }

        try{
            
            const book = await sequelize.query(query, { replacements });

            return book;
            
        } catch(error){
            throw new Error("Error in book addition. Error: ", error);
        }
    }

    Book.listBooks = async() => {
        const query = `SELECT title, author FROM books WHERE dateBorrowed IS NULL`;
        try{
            const [booksList] = await sequelize.query(query);
            return booksList;
        } catch(error){
            throw new Error("Error in gwtting books list. Error: ", error);
        }
    }

    Book.updateDetails = async(book_id, updates) => {
        const setClause = Object.keys(updates)
            .map((key) => `${key} = :${key}`)
            .join(", ");

        const values = { ...updates, book_id };

        const query = `UPDATE books SET ${setClause} WHERE book_id = :book_id`;
        
        try{
            const [updated] = await sequelize.query(
                query,
                {replacements : values}
            );

            return updated;
        } catch(error){
            throw new Error("Error in updating book details. Error: ", error);
        }
    }

    Book.removeBook = async(book_id) => {
        const query = `DELETE FROM books WHERE book_id = :book_id`;

        try{
            const removedBook = await sequelize.query(query, {
                replacements : {book_id}
            });

            if(!removedBook){
                return "Not found";
            }

            return "Removed";

        } catch(error){
            throw new Error("Error in removing book. Error: ", error);
        }
    }

    Book.searchByAuthor = async(searchTerm) => {
        const query = `SELECT title, author FROM books WHERE author LIKE :searchTerm AND dateBorrowed IS NULL`;
        
        const values = {
            searchTerm : `%${searchTerm}%`
        }
        
        try{
            const [results] = await sequelize.query(query, {
                replacements : values
            });

            return results;
        } catch(error){
            throw new Error("Error in searching by author. Error: ", error);
        }
    }

    Book.searchByTitle = async(searchTerm) => {
        const query = `SELECT title, author FROM books WHERE title LIKE :searchTerm AND dateBorrowed IS NULL`;
        
        const values = {
            searchTerm : `%${searchTerm}%`
        }
        
        try{
            const [results] = await sequelize.query(query, {
                replacements : values
            });

            return results;
        } catch(error){
            throw new Error("Error in searching by author. Error: ", error);
        }
    }
    
    Book.checkAvailability = async(book_id) => {
        const query =  `SELECT * FROM books WHERE book_id = :book_id`;
        const replacements = { book_id };

        try{
            const [bookforstatus] = await sequelize.query(query, { replacements });
            return bookforstatus;

        } catch(error){
            throw new Error("Error in checking availability of book: ", error);
        }
    }

    Book.borrow = async(book_id, user_id, dateBorrowed, returnDate) => {
        const query = `UPDATE books SET dateBorrowed = :dateBorrowed, returnDate = :returnDate, user_id = :user_id WHERE book_id = :book_id`;
        const replacements = { dateBorrowed, returnDate, user_id, book_id };

        try{
            const [bookBorrowed] = await sequelize.query(query, { replacements });
            return bookBorrowed;

        } catch(error){
            throw new Error("Error in borrowing book: ", error);
        }
    }

    Book.checkBorrow = async(book_id, user_id) => {
        const query = `SELECT * FROM books WHERE book_id = :book_id AND user_id = :user_id`;
        const replacements = { book_id, user_id };

        try{
            const [checkBook] = await sequelize.query(query, { replacements });
            return checkBook;

        } catch(error){
            throw new Error("Error in checking borrowed book: ", error);
        }
    }

    Book.return = async(book_id) => {
        const query = `UPDATE books SET dateBorrowed = NULL, returnDate = NULL, user_id = NULL WHERE book_id = :book_id`;
        const replacements = { book_id };

        try{
            const bookReturned = await sequelize.query(query, { replacements });
            return bookReturned;

        } catch(error){
            throw new Error("Error in returning book: ", error);
        }
    }

    Book.borrowedList = async(user_id) => {
        const query = `SELECT title, author, dateBorrowed, returnDate FROM books WHERE user_id = :user_id`;
        const replacements = { user_id };

        try{
            const [booksBorrowed] = await sequelize.query(query, { replacements });
            return booksBorrowed;

        } catch(error){
            throw new Error("Error in finding borrowed books: ", error);
        }
    }

    Book.associate = (models) => {
        Book.belongsTo(models.User, {
            foreignKey : 'user_id',
            as : "borrowed by"
        });
    };

    return Book;
    
}