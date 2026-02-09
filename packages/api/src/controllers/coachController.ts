import { Request, Response } from 'express';
import Coach from '../models/Coach';

export const getCoaches = async (_req: Request, res: Response) => {
  try {
    const coaches = await Coach.find({ isActive: true }).sort({ lastName: 1 });
    res.json({ success: true, data: coaches });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch coaches' });
  }
};

export const getCoachById = async (req: Request, res: Response) => {
  try {
    const coach = await Coach.findById(req.params.id);
    if (!coach) {
      return res.status(404).json({ success: false, error: 'Coach not found' });
    }
    res.json({ success: true, data: coach });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch coach' });
  }
};

export const createCoach = async (req: Request, res: Response) => {
  try {
    const coach = new Coach(req.body);
    await coach.save();
    res.status(201).json({ success: true, data: coach });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, error: 'Email already exists' });
    }
    res.status(400).json({ success: false, error: 'Failed to create coach' });
  }
};

export const updateCoach = async (req: Request, res: Response) => {
  try {
    const coach = await Coach.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!coach) {
      return res.status(404).json({ success: false, error: 'Coach not found' });
    }
    res.json({ success: true, data: coach });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to update coach' });
  }
};

export const deleteCoach = async (req: Request, res: Response) => {
  try {
    const coach = await Coach.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!coach) {
      return res.status(404).json({ success: false, error: 'Coach not found' });
    }
    res.json({ success: true, message: 'Coach deactivated' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete coach' });
  }
};
