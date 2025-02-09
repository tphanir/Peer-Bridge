const db = require('../../db');

const experienceResolvers = {
  Query: {
    getExperienceByCompany: (_, { company_name }) => {

      const experienceQuery = `SELECT * FROM experience WHERE company_name = ?`;
      const userQuery = `SELECT * FROM users WHERE studentid = ?`;

      return new Promise((resolve, reject) => {
        db.execute(experienceQuery, [company_name], (err, results) => {
          if (err) {
            reject(new Error('Error fetching experiences: ' + err.message));
            return;
          }

          if (results.length === 0) {
            reject(new Error('No experiences found for this company'));
            return;
          }

          results.forEach(result => {
            if (result.resources) {
              try {
                result.resources = JSON.parse(result.resources);
              } catch (err) {
                result.resources = null;
              }
            }
          });

          const experienceList = results.map(experience => {
            return new Promise((resolveUser, rejectUser) => {
              db.execute(userQuery, [experience.studentid], (userErr, userResults) => {
                if (userErr) {
                  rejectUser(new Error('Error fetching user details: ' + userErr.message));
                  return;
                }

                if (userResults.length === 0) {
                  rejectUser(new Error(`User not found for studentid: ${experience.studentid}`));
                  return;
                }

                experience.user = userResults[0];
                resolveUser(experience);
              });
            });
          });

          Promise.all(experienceList)
            .then(resolvedExperiences => resolve(resolvedExperiences))
            .catch(error => reject(error));
        });
      });
    },

    getExperiences: (_, { page, limit }) => {
      const experienceQuery = `SELECT * FROM experience ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      const userQuery = `SELECT * FROM users WHERE studentid = ?`;

      page = Number(page) || 1;
      limit = Number(limit) || 10;
  
      if (page < 1) page = 1;
      if (limit < 1) limit = 10;
  
      const offset = (page - 1) * limit;

      return new Promise((resolve, reject) => {
        db.execute(experienceQuery, [String(limit), String(offset)], (err, results) => {
          if (err) {
            reject(new Error('Error fetching experiences: ' + err.message));
            return;
          }

          if (results.length === 0) {
            reject(new Error('No experiences found for this company'));
            return;
          }

          results.forEach(result => {
            if (result.resources) {
              try {
                result.resources = JSON.parse(result.resources);
              } catch (err) {
                result.resources = null;
              }
            }
          });

          const experienceList = results.map(experience => {
            return new Promise((resolveUser, rejectUser) => {
              db.execute(userQuery, [experience.studentid], (userErr, userResults) => {
                if (userErr) {
                  rejectUser(new Error('Error fetching user details: ' + userErr.message));
                  return;
                }

                if (userResults.length === 0) {
                  rejectUser(new Error(`User not found for studentid: ${experience.studentid}`));
                  return;
                }

                experience.user = userResults[0];
                resolveUser(experience);
              });
            });
          });

          Promise.all(experienceList)
            .then(resolvedExperiences => resolve(resolvedExperiences))
            .catch(error => reject(error));
        });
      });
    },
  },

  Mutation: {
    addExperience: (_, { input },context) => {
      
       // Ensure user is authenticated
       if (!context.user) {
        throw new Error("Unauthorized: You must be logged in to add an experience.");
      }
      const { studentid, company_name, position, interview_type, interview_rounds, duration, interview_location, difficulty_level, interview_questions, interview_experience, outcome, feedback, tips, preplinks, resources } = input;

      if (!studentid || !company_name || !position || !interview_type || !interview_rounds || !interview_location || !difficulty_level || !outcome) {
        return Promise.reject(new Error('Missing required fields'));
      }

      const insertExperienceQuery = `INSERT INTO experience (studentid, company_name, position, interview_type, interview_rounds, duration, interview_location, difficulty_level, interview_questions, interview_experience, outcome, feedback, tips, preplinks, resources) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const getUserQuery = `SELECT * FROM users WHERE studentid = ?`;

      return new Promise((resolve, reject) => {
        db.execute(insertExperienceQuery, [
          studentid, company_name, position, interview_type, interview_rounds, duration, interview_location, difficulty_level,
          interview_questions, interview_experience, outcome, feedback, tips, JSON.stringify(preplinks), resources,
        ], (err, experienceResult) => {
          if (err) {
            reject(new Error('Error adding experience: ' + err.message));
            return;
          }

          db.execute(getUserQuery, [studentid], (err, userResult) => {
            if (err) {
              reject(new Error('Error fetching user details: ' + err.message));
              return;
            }

            const user = userResult[0];
            resolve({
              experience_id: experienceResult.insertId,
              studentid,
              company_name,
              position,
              interview_type,
              interview_rounds,
              duration,
              interview_location,
              difficulty_level,
              interview_questions,
              interview_experience,
              outcome,
              feedback,
              tips,
              preplinks,
              resources,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              user: user,
            });
          });
        });
      });
    },
  },
};

module.exports = experienceResolvers;
