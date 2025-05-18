import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'developement' ? ["info", "warn", "error"] : "error"
})

async function connectDatabase() {
    try {
        await prisma.$connect();
        console.log("Database connected");
    } catch (error) {
        console.error('Failed to connect to database:', error);
    }
}

export  {prisma, connectDatabase}
