import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import productRouter from './routes/productRoute.js';
import http from 'http'; // Import http module


// App Config
const app = express();
const port = process.env.PORT || 4000;
const server = http.createServer(app); // Create an HTTP server


connectDB();
connectCloudinary();

// middlewares
app.use(express.json());
app.use(cors());

// api endpoints
app.use('/api/product', productRouter);


//message rout
app.get('/', (req, res) => {
    res.send("API Working");
});

// Start the server
server.listen(port, () => console.log('Server started on PORT: ' + port));
