
const { prisma } = require('../config/prisma');

function mapLookboard(lookboard) {
  return {
    id: lookboard.id,
    title: lookboard.title,
    images: lookboard.images || [],
    userId: lookboard.userId,
    createdAt: lookboard.createdAt,
  };
}

async function listMyLookboards(req, res, next) {
  try {
    const lookboards = await prisma.lookboard.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ lookboards: lookboards.map(mapLookboard) });
  } catch (err) {
    return next(err);
  }
}

async function createLookboard(req, res, next) {
  try {
    const { title, images } = req.body || {};
    if (!title) {
      return res.status(400).json({ error: 'Missing title' });
    }
    const lookboard = await prisma.lookboard.create({
      data: { 
        title, 
        images: images || [], 
        userId: req.user.id 
      },
    });
    return res.status(201).json({ lookboard: mapLookboard(lookboard) });
  } catch (err) {
    return next(err);
  }
}

async function getLookboardById(req, res, next) {
  try {
    const id = req.params.id;
    const lookboard = await prisma.lookboard.findUnique({
      where: { id },
    });
    if (!lookboard || lookboard.userId !== req.user.id) {
      return res.status(404).json({ error: 'Lookboard not found' });
    }
    return res.json({ lookboard: mapLookboard(lookboard) });
  } catch (err) {
    return next(err);
  }
}

async function updateLookboard(req, res, next) {
  try {
    const id = req.params.id;
    const { title, images } = req.body || {};

    const lookboard = await prisma.lookboard.findUnique({ where: { id } });
    if (!lookboard || lookboard.userId !== req.user.id) {
      return res.status(404).json({ error: 'Lookboard not found' });
    }

    const updated = await prisma.lookboard.update({
      where: { id },
      data: { 
        title: title || lookboard.title,
        images: images || lookboard.images
      },
    });
    return res.json({ lookboard: mapLookboard(updated) });
  } catch (err) {
    return next(err);
  }
}

async function deleteLookboard(req, res, next) {
  try {
    const id = req.params.id;
    const lookboard = await prisma.lookboard.findUnique({ where: { id } });
    if (!lookboard || lookboard.userId !== req.user.id) {
      return res.status(404).json({ error: 'Lookboard not found' });
    }

    await prisma.lookboard.delete({ where: { id } });
    return res.json({ message: 'Lookboard deleted successfully' });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listMyLookboards,
  createLookboard,
  getLookboardById,
  updateLookboard,
  deleteLookboard,
};


