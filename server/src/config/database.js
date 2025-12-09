import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ 
  log: ["error"] 
});

async function connectDatabase() { 
  try { 
    await prisma.$connect(); 
    console.log("Database connected"); 
  } catch (error) { 
    console.error('Failed to connect to database:', error);
    process.exit(1);
  } 
} 

// Graceful shutdown
async function disconnectDatabase() {
  await prisma.$disconnect();
  console.log("Database disconnected");
}

export { prisma, connectDatabase, disconnectDatabase };