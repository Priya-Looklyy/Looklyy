const { prisma } = require('../config/prisma');

function mapBrand(brand) {
  return { 
    id: brand.id, 
    name: brand.name, 
    description: brand.description, 
    logoUrl: brand.logoUrl 
  };
}

async function listBrands(req, res, next) {
  try {
    const brands = await prisma.brand.findMany({ orderBy: { name: 'asc' } });
    return res.json({ brands: brands.map(mapBrand) });
  } catch (err) {
    return next(err);
  }
}

async function getBrandById(req, res, next) {
  try {
    const id = req.params.id;
    const brand = await prisma.brand.findUnique({ where: { id } });
    
    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    
    return res.json({ brand: mapBrand(brand) });
  } catch (err) {
    return next(err);
  }
}

async function createBrand(req, res, next) {
  try {
    const { name, description, logoUrl } = req.body || {};
    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }
    const brand = await prisma.brand.create({ data: { name, description, logoUrl } });
    return res.status(201).json({ brand: mapBrand(brand) });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Brand name already exists' });
    }
    return next(err);
  }
}

module.exports = { listBrands, getBrandById, createBrand };


