import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        createdAt: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { firstName, lastName, avatar } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        avatar,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { limit = 50, offset = 0 } = req.query;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const explanations = await prisma.explanation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
      skip: Number(offset),
    });

    const total = await prisma.explanation.count({
      where: { userId },
    });

    res.json({
      data: explanations,
      total,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    console.error('Get user history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSavedItems = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const savedItems = await prisma.savedItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        textbook: true,
      },
    });

    res.json(savedItems);
  } catch (error) {
    console.error('Get saved items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const saveItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { type, itemId, textbookId } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const savedItem = await prisma.savedItem.create({
      data: {
        type,
        itemId,
        textbookId,
        userId,
      },
    });

    res.json(savedItem);
  } catch (error) {
    console.error('Save item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const unsaveItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const savedItem = await prisma.savedItem.findUnique({
      where: { id },
    });

    if (savedItem?.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await prisma.savedItem.delete({
      where: { id },
    });

    res.json({ message: 'Item unsaved' });
  } catch (error) {
    console.error('Unsave item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
