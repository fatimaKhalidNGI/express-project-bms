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
            unique : true
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