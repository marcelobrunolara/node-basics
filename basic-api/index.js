import express from "express";
import gradesRouter from "./routes/grades.js";


global.data = "./data/grades.json";

const app = express();
app.use(express.json());
app.use("/grades",gradesRouter);

app.listen(3000, async ()=>{
    try{
        console.log("Api started!");
    }catch(err){
        //console.log(err);
    }
});