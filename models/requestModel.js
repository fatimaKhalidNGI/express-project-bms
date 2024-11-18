module.exports = ( sequelize, DataTypes ) => {
    const Request = sequelize.define("Request", {
        request_id : {
            type : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey : true
        },

        book_title : {
            type : DataTypes.STRING,
            allowNull : false
        },

        book_author : {
            type : DataTypes.STRING,
            allowNull : false
        },

        status : {
            type : DataTypes.STRING,
            allowNull : false
        },

        admin_response : {
            type : DataTypes.STRING,
            allowNull : true
        }
    });

    Request.create = async(user_id, book_title, book_author) => {
        const query = `INSERT INTO requests (book_title, book_author, status, admin_response, user_id) VALUES (:book_title, :book_author, "Pending", NULL, :user_id)`;
        const replacements = { book_title, book_author, user_id };

        try{
            const newRequest = await sequelize.query(query, { replacements });
            return newRequest;

        } catch(error){
            throw new Error("Error in making new request: ", error);
        }
    }

    Request.getAll = async() => {
        const query = `SELECT * FROM requests WHERE status = "Pending"`;

        try{
            const [requestList] = await sequelize.query(query);
            return requestList; 
        } catch(error){
            throw new Error("Error in getting request list: ", error);
        }
    }

    Request.getOwn = async(user_id) => {
        const query = `SELECT * FROM requests WHERE user_id = :user_id`;
        const replacements = { user_id };

        try{
            const [requestList] = await sequelize.query(query, { replacements });
            return requestList; 

        } catch(error){
            throw new Error("Error in getting user's requests list for new books: ", error);
        }
    }

    Request.respond = async(request_id, status, admin_response) => {
        const query = `UPDATE requests SET status = :status, admin_response = :admin_response WHERE request_id = :request_id`;
        const replacements = { status, admin_response, request_id };

        try{
            const [responseNewBook] = await sequelize.query(query, { replacements });
            return responseNewBook;
        } catch(error){
            throw new Error("Error in responding to request: ", error);
        }
    }

    Request.getOne = async(request_id) => {
        const query = `SELECT book_title, book_author FROM requests WHERE request_id = :request_id`;
        const replacements = { request_id };

        try{
            const [bookDetails] = await sequelize.query(query, { replacements });
            return bookDetails;

        } catch(error){
            throw new Error("Error i getting one book: ", error);
        }
    }

    Request.associate = (models) => {
        Request.belongsTo(models.User, {
            foreignKey : 'user_id',
            as : "requested by"
        });
    };

    return Request;
}