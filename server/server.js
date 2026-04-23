import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRouter from './routes/userRoutes.js';
import resumeRouter from './routes/resumeRoutes.js';
import aiRouter from './routes/aiRoutes.js';

dotenv.config({ path: "./.env" });
console.log("ENV CHECK:", process.env.IMAGEKIT_PRIVATE_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('server is running');
});

app.use('/api/users', userRouter);

app.use ('/api/resumes', resumeRouter);

app.use('/api/ai', aiRouter);

// ✅ Wrap async
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
