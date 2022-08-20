import express from "express";
import path from "path";

const node_exec_path = path.resolve()
const routePath = path.join(node_exec_path, "content", "mario")

const route = express.Router();
route.use(express.static("content/mario", { index: false }));
route.get("/", (req, res) => {
    const html = path.join(routePath, "index.html");
    res.sendFile(html);
});

export { route };