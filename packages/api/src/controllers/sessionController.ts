import { Request, Response } from 'express';
import CoachingSession from '../models/CoachingSession';

export const getSessions = async (req: Request, res: Response) => {
  try {
    const { status, coach, student, from, to } = req.query;
    const filter: any = {};

    if (status) filter.status = status;
    if (coach) filter.coach = coach;
    if (student) filter.students = student;
    if (from || to) {
      filter.scheduledAt = {};
      if (from) filter.scheduledAt.$gte = new Date(from as string);
      if (to) filter.scheduledAt.$lte = new Date(to as string);
    }

    const sessions = await CoachingSession.find(filter)
      .populate('coach', 'firstName lastName specialty')
      .populate('students', 'firstName lastName grade')
      .sort({ scheduledAt: -1 });

    res.json({ success: true, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch sessions' });
  }
};

export const getSessionById = async (req: Request, res: Response) => {
  try {
    const session = await CoachingSession.findById(req.params.id)
      .populate('coach', 'firstName lastName specialty email')
      .populate('students', 'firstName lastName grade section email');

    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch session' });
  }
};

export const createSession = async (req: Request, res: Response) => {
  try {
    const session = new CoachingSession(req.body);
    await session.save();

    const populated = await session.populate([
      { path: 'coach', select: 'firstName lastName specialty' },
      { path: 'students', select: 'firstName lastName grade' },
    ]);

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to create session' });
  }
};

export const updateSession = async (req: Request, res: Response) => {
  try {
    const session = await CoachingSession.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('coach', 'firstName lastName specialty')
      .populate('students', 'firstName lastName grade');

    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to update session' });
  }
};

export const completeSession = async (req: Request, res: Response) => {
  try {
    const session = await CoachingSession.findByIdAndUpdate(
      req.params.id,
      {
        status: 'completed',
        completedAt: new Date(),
        notes: req.body.notes,
      },
      { new: true }
    )
      .populate('coach', 'firstName lastName specialty')
      .populate('students', 'firstName lastName grade');

    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to complete session' });
  }
};

export const cancelSession = async (req: Request, res: Response) => {
  try {
    const session = await CoachingSession.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to cancel session' });
  }
};

export const getSessionStats = async (_req: Request, res: Response) => {
  try {
    const [total, scheduled, completed, cancelled] = await Promise.all([
      CoachingSession.countDocuments(),
      CoachingSession.countDocuments({ status: 'scheduled' }),
      CoachingSession.countDocuments({ status: 'completed' }),
      CoachingSession.countDocuments({ status: 'cancelled' }),
    ]);

    const recentSessions = await CoachingSession.find({ status: 'completed' })
      .sort({ completedAt: -1 })
      .limit(5)
      .populate('coach', 'firstName lastName')
      .populate('students', 'firstName lastName');

    res.json({
      success: true,
      data: {
        total,
        scheduled,
        completed,
        cancelled,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        recentSessions,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
};
