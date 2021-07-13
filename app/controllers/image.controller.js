const db = require("../models");
const Image = db.images;
const formData = require('form-data');

const lambdaController = require('./lambda.controller');

const { UPLOAD_TYPE } = require("../config/lambda.config");
const { v4: uuidv4 } = require('uuid');
// Create and Save a new Image
exports.create = async (req, res) => {
    const {
        projectId = null
    } = req.body;

    const image = req.file;

    if (!projectId || !image) {
        res.status = 400;
        return res.json({
            status: 'projectId and image required in request body',
            payload: {
                projectId,
                image
            }
        });
    }

    const { buffer: imageBuffer, originalname = null } = image;
    const extension = originalname ? originalname.split('.')[1] : '';
    const newId = `${uuidv4()}.${extension}`;

    const headers = { 
        "Content-Type": "application/octet-stream"
    };

    console.log(image);
    console.log(`controller start()`);

    const result = await lambdaController.request(UPLOAD_TYPE + `/${newId}`, imageBuffer, headers);

    if (result.status != 'error') {
        const image = new Image({
            projectId: projectId,
            newFilename: newId,
            status: 'recieved',
        });
        try {
            const imageData = await image.save()
            res.status = 200;
            res.json({
                status: 'ok',
                payload: imageData
            });
        } catch (err) {
            res.status = 500;
            res.json({
                status: 'error',
                payload: {
                    message: 'Something went wrong when status saving into datebase',
                    data: err
                }
            })
        }
    } else {
        res.status = 500;
        res.json({
            ststus: 'error',
            payload: {
                message: `Something went wrong with starting processor ${processingType}`,
                data: result.payload.data
            }
        });
        throw new Error(result.payload.message);
    }
};

exports.transform = async (req, res) => {
    const {
        id = null,
        projectId = null,
        processingType = null,
    } = req.body;

    if (!id || !projectId || !processingType) {
        res.status = 404;
        res.json({
            status: 'id, projectId and processingType fields required in request body',
            payload: {
                id,
                projectId,
                processingType
            }
        })
    }

    const extension = id.split('.')[1];
    const newId = `${uuidv4()}.${extension}`;

    console.log(`controller start()`);

    const processingParams = {
        projectId,
        id,
        processingType,
        newId
    };

    const result = lambdaController.invoke(processingType, processingParams);

    if (result.status != 'error') {
        const image = new Image({
            projectId: projectId,
            newFilename: newId,
            parentImage: id ?? null,
            status: 'recieved',
            transformation: processingType
        });
        try {
            const imageData = await image.save()
            res.status = 200;
            res.json({
                status: 'ok',
                payload: imageData
            });
        } catch (err) {
            res.status = 500;
            res.json({
                status: 'error',
                payload: {
                    message: 'Something went wrong when status saving into datebase',
                    data: err
                }
            })
        }
    } else {
        res.status = 500,
            res.json({
                ststus: 'error',
                payload: {
                    message: `Something went wrong with starting processor ${processingType}`,
                    data: result.payload.data
                }
            });
        throw new Error(result.payload.message);
    }
}

// Retrieve all Images from the database.
exports.findAll = (req, res) => {
    const projectId = req.query.projectid;
    let condition = projectId ? { projectId: projectId } : {};
    console.log(condition);

    Image.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving images."
            });
        });
};

// Find a single Image with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Image.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Image with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Image with id=" + id });
        });
};

// Update a Image by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    Image.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Image with id=${id}. Maybe Image was not found!`
                });
            } else res.send({ message: "Image was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Image with id=" + id
            });
        });
};

// Delete a Image with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Image.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Image with id=${id}. Maybe Image was not found!`
                });
            } else {
                res.send({
                    message: "Image was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Image with id=" + id
            });
        });
};

// Delete all Images from the Project.
exports.deleteAll = (req, res) => {
    const projectId = req.query.projectId;
    let condition = projectId ? { projectId: projectId } : {};

    Image.deleteMany(condition)
        .then(data => {
            res.send({
                message: `${data.deletedCount} Images were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all images."
            });
        });
};
