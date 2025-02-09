const db = require('../../db');

const courseResolvers = {
  Query: {
    getCourseDetails: async (_, { course_code }) => {
      const courseQuery = `SELECT * FROM course_reviews WHERE course_code = ?`;
      const userQuery = `SELECT * FROM users WHERE studentid = ?`;

      return new Promise((resolve, reject) => {
        db.execute(courseQuery, [course_code], (err, results) => {
          if (err) {
            console.error('Error fetching course details:', err.message);
            reject(new Error('Error fetching course details: ' + err.message));
            return;
          }

          if (results.length === 0) {
            reject(new Error('No reviews found for this course'));
            return;
          }

          const courseReviews = results.map(course => {
            return new Promise((resolveUser, rejectUser) => {
              db.execute(userQuery, [course.studentid], (userErr, userResults) => {
                if (userErr) {
                  rejectUser(new Error('Error fetching user details: ' + userErr.message));
                  return;
                }

                if (userResults.length === 0) {
                  rejectUser(new Error('User not found for studentid: ' + course.studentid));
                  return;
                }

                course.user = userResults[0];
                resolveUser(course);
              });
            });
          });

          Promise.all(courseReviews)
            .then(resolvedReviews => resolve(resolvedReviews))
            .catch(error => reject(error));
        });
      });
    },

    getAllCourses: async (_, {page,limit}) => {
      const courseQuery = `SELECT * FROM course_reviews ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      const userQuery = `SELECT * FROM users WHERE studentid = ?`;
      page = Number(page) || 1;
      limit = Number(limit) || 10;
  
      if (page < 1) page = 1;
      if (limit < 1) limit = 10;
  
      const offset = (page - 1) * limit;
      return new Promise((resolve, reject) => {
        db.execute(courseQuery, [String(limit), String(offset)], (err, results) => {
          if (err) {
            console.error('Error fetching course details:', err.message);
            reject(new Error('Error fetching course details: ' + err.message));
            return;
          }

          if (results.length === 0) {
            reject(new Error('No reviews found for this course'));
            return;
          }

          const courseReviews = results.map(course => {
            return new Promise((resolveUser, rejectUser) => {
              db.execute(userQuery, [course.studentid], (userErr, userResults) => {
                if (userErr) {
                  rejectUser(new Error('Error fetching user details: ' + userErr.message));
                  return;
                }

                if (userResults.length === 0) {
                  rejectUser(new Error('User not found for studentid: ' + course.studentid));
                  return;
                }

                course.user = userResults[0];
                resolveUser(course);
              });
            });
          });

          Promise.all(courseReviews)
            .then(resolvedReviews => resolve(resolvedReviews))
            .catch(error => reject(error));
        });
      });
    },
  },

  Mutation: {
    addCourse: (_, { input },context) => {
      // Ensure user is authenticated
      if (!context.user) {
        throw new Error("Unauthorized: You must be logged in to add an experience.");
      }
      const {
        course_name, course_code, instructor_names, institution, semester,
        studentid, experience_rating, review, tips,
      } = input;

      if (!course_name || !course_code || !instructor_names || !institution || !semester || !studentid || !experience_rating || !review) {
        return Promise.reject(new Error('Please provide all required fields'));
      }

      if (experience_rating < 1 || experience_rating > 5) {
        return Promise.reject(new Error('Experience rating must be between 1 and 5'));
      }

      const query = `INSERT INTO course_reviews (course_name, course_code, instructor_names, institution, semester, studentid, experience_rating, review, tips) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      return new Promise((resolve, reject) => {
        db.execute(query, [
          course_name, course_code, JSON.stringify(instructor_names), institution, semester, studentid, experience_rating, review, tips || '',
        ], (err, result) => {
          if (err) {
            reject(new Error('Error saving course review: ' + err.message));
            return;
          }

          const userQuery = `SELECT * FROM users WHERE studentid = ?`;
          db.execute(userQuery, [studentid], (err, userResult) => {
            if (err) {
              reject(new Error('Error fetching user details: ' + err.message));
              return;
            }

            const user = userResult[0];
            resolve({
              course_id: result.insertId,
              course_name,
              course_code,
              instructor_names,
              institution,
              semester,
              studentid,
              experience_rating,
              review,
              tips: tips || '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              user: user || null,
            });
          });
        });
      });
    },
  },
};

module.exports = courseResolvers;
