import express from "express";

const route = express.Router();
route.use(express.static("content/mario"));
route.get("/", (req, res) => {
    res.sendFile("/content/mario/index.html");
});

export { route };