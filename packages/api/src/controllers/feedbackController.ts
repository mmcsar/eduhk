import { Request, Response } from 'express';
import Feedback from '../models/Feedback';

export const getFeedback = async (req: Request, res: Response) => {
  try {
    const { student, session, coach } = req.query;
    const filter: any = {};

    if (student) filter.student = student;
    if (session) filter.session = session;
    if (coach) filter.coach = coach;

    const feedback = await Feedback.find(filter)
      .populate('session', 'title scheduledAt subject')
      .populate('coach', 'firstName lastName')
      .populate('student', 'firstName lastName grade')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch feedback' });
  }
};

export const getFeedbackById = async (req: Request, res: Response) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('session', 'title scheduledAt subject type')
      .populate('coach', 'firstName lastName specialty')
      .populate('student', 'firstName lastName grade section');

    if (!feedback) {
      return res.status(404).json({ success: false, error: 'Feedback not found' });
    }
    res.json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch feedback' });
  }
};

export const createFeedback = async (req: Request, res: Response) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();

    const populated = await feedback.populate([
      { path: 'session', select: 'title scheduledAt subject' },
      { path: 'coach', select: 'firstName lastName' },
      { path: 'student', select: 'firstName lastName grade' },
    ]);

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to create feedback' });
  }
};

export const updateFeedback = async (req: Request, res: Response) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('session', 'title scheduledAt subject')
      .populate('coach', 'firstName lastName')
      .populate('student', 'firstName lastName grade');

    if (!feedback) {
      return res.status(404).json({ success: false, error: 'Feedback not found' });
    }
    res.json({ success: true, data: feedback });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to update feedback' });
  }
};

export const deleteFeedback = async (req: Request, res: Response) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, error: 'Feedback not found' });
    }
    res.json({ success: true, message: 'Feedback deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete feedback' });
  }
};

export const getStudentFeedbackSummary = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    const feedback = await Feedback.find({ student: studentId });

    if (feedback.length === 0) {
      return res.json({
        success: true,
        data: { totalFeedback: 0, averageRating: 0, strengths: [], areasForImprovement: [] },
      });
    }

    const averageRating =
      feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length;

    const strengthsMap = new Map<string, number>();
    const improvementMap = new Map<string, number>();

    feedback.forEach((f) => {
      f.strengths.forEach((s) => strengthsMap.set(s, (strengthsMap.get(s) || 0) + 1));
      f.areasForImprovement.forEach((a) =>
        improvementMap.set(a, (improvementMap.get(a) || 0) + 1)
      );
    });

    const topStrengths = [...strengthsMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    const topImprovements = [...improvementMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    res.json({
      success: true,
      data: {
        totalFeedback: feedback.length,
        averageRating: Math.round(averageRating * 10) / 10,
        strengths: topStrengths,
        areasForImprovement: topImprovements,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch summary' });
  }
};
