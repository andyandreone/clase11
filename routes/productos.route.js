const express = require('express')
const router = express.Router()
const fs = require('fs')


router.get("/listar", (req, res) => {

  
try {
  fs.readFile('productos.txt','utf-8',(err, data)=>{
    if(err){
      res.status(404).json({ error: "no hay productos cargados" });
    }else{
      data = data.toString('utf-8')
      data = JSON.parse(data)
      res.status(200).json(data);
    }
    });

  } catch (err) {
    res.status(404).json({ err });
  }
});


router.get("/listar/:id", (req, res) => {
  try {
    fs.readFile('productos.txt','utf-8',(err, data)=>{
      data = data.toString('utf-8')
      data = JSON.parse(data)

      if(req.params.id <= data.length){
        res.status(200).json(data[req.params.id - 1]);
      }else{
        res.status(404).json({ error: "producto no encontrado" });
      }
      });

  } catch (err) {

    res.status(404).json({ err });
  }
});


router.put("/actualizar/:id", (req, res) => {

    try {
         fs.readFile('productos.txt','utf-8',(err, data)=>{
        data = data.toString('utf-8')
        data = JSON.parse(data)

        let id = parseInt(req.params.id)
        data[id - 1] = {
            "id": parseInt(id-1),
            "title": req.query.title,
            "price": parseInt(req.query.price),
            "thumbnail": req.query.thumbnail
        }
        res.status(200).json(data[id - 1])

        fs.promises
                 .writeFile('productos.txt',JSON.stringify(data, null, '\t'))
                 .then(_=>{
                     console.log("actualizado con exito");
                 })
      });
    } catch(err){
        throw new Error(err)
    }
})

router.delete("/borrar/:id", (req, res) => {
  try {
    fs.readFile('productos.txt','utf-8',(err, data)=>{
   data = data.toString('utf-8')
   data = JSON.parse(data)
   let id = parseInt(req.params.id)
   res.json(data[id - 1])
   data.splice( id-1, 1 );
   fs.promises
            .writeFile('productos.txt',JSON.stringify(data, null, '\t'))
            .then(_=>{
                console.log("Eliminado con exito");
            })
 });
} catch(err){
   throw new Error(err)
}
})

router.use(express.json()); 
router.use(express.urlencoded({ extended: true })); 
module.exports = router;
