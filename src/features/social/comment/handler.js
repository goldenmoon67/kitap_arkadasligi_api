const Comment=require("../../../models/common/comment");
const userHandler=require("../../user/handler");

exports.createComment=async (text,userId,errorMessage)=>{
    const isUserExists=await userHandler.findUserByID(userId);
    if(!isUserExists){
        const error = new Error(errorMessage);
        error.statusCode = 500;
        throw error;
    }
    const response =await Comment.create({text:text,userId:userId,userImageUrl:isUserExists.imageUrl});
    return response;
    
}