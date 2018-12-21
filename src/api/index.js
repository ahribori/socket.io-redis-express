import express from 'express';
import cors from 'cors';
const router = express.Router();

import sample from './sample';

router.get('/', (req, res) => {
  res.json('Express');
});

router.post('/', (req, res) => {
  console.log(req.body);
  res.json('Express');
});

router.use('/api', cors());
router.use('/api/sample', sample);

export default router;
