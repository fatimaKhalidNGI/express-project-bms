const jwt = require('jsonwebtoken');

const getTokens = (foundUser) => {

    const accessToken = jwt.sign(
        {
            "UserInfo" : {
                "user_id" : foundUser[0].user_id,
                "role" : foundUser[0].role
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn : '15m'}
    );

    const refreshToken = jwt.sign(
        {
            "UserInfo" : {
                "user_id" : foundUser[0].user_id
            }
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn : '30m' }
    );

    return { accessToken, refreshToken };

}

module.exports = { getTokens };