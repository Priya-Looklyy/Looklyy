const { prisma } = require('../config/prisma');

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

async function getMe(req, res, next) {
  try {
    const user = await prisma.User.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ user: mapUser(user) });
  } catch (err) {
    return next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const { 
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
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Check if username is being updated and if it's already taken
    if (username) {
      const existingUser = await prisma.User.findFirst({
        where: {
          username,
          id: { not: req.user.id }
        }
      });
      if (existingUser) {
        return res.status(409).json({ error: 'Username already taken' });
      }
    }

    const updatedUser = await prisma.User.update({
      where: { id: req.user.id },
      data: {
        name,
        username: username || undefined,
        phoneNumber: phoneNumber !== undefined ? phoneNumber : undefined,
        profilePicture: profilePicture !== undefined ? profilePicture : undefined,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        gender: gender !== undefined ? gender : undefined,
        location: location !== undefined ? location : undefined,
        bio: bio !== undefined ? bio : undefined,
        favoriteColors: favoriteColors || undefined,
        stylePreferences: stylePreferences ? JSON.stringify(stylePreferences) : undefined,
        favoriteBrands: favoriteBrands ? JSON.stringify(favoriteBrands) : undefined,
        clothingSize: clothingSize !== undefined ? clothingSize : undefined,
        shoeSize: shoeSize !== undefined ? shoeSize : undefined,
        fitPreference: fitPreference !== undefined ? fitPreference : undefined,
        wardrobeImages: wardrobeImages ? JSON.stringify(wardrobeImages) : undefined,
        socialMediaLinks: socialMediaLinks ? JSON.stringify(socialMediaLinks) : undefined,
        wishlist: wishlist ? JSON.stringify(wishlist) : undefined,
        notificationPreferences: notificationPreferences ? JSON.stringify(notificationPreferences) : undefined,
        privacySettings: privacySettings ? JSON.stringify(privacySettings) : undefined,
        paymentInfo: paymentInfo !== undefined ? paymentInfo : undefined
      }
    });

    return res.json({ user: mapUser(updatedUser) });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getMe, updateProfile };


