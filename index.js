const express = require('express')
const products = require("./routes/productos.route")
var multer = require('multer');
const fs = require('fs');
//const handlebars = require('express-handlebars')

let storage = multer.diskStorage ({
    destination: function (req, file, callback){
        callback(null, "images")
    },
    filename:function(req, file, callback){
        callback(null, file.originalname)
    }
})

var upload = multer({storage});

let productos = []

class Producto {
    constructor (title, price, thumbnail) {
        this.id = productos.length+1
        this.title = title
        this.price = price
        this.thumbnail = thumbnail
    }
}

const app = express();
app.listen(8080, ()=>{
    console.log('Escuchando en el puerto 8080');
})

app.use('/api/productos', products)
app.use(express.static('public'))


app.post("/guardar", upload.single("myFile"),(req, res, next) => {
    let title = req.body.title
    let price = parseInt(req.body.price)
    let thumbnail = req.file.path
  
            if (!req.file) {
                const error = new Error("Sin archivos")
                error.httpStatusCode = 400
                return next(error)
            }
            producto = new Producto(title, price, thumbnail)
            
            
        if(fs.existsSync('productos.txt')){
            fs.promises.readFile('productos.txt').then(data =>{
                const json = JSON.parse(data.toString('utf-8'));
                 json.push({...producto, id: json.length});
                 fs.promises
                 .writeFile('productos.txt',JSON.stringify(json, null, '\t'))
                 .then(_=>{
                     console.log("agregado con exito");
                 })
             }).catch(err=>{
                console.log(err)
             })
            }else{
                fs.promises.writeFile(('productos.txt'), JSON.stringify([{...producto, id:0}]))
             }
             res.redirect('/');
})

// app.engine(
//     "hbs",
//     handlebars({
//         extname:".hbs",
//         defaultLayout:'index.hbs',
//         layoutsDir: __dirname + "/views/layouts",
//     })
// )

// app.set('view engine', 'hbs');
app.set('view engine', 'pug');
app.set('views','./views');

app.use(express.static('public'));

// app.get('/productos/vista',(req,res)=>{
//     fs.promises.readFile('productos.txt').then(data =>{
//         const products = {
//             items: [{}]
//         }

//         const json = JSON.parse(data.toString('utf-8'));
//         products.items = json
//         res.render('main',products)
//      }).catch(err=>{
//         console.log(err)
//      })
    
// })

app.get('/productos/vista',(req,res)=>{
    fs.promises.readFile('productos.txt').then(data =>{
        const products = {
            items: [{}]
        }

        const json = JSON.parse(data.toString('utf-8'));
        products.items = json
        res.render('index.pug',products)
     }).catch(err=>{
        console.log(err)
     })
    
})