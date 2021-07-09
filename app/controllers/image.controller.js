const db = require("../models");
const Image = db.images;

// Create and Save a new Image
exports.create = (req, res) => {
    // Validate request
    if (!req.body.parentImage) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    // Create a Image
    const image = new Image({
        projectId: "req.body.projectId",
        parentImage: req.body.parentImage,
        newFilename: "newFilename"///////////////////////////////////////////////////req.body.parentImage,
    });

    // Save Image in the database
    image
        .save(image)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Image."
            });
        });

    // upload image and update record about it

};

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
