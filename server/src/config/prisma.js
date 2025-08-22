const { PrismaClient } = require('@prisma/client');

let prismaClientInstance;

function getPrismaClient() {
  if (!prismaClientInstance) {
    prismaClientInstance = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  return prismaClientInstance;
}

// Initialize the client
const prisma = getPrismaClient();

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = { prisma };


