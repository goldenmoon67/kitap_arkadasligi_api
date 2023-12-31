const Notification= require("../../models/notification/notification");
const userHandler=require("../user/handler");

exports.createNotification = async (senderUserId,userId,title, notiMessage, notificationType,prodId,errorMessages) => {
    const user = await userHandler.findUserByID(userId);
    if (!user) {
        const error = new Error(errorMessages.forbiddenUser);
        error.statusCode = 500;
        throw error;
    }

    const response = await Notification.create({ 
        title: title,
        message:notiMessage,
        userId:user._id,
        notificationType:notificationType, 
        prodId:prodId, 
        senderUserId:senderUserId,
    });
};
exports.getUserNotification = async (userId, limit,page,forbiddenUserMessage) => {
    const options = {
        page: page || 1,
        limit: limit || Consts.DEFAULT_PAGING_ELEMENT_LIMIT,
    };
    const user = await userHandler.findUserByID(userId);
    if (!user) {
        const error = new Error(forbiddenUserMessage);
        error.statusCode = 500;
        throw error;
    }
    const response = await Notification.paginate({userId:user._id}, options);
    return response;
};