const db = require("../models");
const Image = db.images;

const lambda = require('./lambda.controller');

// Create and Save a new Image


exports.registerResult = (req, res) => {
    const {
        id = null,
        status = null
    } = req.body;

    if (!id || !status) {
        res.status = 404;
        res.json({
            status: 'id and status fields required in request body',
            payload: {
                id,
                status
            }
        })
    }

    Image.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Image with id=${id}. Maybe Image was not found!`
                });
            } else {
                res.json({ 
                    message: "Image was updated successfully.",
                    data: req.body
                })
            };
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Image with id=" + id
            });
        });
}