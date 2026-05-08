import { PrismaClient } from '@prisma/client';
import { OpenAI } from 'openai';
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const explainTopic = async (req: AuthRequest, res: Response) => {
  try {
    const { topicId, additionalContext } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!topicId) {
      return res.status(400).json({ error: 'Topic ID is required' });
    }

    // Получить информацию о теме
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: {
        subject: {
          include: {
            grade: true,
          },
        },
      },
    });

    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    const prompt = `
    Объясни следующую тему простыми словами для ученика класса ${topic.subject.grade.level}.
    
    Предмет: ${topic.subject.name}
    Тема: ${topic.title}
    Описание темы: ${topic.description || 'Нет описания'}
    ${additionalContext ? `Дополнительный контекст: ${additionalContext}` : ''}
    
    Объяснение должно быть:
    - Понятным для школьника
    - С практическими примерами
    - Структурированным
    - На русском языке
    `;

    const message = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const answer = message.choices[0].message.content || '';
    const tokensUsed = message.usage?.total_tokens || 0;

    // Сохранить объяснение в БД
    const explanation = await prisma.explanation.create({
      data: {
        topicId,
        question: `Объясни тему: ${topic.title}`,
        answer,
        tokens_used: tokensUsed,
        userId,
      },
    });

    res.json({
      id: explanation.id,
      question: explanation.question,
      answer: explanation.answer,
      tokens_used: tokensUsed,
    });
  } catch (error) {
    console.error('Explain topic error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const solveProblem = async (req: AuthRequest, res: Response) => {
  try {
    const { description, imageUrl, schoolExplanation } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!description && !imageUrl) {
      return res.status(400).json({ error: 'Description or image is required' });
    }

    let prompt = `
    Реши задачу:
    ${description ? `Описание: ${description}` : ''}
    ${schoolExplanation ? `Как объясняли в школе: ${schoolExplanation}` : ''}
    
    Решение должно быть:
    - Пошаговым
    - С объяснением каждого шага
    - Ясным и понятным
    - На русском языке
    `;

    if (imageUrl) {
      prompt += `\nИзображение задачи: [фото с задачей]`;
    }

    const messages: any[] = [
      {
        role: 'user',
        content: imageUrl
          ? [
              {
                type: 'text',
                text: prompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                },
              },
            ]
          : prompt,
      },
    ];

    const message = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    });

    const answer = message.choices[0].message.content || '';
    const tokensUsed = message.usage?.total_tokens || 0;

    // Сохранить объяснение в БД
    const explanation = await prisma.explanation.create({
      data: {
        question: description || 'Задача с фото',
        answer,
        tokens_used: tokensUsed,
        userId,
      },
    });

    res.json({
      id: explanation.id,
      question: explanation.question,
      answer: explanation.answer,
      tokens_used: tokensUsed,
    });
  } catch (error) {
    console.error('Solve problem error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const explanations = await prisma.explanation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json(explanations);
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
