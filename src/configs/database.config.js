import { Sequelize } from "sequelize";
import { configDotenv } from "dotenv";

configDotenv();

// Database credentials
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST, // Change to your database host
    dialect: "mysql", // Change to 'postgres', 'sqlite', 'mssql' as needed
    logging: false, // Set to 'console.log' for debugging
  },
);

// Test the connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
};

connectDB();

export default sequelize;
