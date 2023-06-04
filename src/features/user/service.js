const userHandler = require('./handler');

exports.getSessionUser = async (req, res) => {
    try {
        const userId = req.user.user_id; 
        console.log(userId)
        const response = await userHandler.findUserByID(userId);
        return res.status(200).json({ "response": response });

    } catch (error) {
        res.status(400).json({ message: error });
        console.log(error);
    }

}; 

exports.getUser = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log(userId)
        const response = await userHandler.findUserByID(userId);
        return res.status(200).json({ "response": response });

    } catch (error) {
        res.status(400).json({ message: error });
        console.log(error);
    }

}; 