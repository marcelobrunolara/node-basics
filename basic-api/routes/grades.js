import express from "express";
import { promises } from "fs";
import {createGrade} from "../model/grades-model.js";

const { readFile, writeFile } = promises;
const router = express.Router();

router.post("/", async (req, res)=>
{
    try{
        const json = JSON.parse(await readFile(global.data));    

        const gradeRaw = createGrade(req.body);
        const grade = {id: json.nextId++, ...gradeRaw};   
        json.grades.push(grade);
    
        await writeFile(global.data, JSON.stringify(json, null, 2));

        res.send(grade);
    }catch(err){
        res.status(400).send(err.message);
    }
});

router.put("/:id", async (req, res)=>
{
    try{
        const id = parseInt(req.params.id);
        const json = JSON.parse(await readFile(global.data));

        const grade = createGrade(req.body);
        const index = json.grades.findIndex(e=>e.id == id);
        json.grades[index] = {id: id, ...grade};
    
        await writeFile(global.data, JSON.stringify(json, null, 2));

        res.send({id, ...grade});
    }catch(err){
        res.status(400).send(err.message);
    }
});

router.delete("/:id", async (req, res)=>
{
    try{
        const id = parseInt(req.params.id);
        const json = JSON.parse(await readFile(global.data));

        json.grades = json.grades.filter(e=>e.id != id);

        await writeFile(global.data, JSON.stringify(json, null, 2));

        res.send(`id:${id} removed.`);
    }catch(err){
        res.status(400).send(err.message);
    }
});

router.get("/sumOfGrades", async (req, res)=>
{
    try{
        const {student, subject} = req.query;
        const json = JSON.parse(await readFile(global.data));

        const selectedGrades = json.grades.filter(e=>e.student == student)
                                .filter(e=>e.subject == subject);

        const totalValue = selectedGrades.map(c=> c.value).reduce((acc,cur)=>acc+cur);

        res.send(totalValue.toString());
    }catch(err){
        res.status(400).send(err.message);
    }
});


router.get("/averageOfGrades", async (req, res)=>
{
    try{
        const {subject, type} = req.query;
        const json = JSON.parse(await readFile(global.data));

        const selectedGrades = json.grades.filter(e=>e.subject == subject)
                                .filter(e=>e.type == type);

        const averageValue = (selectedGrades.map(c=> c.value).reduce((acc,cur)=>acc+cur))/selectedGrades.length;
        
        res.send(averageValue.toString());
    }catch(err){
        res.status(400).send(err.message);
    }
});

router.get("/topGrades", async (req, res)=>
{
    try{
        const {subject, type} = req.query;
        const json = JSON.parse(await readFile(global.data));

        const selectedGrades = json.grades.filter(e=>e.subject == subject)
                                .filter(e=>e.type == type);

        const topGrades = selectedGrades.sort((a,b)=> b.value - a.value).slice(0,3);
        
        res.send(topGrades);
    }catch(err){
        res.status(400).send(err.message);
    }
});

router.get("/:id", async (req, res)=>
{
    try{
        const id = parseInt(req.params.id);
        const json = JSON.parse(await readFile(global.data));

        const grade = json.grades.find(e=>e.id == id);

        res.send(grade);
    }catch(err){
        res.status(400).send(err.message);
    }
});

export default router;