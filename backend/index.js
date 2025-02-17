require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');  // ✅ Make sure the import is correct

const app = express();
app.use(express.json());
app.use(cors());


app.use('/api/auth', authRoutes);  // ✅ Ensure this line exists

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
