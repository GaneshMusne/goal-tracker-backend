const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require('node-cron'); // Import node-cron
const axios = require('axios'); // Import axios

const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://goal-tracker-admin:admin1234@cluster0.4r6maew.mongodb.net/Goals', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const GoalSchema = new mongoose.Schema({
  date: { type: String, unique: true },
});

const Goal = mongoose.model('Goal', GoalSchema);

app.post('/api/goals', async (req, res) => {
  try {
    const { date } = req.body;
    const goal = new Goal({ date });
    await goal.save();
    res.status(201).send(goal);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/goals', async (req, res) => {
  try {
    const goals = await Goal.find({});
    res.status(200).send(goals);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Schedule a cron job to run every minute
cron.schedule('* * * * *', async () => {
  try {
    const response = await axios.get('https://goal-tracker-backend-qvge.onrender.com/api/goals');
    console.log('API called successfully:', response.data);
    
    // Optionally, you can save the response to your database
    // Example: Save the current timestamp to the database as a goal
    const currentDate = new Date().toISOString();
    const goal = new Goal({ date: currentDate });
    await goal.save();
  } catch (error) {
    console.error('Error calling API:', error);
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
