const express = require("express")
const router = express.Router()
const fs=require('fs');
var ejs=require('ejs');
var db=require('./connection_db');
const { Router } = require("express");
const { ConsoleTransportOptions } = require("winston/lib/winston/transports");
const { parse } = require("path");
db.connect((error)=>{
    if(!!error){
        console.log(error);
    }else{
        console.log('Connected!');
    }
});

router.get('/',(req,res)=>{
     fs.readFile('./views/show.ejs','utf8',(err,data)=>{
        db.query('SELECT * FROM project2.dashboard',(err,results)=>{
            if(err){
                console.log(err);
            }else{
                res.send(ejs.render(data,{
                    data: results
                }));
                };
                    });   
                });
            });
            

router.get("/write",(req,res)=>{
    res.render("./views/write")
});
//글 저장
router.post("/new",(req,res)=>{
    let body=req.body;

        db.query("INSERT INTO project2.dashboard (title,name,content,createdDate,views) VALUES (?,?,?,now(),0)",
        [body.title,body.name,body.content,body.createdDate,body.views],
        ()=>{
            res.redirect("/new")
        });  
    });

router.get('/new',(req,res)=>{
    fs.readFile('./views/show.ejs','utf8',(err,data)=>{
        db.query('SELECT * FROM project2.dashboard',(err,results)=>{
            if(err){
                res.send(err)
            }else{
                res.send(ejs.render(data,{
                    data: results
                }))
            }
        })
    })
});

router.get('/delete/:id',(req,res)=>{
    var id=req.params.id;
    db.query('DELETE FROM project2.dashboard WHERE id=?',[id],(err,results)=>{
       console.log('Deleted Row(s):',results.affectedRows);
        res.redirect('/new');

    })
})

router.get('/edit/:id',(req,res)=>{
    var id=req.params.id;
    fs.readFile('./views/edit.ejs','utf8',(err,data)=>{
     db.query('SELECT * FROM project2.dashboard WHERE id=?',[id],(err,result)=>{
         res.send(ejs.render(data,{
             data: result[0]
         }))       
     })   
    })
});

router.post('/edit/:id',(req,res)=>{
    console.log("수정 진행")
    const body= req.body;
    db.query('UPDATE project2.dashboard SET title=?, name=?,content=? where id=?',[
        body.title,body.name,body.content,req.params.id],()=>{
            res.redirect('/new');
    })
});

//상세페이지

router.get('/detail/:id',(req,res)=>{  
    
   var sql1='SELECT * FROM project2.dashboard where id = ?;'
   var sql2='UPDATE project2.dashboard SET views = views+1 WHERE id = ?;'
       fs.readFile('./views/detail.ejs','utf8',(err,data)=>{
        db.query(sql1+sql2,[req.params.id,req.params.id],(err,results)=>{
                var sql1_result = results[0][0];
                var sql2_result = results[1];
                if(sql2_result.affectedRows>0){
                    res.send(ejs.render(data,{
                        data: sql1_result}))
                }
                })
            })
});


module.exports = router;