module.exports = mongoose => {

    let schema = mongoose.Schema(
        {
            projectId: String,
            status:{
                type: String,
                default: "recieved"
            },
            transformation: {
                type: String,
                default: "upload"
            },
            parentImage: String,
            newFilename: String,
            minimizedImage:
            {
                data: Buffer,
                contentType: String
            }
        },
        { timestamps: true }
    );

    // override toJSON method:
    // mapping _id field as id
    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Image = mongoose.model("image", schema);

    return Image;
};