import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

interface ReviewRequest {
    rating: number;
    comment: string;
    placeName: string;  // Added placeName here
    userId: number;
    photo?: string;
}

interface UserRequest {
    name: string;
    email: string;
}

const server = Fastify({
    logger: true
});

// Configure CORS
server.register(require('@fastify/cors'), {
    origin: true, // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
});

// Home route
server.get('/', async (request, reply) => {
    reply.type('text/html').send(`
        <html>
            <head>
                <title>Bathroom Review API</title>
            </head>
            <body>
                <h1>Welcome to the Bathroom Review API</h1>
                <p>Use /api/review to submit reviews and /api/user to create users.</p>
            </body>
        </html>
    `);
});

// User creation route
server.post<{ Body: UserRequest }>('/api/user', async (request, reply) => {
    const { name, email } = request.body;
    try {
        const user = await prisma.user.create({
            data: { name, email }
        });
        reply.status(201).send(user);
    } catch (error) {
        console.error('Error creating user:', error);
        reply.status(500).send({ error: 'Unable to create user' });
    }
});

// Review creation route
server.post<{ Body: ReviewRequest }>('/api/review', async (request, reply) => {
    const { rating, comment, placeName, userId, photo } = request.body;  // placeName included here
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return reply.status(404).send({ error: 'User not found' });
        }

        const review = await prisma.review.create({
            data: {
                rating,
                comment,
                placeName,  // placeName included here
                userId,
                photo,
            },
            include: {
                user: true,
            },
        });
        reply.status(200).send(review);
    } catch (error) {
        console.error('Error creating review:', error);
        reply.status(500).send({ error: 'Unable to create review' });
    }
});

// Fetch reviews route
server.get('/api/reviews', async (request, reply) => {
    try {
        const reviews = await prisma.review.findMany({
            include: { user: true },
            orderBy: { createdAt: 'desc' },
            take: 10 // Limit to 10 reviews per request, you can adjust this
        });
        reply.send(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        reply.status(500).send({ error: 'Unable to fetch reviews' });
    }
});

const start = async () => {
    try {
        const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
        await server.listen({ port, host: '0.0.0.0' });
        console.log(`Server is running on http://localhost:${port}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
