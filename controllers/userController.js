const { User } = require('../config/dbConfig');

class UserController {
    static listAllUsers = async(req, res) => {
        try{
            const users = await User.usersList_all();

            if(users.length === 0){
                return res.status(404).send("No users found");
            }

            res.status(200).send(users);

        } catch(error){
            res.status(500).send(error);
        }
    }

    static listUsers = async(req, res) => {
        try{
            const users = await User.usersList_user();

            if(users.length === 0){
                return res.status(404).send("No users found");
            }

            res.status(200).send(users);

        } catch(error){
            res.status(500).send(error);
        }
    }

    static listAdmins = async(req, res) => {
        try{
            const users = await User.usersList_admin();

            if(users.length === 0){
                return res.status(404).send("No users found");
            }

            res.status(200).send(users);

        } catch(error){
            res.status(500).send(error);
        }
    }

    static updateUserDetails = async(req, res) => {
        const { user_id } = req.params;
        const updates = req.body;
        if(!user_id || !updates){
            return res.status(400).send("Data missing!");
        }

        try{
            const updated = await User.updateDetails(user_id, updates);
            
            if(!updated){
                return res.status(400).send("User not found!");
            }

            res.status(200).send("User updated successfully");

        } catch(error){
            res.status(500).send(error);
        }
    }

    static removeUser = async(req, res) => {
        const { user_id } = req.body;
        if(!user_id){
            return res.status(400).send("Data missing!");
        }

        try{
            const result = await User.remove(user_id);
            
            if(result.affectedRows === 0){
                return res.status(404).send("User not found");
            }

            res.status(200).send("User deleted successfully");
        } catch(error){
            res.status(500).send(error);
        }

    }
}

module.exports = UserController;