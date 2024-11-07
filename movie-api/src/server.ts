import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes";
import movieRoutes from "./routes/movie.routes";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173", // Set origin to port 5173 of Vite with React
    credentials: true
}));

app.use(morgan("dev"));

app.get('/', (req, res) => {
    res.status(201).json('Welcome to API Movies!');
})

app.use("/auth", authRoutes);
app.use("/movie", movieRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
