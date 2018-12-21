import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json('sample');
});

export default router;
