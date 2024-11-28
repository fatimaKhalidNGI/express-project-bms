const { Book } = require('../config/dbConfig');
const { Request } = require('../config/dbConfig');

class RequestNewBooks {
    static makeBookRequest = async(req, res) => {
        const user_id = req.user_id;
        const { book_title, book_author } = req.body;

        if(!book_title || !book_author){
            return res.status(400).send("Data missing");
        }

        try{
            const newRequest = await Request.create(user_id, book_title, book_author);
            console.log(newRequest);

            res.status(200).send("New request filed");

        } catch(error){
            res.status(500).send(error);
        }
    }

    static getRequestList_admin = async(req, res) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        try{
            const { requestList, total } = await Request.getAll(page, limit);

            if(requestList.length === 0){
                return res.status(404).send("No new requests found");
            }

            const response = {
                requestList,
                page,
                total,
                totalPages : Math.ceil(total / limit)
            };

            res.status(200).send(response);

        } catch(error){
            console.log(error);
            res.status(500).send(error);
        }

    }

    static getOwnRequests = async(req, res) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const user_id = req.user_id;

        try{
            const { requestList, total } = await Request.getOwn(user_id, page, limit);

            if(requestList.length === 0){
                return res.status(404).send("No requests have been filed by you");
            }

            const response = {
                requestList,
                page,
                total,
                totalPages : Math.ceil(total / limit)
            };

            res.status(200).send(response);
        } catch(error){
            console.log(error);
            res.status(500).send(error);
        }
    }

    static respondAdmin = async(req, res) => {
        const { request_id, status, admin_response } = req.body;

        if(!request_id || !status || !admin_response){
            return res.status(400).send("Data missing!");
        }

        try{
            const responseNewBook = await Request.respond(request_id, status, admin_response );

            if(responseNewBook.affectedRows === 0){
                return res.status(404).send("Request not found");
            }

            const bookDetails = await Request.getOne(request_id);

            if(bookDetails.length === 0){
                return res.status(404).send("Book not found");
            }

            console.log(bookDetails);

            const newBook = await Book.addBook(bookDetails[0].book_title, bookDetails[0].book_author);

            res.status(200).send("Book added successfully");

        } catch(error){
            console.log(error);
            res.status(500).send(error);
        }

    }
}

module.exports = RequestNewBooks;