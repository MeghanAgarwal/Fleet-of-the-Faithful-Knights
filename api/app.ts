import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import {Database} from "./db/database";
import {AllEndpoints} from "./routes/all-endpoints";

const app = express();
const router = express.Router();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use("/", router);

const db = new Database();

// Initialise all the endpoints
AllEndpoints.initialiseEndpoints(router, db);

app.listen(port, () => console.log(`Listening on port ${port}`));
