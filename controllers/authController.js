const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../config/dbConfig');
const { hash } = require('crypto');

class AuthController {
    static registerUser = async(req, res) => {
        const { name, email, password, role } = req.body;
        
        if(!name || !email || !role || !password){
            return res.status(400).send("Data missing");
        }

        try{
            //check for duplicate users
            const duplicateUserCheck = await User.checkDuplicateUser(email);

            if(duplicateUserCheck.length > 0){
                return res.status(409).send("User already registered on this email");  
            }

            const hashedPwd = await bcrypt.hash(password, 10);
            const newUser = await User.registerUser(name, email, hashedPwd, role);

            res.status(200).send("User registered successfully");
        } catch(error){
            console.log(error);
            res.status(500).send(error);
        }

    }
}

module.exports = AuthController;