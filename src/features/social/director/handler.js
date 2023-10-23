const Director = require("../../../models/common/director");
const Consts = require("../../../consts/consts");

exports.createDirector = async (DirectorObject) => {
    const isExisting = await this.findByName(DirectorObject.fullName);

    if (isExisting) {
        const error = new Error(req.t("already-exists"));
        error.statusCode = 500;
        throw error;
    }
    const response = await Director.create(DirectorObject);
    return response;
};

exports.findByName = async (fullName) => {
    const director = await Director.findOne({
        fullName,
    });
    return director;
};

exports.findById = async (_id) => {

    const director = await Director.findOne({
        _id,
    });

    return director;
};

exports.getDirectors = async (limit, page) => {
    const options = {
        page: page || 1,
        limit: limit || Consts.DEFAULT_PAGING_ELEMENT_LIMIT,
    };

    const response = await Director.paginate({}, options);
    return response;
};
