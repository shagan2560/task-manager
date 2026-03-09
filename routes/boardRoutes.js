import express from 'express';
import Board from '../models/boards.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// POST /api/boards — Create board
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;

    const board = await Board.create({
      title,
      description,
      user: req.user._id,
    });

    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/boards — Get user's boards
router.get('/', async (req, res) => {
  try {
    const boards = await Board.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/boards/:id — Get single board
router.get('/:id', async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/boards/:id — Delete board
router.delete('/:id', async (req, res) => {
  try {
    const board = await Board.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    res.json({ message: 'Board deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;