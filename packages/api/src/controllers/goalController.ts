import { Request, Response } from 'express';
import Goal from '../models/Goal';

export const getGoals = async (req: Request, res: Response) => {
  try {
    const { student, coach, status } = req.query;
    const filter: any = {};

    if (student) filter.student = student;
    if (coach) filter.coach = coach;
    if (status) filter.status = status;

    const goals = await Goal.find(filter)
      .populate('student', 'firstName lastName grade')
      .populate('coach', 'firstName lastName specialty')
      .sort({ targetDate: 1 });

    res.json({ success: true, data: goals });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch goals' });
  }
};

export const getGoalById = async (req: Request, res: Response) => {
  try {
    const goal = await Goal.findById(req.params.id)
      .populate('student', 'firstName lastName grade section')
      .populate('coach', 'firstName lastName specialty');

    if (!goal) {
      return res.status(404).json({ success: false, error: 'Goal not found' });
    }
    res.json({ success: true, data: goal });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch goal' });
  }
};

export const createGoal = async (req: Request, res: Response) => {
  try {
    const goal = new Goal(req.body);
    await goal.save();

    const populated = await goal.populate([
      { path: 'student', select: 'firstName lastName grade' },
      { path: 'coach', select: 'firstName lastName specialty' },
    ]);

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to create goal' });
  }
};

export const updateGoal = async (req: Request, res: Response) => {
  try {
    const goal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('student', 'firstName lastName grade')
      .populate('coach', 'firstName lastName specialty');

    if (!goal) {
      return res.status(404).json({ success: false, error: 'Goal not found' });
    }
    res.json({ success: true, data: goal });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to update goal' });
  }
};

export const updateGoalProgress = async (req: Request, res: Response) => {
  try {
    const { progress } = req.body;
    const update: any = { progress };

    if (progress >= 100) {
      update.status = 'achieved';
    } else if (progress > 0) {
      update.status = 'in_progress';
    }

    const goal = await Goal.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    })
      .populate('student', 'firstName lastName grade')
      .populate('coach', 'firstName lastName specialty');

    if (!goal) {
      return res.status(404).json({ success: false, error: 'Goal not found' });
    }
    res.json({ success: true, data: goal });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to update progress' });
  }
};

export const toggleMilestone = async (req: Request, res: Response) => {
  try {
    const { milestoneIndex } = req.params;
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ success: false, error: 'Goal not found' });
    }

    const idx = parseInt(milestoneIndex);
    if (idx < 0 || idx >= goal.milestones.length) {
      return res.status(400).json({ success: false, error: 'Invalid milestone index' });
    }

    goal.milestones[idx].completed = !goal.milestones[idx].completed;
    goal.milestones[idx].completedAt = goal.milestones[idx].completed ? new Date() : undefined;

    // Auto-update progress based on milestones
    const completedCount = goal.milestones.filter((m) => m.completed).length;
    goal.progress = Math.round((completedCount / goal.milestones.length) * 100);

    if (goal.progress >= 100) {
      goal.status = 'achieved';
    } else if (goal.progress > 0) {
      goal.status = 'in_progress';
    }

    await goal.save();

    const populated = await goal.populate([
      { path: 'student', select: 'firstName lastName grade' },
      { path: 'coach', select: 'firstName lastName specialty' },
    ]);

    res.json({ success: true, data: populated });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to toggle milestone' });
  }
};

export const deleteGoal = async (req: Request, res: Response) => {
  try {
    const goal = await Goal.findByIdAndDelete(req.params.id);
    if (!goal) {
      return res.status(404).json({ success: false, error: 'Goal not found' });
    }
    res.json({ success: true, message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete goal' });
  }
};
