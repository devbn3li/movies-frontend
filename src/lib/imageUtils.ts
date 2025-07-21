// Image optimization utilities
export const imageConfig = {
  // TMDB image sizes
  POSTER_SIZES: {
    SMALL: 'w92',
    MEDIUM: 'w185', 
    LARGE: 'w342',
    XLARGE: 'w500',
    ORIGINAL: 'original'
  },
  
  BACKDROP_SIZES: {
    SMALL: 'w300',
    MEDIUM: 'w780',
    LARGE: 'w1280',
    ORIGINAL: 'original'
  },
  
  PROFILE_SIZES: {
    SMALL: 'w45',
    MEDIUM: 'w185',
    LARGE: 'h632',
    ORIGINAL: 'original'
  }
};

export const getOptimizedImageUrl = (
  path: string, 
  type: 'poster' | 'backdrop' | 'profile' = 'poster',
  size: 'small' | 'medium' | 'large' | 'xlarge' | 'original' = 'medium'
): string => {
  if (!path) return '';
  
  const baseUrl = 'https://image.tmdb.org/t/p/';
  
  let sizeConfig;
  switch (type) {
    case 'backdrop':
      sizeConfig = imageConfig.BACKDROP_SIZES;
      break;
    case 'profile':
      sizeConfig = imageConfig.PROFILE_SIZES;
      break;
    default:
      sizeConfig = imageConfig.POSTER_SIZES;
  }
  
  let sizeValue;
  switch (size) {
    case 'small':
      sizeValue = type === 'poster' ? sizeConfig.SMALL : 
                  type === 'backdrop' ? sizeConfig.SMALL : 
                  sizeConfig.SMALL;
      break;
    case 'large':
      sizeValue = type === 'poster' ? sizeConfig.LARGE : 
                  type === 'backdrop' ? sizeConfig.LARGE : 
                  sizeConfig.LARGE;
      break;
    case 'xlarge':
      sizeValue = type === 'poster' ? imageConfig.POSTER_SIZES.XLARGE : 
                  type === 'backdrop' ? imageConfig.BACKDROP_SIZES.LARGE : 
                  imageConfig.PROFILE_SIZES.LARGE;
      break;
    case 'original':
      sizeValue = sizeConfig.ORIGINAL;
      break;
    default:
      sizeValue = type === 'poster' ? sizeConfig.MEDIUM : 
                  type === 'backdrop' ? sizeConfig.MEDIUM : 
                  sizeConfig.MEDIUM;
  }
  
  return `${baseUrl}${sizeValue}${path}`;
};

// Blur data URL for loading placeholder
export const BLUR_DATA_URL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Rw=";
