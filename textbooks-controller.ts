import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const getTextbooks = async (req: Request, res: Response) => {
  try {
    const { countryId, gradeId, subjectId } = req.query;

    let where: any = {};

    if (countryId) where.countryId = countryId;
    if (gradeId) where.gradeId = gradeId;
    if (subjectId) where.subjectId = subjectId;

    const textbooks = await prisma.textbook.findMany({
      where,
      include: {
        country: true,
        grade: true,
        subject: true,
      },
    });

    res.json(textbooks);
  } catch (error) {
    console.error('Get textbooks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTextbookById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const textbook = await prisma.textbook.findUnique({
      where: { id },
      include: {
        chapters: true,
        country: true,
        grade: true,
        subject: true,
      },
    });

    if (!textbook) {
      return res.status(404).json({ error: 'Textbook not found' });
    }

    res.json(textbook);
  } catch (error) {
    console.error('Get textbook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSubjects = async (req: Request, res: Response) => {
  try {
    const { countryId, gradeId } = req.query;

    let where: any = {};

    if (countryId) where.countryId = countryId;
    if (gradeId) where.gradeId = gradeId;

    const subjects = await prisma.subject.findMany({
      where,
      include: {
        grade: true,
        country: true,
      },
    });

    res.json(subjects);
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTopics = async (req: Request, res: Response) => {
  try {
    const { subjectId } = req.query;

    if (!subjectId) {
      return res.status(400).json({ error: 'Subject ID is required' });
    }

    const topics = await prisma.topic.findMany({
      where: { subjectId: subjectId as string },
      orderBy: { order: 'asc' },
    });

    res.json(topics);
  } catch (error) {
    console.error('Get topics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCountries = async (req: Request, res: Response) => {
  try {
    const countries = await prisma.country.findMany();
    res.json(countries);
  } catch (error) {
    console.error('Get countries error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getGrades = async (req: Request, res: Response) => {
  try {
    const grades = await prisma.grade.findMany({
      orderBy: { level: 'asc' },
    });
    res.json(grades);
  } catch (error) {
    console.error('Get grades error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
