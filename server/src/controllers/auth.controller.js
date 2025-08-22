const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/prisma');

function signJwtForUser(userId) {
  const secret = process.env.JWT_SECRET || 'dev_secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ sub: userId }, secret, { expiresIn });
}

function mapUser(user) {
  return { 
    id: user.id, 
    email: user.email, 
    username: user.username,
    name: user.name, 
    phoneNumber: user.phoneNumber,
    profilePicture: user.profilePicture,
    dateOfBirth: user.dateOfBirth,
    gender: user.gender,
    location: user.location,
    bio: user.bio,
                favoriteColors: user.favoriteColors || [],
    stylePreferences: typeof user.stylePreferences === 'string' ? JSON.parse(user.stylePreferences) : user.stylePreferences,
    favoriteBrands: typeof user.favoriteBrands === 'string' ? JSON.parse(user.favoriteBrands) : user.favoriteBrands,
    clothingSize: user.clothingSize,
    shoeSize: user.shoeSize,
    fitPreference: user.fitPreference,
    wardrobeImages: typeof user.wardrobeImages === 'string' ? JSON.parse(user.wardrobeImages) : user.wardrobeImages,
    socialMediaLinks: typeof user.socialMediaLinks === 'string' ? JSON.parse(user.socialMediaLinks) : user.socialMediaLinks,
    wishlist: typeof user.wishlist === 'string' ? JSON.parse(user.wishlist) : user.wishlist,
    notificationPreferences: typeof user.notificationPreferences === 'string' ? JSON.parse(user.notificationPreferences) : user.notificationPreferences,
    privacySettings: typeof user.privacySettings === 'string' ? JSON.parse(user.privacySettings) : user.privacySettings,
    paymentInfo: user.paymentInfo,
    createdAt: user.createdAt, 
    updatedAt: user.updatedAt 
  };
}

async function registerUser(req, res, next) {
  try {
    const { 
      email, 
      password, 
      name, 
      username,
      phoneNumber,
      profilePicture,
      dateOfBirth,
      gender,
      location,
      bio, 
      favoriteColors,
      stylePreferences,
      favoriteBrands,
      clothingSize,
      shoeSize,
      fitPreference,
      wardrobeImages,
      socialMediaLinks,
      wishlist,
      notificationPreferences,
      privacySettings,
      paymentInfo
    } = req.body || {};
    
    if (!email || !password || !name || !username) {
      return res.status(400).json({ error: 'Missing required fields: name, username, email, or password' });
    }

    // Check for existing email or username
    const existingEmail = await prisma.User.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const existingUsername = await prisma.User.findUnique({ where: { username } });
    if (existingUsername) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.User.create({ 
      data: { 
        email, 
        username,
        name, 
        passwordHash,
        phoneNumber: phoneNumber || null,
        profilePicture: profilePicture || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender: gender || null,
        location: location || null,
        bio: bio || null,
        favoriteColors: favoriteColors || [],
        stylePreferences: stylePreferences ? JSON.stringify(stylePreferences) : '[]',
        favoriteBrands: favoriteBrands ? JSON.stringify(favoriteBrands) : '[]',
        clothingSize: clothingSize || null,
        shoeSize: shoeSize || null,
        fitPreference: fitPreference || null,
        wardrobeImages: wardrobeImages ? JSON.stringify(wardrobeImages) : '[]',
        socialMediaLinks: socialMediaLinks ? JSON.stringify(socialMediaLinks) : '[]',
        wishlist: wishlist ? JSON.stringify(wishlist) : '[]',
        notificationPreferences: notificationPreferences ? JSON.stringify(notificationPreferences) : '[]',
        privacySettings: privacySettings ? JSON.stringify(privacySettings) : '{}',
        paymentInfo: paymentInfo || null
      } 
    });
    const token = signJwtForUser(user.id);
    return res.status(201).json({ user: mapUser(user), token });
  } catch (err) {
    return next(err);
  }
}

async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    const user = await prisma.User.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signJwtForUser(user.id);
    return res.json({ user: mapUser(user), token });
  } catch (err) {
    return next(err);
  }
}

module.exports = { registerUser, loginUser };


