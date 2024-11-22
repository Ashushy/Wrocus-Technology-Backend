const server = require('./app')
const dotenv = require('dotenv')
dotenv.config(); // Load environment variables from .env file

const PORT = process.env.PORT || 8004; // Use PORT from env or default to 8000

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
