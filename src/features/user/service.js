const userHandler = require('./handler');


exports.getUser = async (req, res) => {
    try {
        var userId = req.params.id;
        if(!userId){
             userId = req.user.user_id; 
                
        }
        console.log(userId);
        const response = await userHandler.findUserByID(userId);
        return res.status(201).json({
            userId: response.userId,
            nickName: response.nickName,
            email: response.email,
            friends: response.friends,
            books: response.books,
            movies: response.movies,
            series: response.series,
            advertisements: response.advertisements,
            rates: response.rates,
        });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }

}; 