import express, { json } from 'express';
import morgan from 'morgan';
import {myLogger} from './middlewares/isLogged.js';
import {requestTime} from './middlewares/requestTme.js'
import {errorHandler} from './middlewares/error.handler.js'


const app = express();
const port = 3000;

app.use(morgan('dev'));
app.use(express(json));
app.use(myLogger);
app.use(requestTime)
app.use(errorHandler);


app.get('/', (req,res)=> {
    res.send('Hello World!')
});
app.get('/app',(req,res)=> {
   
     let reponseText = 'Hello World!<br>'
    reponseText += `<small>Requested at: ${req.requestTime}</small>`
    res.send(reponseText)
})

app.get('/api/users')


app.get('/my/app',(req,res,next)=> {
    try {
         let reponseText = 'Hello World!<br>';
    reponseText += `<small>Requested at: ${req.requestTime}</small>`;

     if (!req.requestTime) {
      throw new Error('Request time not found');
    }

    res.send(reponseText);

        
    } catch (err) {
        next(err)
        
    }
   

});





app.listen(port, ()=> {
    console.log(`App listening on Port ${port}`)
});
