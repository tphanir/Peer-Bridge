// src/utils/reviewUtils.js

/**
 * Sorts review data based on specified criteria
 * @param {Array} reviews - Array of review objects
 * @param {String} sortBy - Sorting criteria ('date', 'rating', 'likes')
 * @param {String} order - Sort order ('asc' or 'desc')
 * @returns {Array} Sorted array of reviews
 */
export const sortReviews = (reviews, sortBy = 'date', order = 'desc') => {
    if (!reviews || reviews.length === 0) return [];
    
    const sorted = [...reviews];
    
    switch(sortBy) {
      case 'date':
        sorted.sort((a, b) => {
          const dateA = new Date(a.updatedAt);
          const dateB = new Date(b.updatedAt);
          return order === 'asc' ? dateA - dateB : dateB - dateA;
        });
        break;
        
      case 'rating':
        sorted.sort((a, b) => {
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          return order === 'asc' ? ratingA - ratingB : ratingB - ratingA;
        });
        break;
        
      case 'likes':
        sorted.sort((a, b) => {
          const likesA = a.likeCount || 0;
          const likesB = b.likeCount || 0;
          return order === 'asc' ? likesA - likesB : likesB - likesA;
        });
        break;
        
      default:
        // Default to date sorting
        sorted.sort((a, b) => {
          const dateA = new Date(a.updatedAt);
          const dateB = new Date(b.updatedAt);
          return order === 'asc' ? dateA - dateB : dateB - dateA;
        });
    }
    
    return sorted;
  };
  
  /**
   * Filters reviews based on search query
   * @param {Array} reviews - Array of review objects
   * @param {String} query - Search query
   * @param {Array} fields - Fields to search in (default: ['courseName', 'courseCode'])
   * @returns {Array} Filtered array of reviews
   */
  export const filterReviews = (reviews, query, fields = ['courseName', 'courseCode']) => {
    if (!query || !query.trim()) return reviews;
    if (!reviews || reviews.length === 0) return [];
    
    const searchQuery = query.toLowerCase().trim();
    
    return reviews.filter(review => {
      return fields.some(field => {
        const fieldValue = review[field];
        if (!fieldValue) return false;
        return fieldValue.toString().toLowerCase().includes(searchQuery);
      });
    });
  };
  
  /**
   * Groups reviews by course
   * @param {Array} reviews - Array of review objects
   * @returns {Object} Object with course codes as keys and arrays of reviews as values
   */
  export const groupReviewsByCourse = (reviews) => {
    if (!reviews || reviews.length === 0) return {};
    
    return reviews.reduce((grouped, review) => {
      const courseCode = review.courseCode;
      if (!grouped[courseCode]) {
        grouped[courseCode] = [];
      }
      grouped[courseCode].push(review);
      return grouped;
    }, {});
  };
  
  /**
   * Calculates average rating for each course
   * @param {Object} groupedReviews - Object with course codes as keys and arrays of reviews as values
   * @returns {Object} Object with course codes as keys and average ratings as values
   */
  export const calculateCourseRatings = (groupedReviews) => {
    const ratings = {};
    
    Object.keys(groupedReviews).forEach(courseCode => {
      const reviews = groupedReviews[courseCode];
      const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
      ratings[courseCode] = reviews.length > 0 ? totalRating / reviews.length : 0;
    });
    
    return ratings;
  };