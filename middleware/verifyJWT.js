const jwt = require('jsonwebtoken');

const verifyJWT = async(req, res, next) => {
    const authHeader = req.headers['authorization'];
    if(!authHeader?.startsWith('Bearer ')){
        return res.status(401);
    }

    const token = authHeader.split(' ')[1];
    
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err){
                return res.status(403).send("Invalid token");
            }

            console.log("inside jwt verify");
            
            req.user_id = decoded.UserInfo.user_id;
            req.role = decoded.UserInfo.role;

            next();
        }

    )
}

const authAdmin = (req, res, next) => {
    if(req.role !== "Admin"){
        return res.status(403).send("Unauthorized");
    }

    next();
}

const authUser = (req, res, next) => {
    if(req.role !== "User"){
        return res.status(403).send("Unauthorized");
    }

    next();
}


module.exports = { verifyJWT, authAdmin, authUser};