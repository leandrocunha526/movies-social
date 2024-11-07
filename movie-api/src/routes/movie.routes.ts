import { Router } from "express";
import * as movieController from "../controllers/movie.controller";
import { authMiddleware } from "../middleware/authMiddleware";
import { uploadCoverImage } from "../controllers/movie.controller";
import express from "express";
import path from "path";

const router = Router();

// Rotas para filmes
router.post("/create", authMiddleware, uploadCoverImage, movieController.createMovie);
router.get("/list", authMiddleware, movieController.listMovies);
router.put("/:id", authMiddleware, uploadCoverImage, movieController.updateMovie);
router.delete("/:id", authMiddleware, movieController.deleteMovie);
router.get("/recommend", authMiddleware, movieController.recommendMovies);
router.get("/:id", authMiddleware, movieController.getMovieDetails);
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rotas para avaliações
router.post("/:movieId/reviews", authMiddleware, movieController.createReview);
router.get("/:movieId/reviews", authMiddleware, movieController.listReviews);
router.put("/reviews/:id", authMiddleware, movieController.updateReview);
router.delete("/reviews/:id", authMiddleware, movieController.deleteReview);

export default router;
