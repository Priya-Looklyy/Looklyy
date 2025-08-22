const { prisma } = require('../config/prisma');

function mapProduct(product) {
  return {
    id: product.id,
    brandId: product.brandId,
    name: product.name,
    description: product.description,
    price: product.price,
    imageUrl: product.imageUrl,
    colors: product.colors || [],
    brand: product.brand ? {
      id: product.brand.id,
      name: product.brand.name,
      logoUrl: product.brand.logoUrl
    } : null
  };
}

async function listProducts(req, res, next) {
  try {
    const { brandId, color } = req.query;
    let where = {};
    
    if (brandId) {
      where.brandId = brandId;
    }
    
    if (color) {
                    where.colors = {
                has: color
              };
    }
    
    const products = await prisma.product.findMany({
      where,
      include: { brand: true },
      orderBy: { name: 'asc' }
    });
    return res.json({ products: products.map(mapProduct) });
  } catch (err) {
    return next(err);
  }
}

async function getProductById(req, res, next) {
  try {
    const id = req.params.id;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { brand: true }
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    return res.json({ product: mapProduct(product) });
  } catch (err) {
    return next(err);
  }
}

async function createProduct(req, res, next) {
  try {
    const { brandId, name, description, price, imageUrl, colors } = req.body || {};
    
    if (!brandId || !name) {
      return res.status(400).json({ error: 'Missing brandId or name' });
    }

    // Verify brand exists
    const brand = await prisma.brand.findUnique({ where: { id: brandId } });
    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    const product = await prisma.product.create({
      data: {
        brandId,
        name,
        description,
        price: price ? parseFloat(price) : null,
        imageUrl,
        colors: colors || []
      },
      include: { brand: true }
    });
    
    return res.status(201).json({ product: mapProduct(product) });
  } catch (err) {
    return next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const id = req.params.id;
    const { name, description, price, imageUrl, colors } = req.body || {};
    
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: name || product.name,
        description: description !== undefined ? description : product.description,
        price: price !== undefined ? parseFloat(price) : product.price,
        imageUrl: imageUrl !== undefined ? imageUrl : product.imageUrl,
        colors: colors || product.colors
      },
      include: { brand: true }
    });
    
    return res.json({ product: mapProduct(updated) });
  } catch (err) {
    return next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const id = req.params.id;
    const product = await prisma.product.findUnique({ where: { id } });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await prisma.product.delete({ where: { id } });
    return res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};

