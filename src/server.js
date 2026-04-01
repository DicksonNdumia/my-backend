import express, { json } from 'express';
import morgan from 'morgan';
import {myLogger} from './middlewares/isLogged.js';
import {requestTime} from './middlewares/requestTme.js'
import {errorHandler} from './middlewares/error.handler.js'
import pool from './config/db.config.js';
import AuthRoutes from './routes/auth.routes.js'


const app = express();
const port = 3000;

app.use(express.json());
app.use(morgan('dev'));

app.use(myLogger);
app.use(requestTime)

app.use('/api/v1/auth',AuthRoutes);



app.use(errorHandler);







pool.connect()
.then(()=> console.log('Db Connected'))
.catch(err=> console.error('connection error',err))




app.listen(port, ()=> {
    console.log(`App listening on Port ${port}`)
});
