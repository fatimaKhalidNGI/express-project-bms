const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getTokens } = require('../utils/getTokens');

const { User } = require('../config/dbConfig');

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

    static userLogin = async(req, res) => {
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).send("Data missing!");
        }

        const foundUser = await User.findUserForLogin(email, password);
        if(!foundUser){
            return res.status(404).send("No user found");
        }

        
        const pwdMatch = await bcrypt.compare(password, foundUser[0].password);
        console.log(pwdMatch);
        
        if(pwdMatch){
            try{
                const { accessToken, refreshToken } = getTokens(foundUser);
                console.log(accessToken, refreshToken);

                const userLoggedIn = await User.loginFunction(foundUser[0].user_id, refreshToken);

                if(userLoggedIn === "Success"){
                    res.cookie('jwt', refreshToken, {
                        httpOnly : true,
                        sameSite : 'None',
                        maxAge : 24 * 60 * 60 * 1000
                    });

                    res.status(200).send(accessToken);
                }

            } catch(error){
                res.status(500).send(error);
            }
        } else {
            return res.status(401).send("Wrong password");
        }
    }

    static userLogout = async(req, res) => {
        const cookies = req.cookies;

        if(!cookies?.jwt){
            return res.status(401).send("Not logged in");
        }

        const refreshToken = cookies.jwt;
        console.log(refreshToken);

        const foundUser = await User.checkUser(refreshToken);

        if(!foundUser){
            res.clearCookie('jwt', {
                httpOnly : true,
                sameSite : 'None',
                secure : true
            });
            return res.status(204).send("Done");
        }

        try{
            const result = await User.logoutFunction(foundUser[0].user_id);
            console.log(result);

            if(result === "Success"){
                res.clearCookie('jwt', {
                    httpOnly : true,
                    sameSite : 'None',
                    secure : true
                });    
                res.status(204).send("Logged out");
            }
        } catch(error){
            res.status(500).send(error);
        }
    }
}

module.exports = AuthController;