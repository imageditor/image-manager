const upload = require("multer")();

module.exports = app => {
    const images = require("../controllers/image.controller.js");
    const processing = require("../controllers/processing.controller.js");

    let router = require("express").Router();

    // Create a new Image
    router.post("/", upload.single('image'), images.create);

    // Retrieve all Images
    router.get("/", images.findAll);

    // Retrieve a single Image with id
    router.get("/:id", images.findOne);

    // Update a Image with id
    router.put("/:id", images.update);

    // Delete a Image with id
    router.delete("/:id", images.delete);

    // Delete all Images
    router.delete("/", images.deleteAll);

    router.post("/transform", images.transform);

    router.post("/updateStatus", images.updateStatus);

    // Grayscale image with id
    // router.post();

    app.use('/api/images', router);
};