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