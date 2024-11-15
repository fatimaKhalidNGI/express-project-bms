module.exports = ( sequelize, DataTypes ) => {
    const User = sequelize.define('User', {
        user_id : {
            type : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey : true
        },
        name : {
            type : DataTypes.STRING,
            allowNull : false
        },
    
        email : {
            type : DataTypes.STRING,
            allowNull : false,
            //unique : true
        },
    
        password : {
            type : DataTypes.STRING,
            allowNull : false
        },
    
        role : {
            type : DataTypes.STRING,
            allowNull : false
        },

        refresh_token : {
            type : DataTypes.STRING,
            allowNull : true
        }
    });

    User.checkDuplicateUser = async(email) => {
        const query = `SELECT * FROM users WHERE email = :email`;
        const replacements = { email };
        try{
            const [duplicateUser] = await sequelize.query(query, { replacements });
            return duplicateUser;
        } catch(error){
            throw new Error("Error in checking duplicate users. Error: ", error);
        }
    }

    User.registerUser = async(name, email, password, role) => {
        const query = `INSERT INTO users (name, email, password, role) VALUES (:name, :email, :password, :role)`;
        const replacements = {
            name : name,
            email : email,
            password : password,
            role : role,
            // createdAt: new Date(),
            // updatedAt : new Date()
        };

        try{
            const [newUser] = await sequelize.query(query, { replacements });
            return newUser;

        } catch(error){
            throw new Error("Error in registering new user. Error: ", error.message);
        }
    }

    User.findUserForLogin = async(email, password) => {
        const query = `SELECT * FROM users WHERE email = :email`;
        const replacements = { email : email };

        const [foundUser] = await sequelize.query(query, { replacements });

        return foundUser;
    }

    User.loginFunction = async(user_id, refreshToken) => {
        const query = `UPDATE users SET refresh_token = :refreshToken WHERE user_id = :user_id`;
        const replacements = { 
            refreshToken : refreshToken,
            user_id : user_id
        };

        try{
            const userLoggedIn = await sequelize.query(query, { replacements });
            console.log("userLoggedIn: ", userLoggedIn)
            return "Success";

        } catch(error){
            throw new Error("Error in loggin user in: ", error);
        }
    }

    User.checkUser = async(refreshToken) => {
        const query = `SELECT * FROM users WHERE refresh_token = :refreshToken`;
        const replacements = {
            refreshToken : refreshToken
        };

        try{
            const [ foundUser ] = await sequelize.query(query, { replacements });
            return foundUser;

        } catch(error){
            throw new Error(`Error in checking user for logout: ${error.message}`);
        }
    }

    User.logoutFunction = async(user_id) => {
        const query = `UPDATE users SET refresh_token = NULL WHERE user_id = :user_id`;
        const replacements = {
            user_id : user_id
        };

        try{
            const result = await sequelize.query(query, { replacements });
            return "Success";

        } catch(error){
            throw new Error("Error in logging out: ", error);
        }
    }
        
    User.associate = (models) => {
        User.hasMany(models.Book, {
            foreignKey : 'user_id',
            as : "books"
        });
        
        User.hasMany(models.Request, {
            foreignKey : 'user_id',
            as : "book requests"
        });
    };

    return User;
}