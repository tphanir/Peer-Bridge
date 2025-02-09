const db = require('../../db');

const resourceResolvers = {
  Query: {
    getResource: (_, { skill_name }) => {
      
      if (!skill_name) {
        return Promise.reject(new Error('Skill name is required'));
      }

      const query = 'SELECT * FROM resources WHERE skill_name = ?';

      return new Promise((resolve, reject) => {
        db.execute(query, [skill_name], (err, results) => {
          if (err) {
            reject(new Error('Error fetching resource: ' + err.message));
            return;
          }

          if (!results || results.length === 0) {
            reject(new Error('Resource not found'));
            return;
          }

          resolve(results);
        });
      });
    },

    listResources: (_, { page, limit }) => {
      return new Promise((resolve, reject) => {
        // Ensure page and limit are numbers
        page = Number(page) || 1;
        limit = Number(limit) || 10;
    
        if (page < 1) page = 1;
        if (limit < 1) limit = 10;
    
        const offset = (page - 1) * limit;
        const dataQuery = 'SELECT * FROM resources ORDER BY created_at DESC LIMIT ? OFFSET ?';
    
        db.execute(dataQuery, [String(limit), String(offset)], (err, results) => {
          if (err) {
            reject(new Error('Error fetching resources: ' + err.message));
            return;
          }
    
          resolve(results);
        });
      });
    },
    
    
  },

  Mutation: {
    addSkill: (_, { skill_name, description, category, resources, tags },context) => {

      // Ensure user is authenticated
      if (!context.user || context.user.id!=1) {
        throw new Error("Unauthorized: You must be logged in to add an experience.");
      }
      if (!skill_name || !description || !category || !resources || !tags) {
        return Promise.reject(new Error('Missing required fields'));
      }

      const query = `INSERT INTO resources (skill_name, description, category, resources, tags) VALUES (?, ?, ?, ?, ?)`;

      return new Promise((resolve, reject) => {
        db.execute(query, [
          skill_name, description, category, JSON.stringify(resources), JSON.stringify(tags),
        ], (err, result) => {
          if (err) {
            reject(new Error('Error adding resource: ' + err.message));
            return;
          }

          resolve({
            resource_id: result.insertId,
            skill_name,
            description,
            category,
            resources,
            tags,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            status: 'success',
            message: 'Resource successfully added',
          });
        });
      });
    },

  // Resolver for updateResourceByName mutation
updateResourceByName: (_, { skill_name, additional_resources, additional_tags },context) => {

  // Ensure user is authenticated
  if (!context.user || context.user.id!=1) {
    throw new Error("Unauthorized: You must be logged in to add an experience.");
  }
    return new Promise((resolve, reject) => {
      // Validate required fields
      if (!skill_name || (!additional_resources && !additional_tags)) {
        return reject(new Error('Missing required fields or no new data provided'));
      }
  
      const query = 'SELECT * FROM resources WHERE skill_name = ?';
  
      // Execute query to get the current resource
      db.execute(query, [skill_name], (err, results) => {
        if (err) {
          return reject(new Error('Error retrieving resource: ' + err.message));
        }
  
        if (results.length === 0) {
          return reject(new Error('Resource not found'));
        }
  
        const currentResource = results[0];
        let updatedResources = currentResource.resources ? currentResource.resources : [];
        let updatedTags = currentResource.tags ? currentResource.tags : [];
  
        // Add new resources and/or tags
        if (additional_resources) {
          updatedResources = [...updatedResources, ...additional_resources];
        }
        if (additional_tags) {
          updatedTags = [...updatedTags, ...additional_tags];
        }
  
        console.log(updatedResources);
        console.log(updatedTags);
  
        const updateQuery = `
          UPDATE resources
          SET resources = ?, tags = ?, updated_at = CURRENT_TIMESTAMP
          WHERE skill_name = ?
        `;
  
        // Execute query to update the resource
        db.execute(updateQuery, [
          JSON.stringify(updatedResources),
          JSON.stringify(updatedTags),
          skill_name
        ], (updateErr, updateResult) => {
          if (updateErr) {
            return reject(new Error('Error updating resource: ' + updateErr.message));
          }
  
          resolve({
            resource_id: currentResource.resource_id,
            skill_name,
            description: currentResource.description,
            category: currentResource.category,
            resources: updatedResources,
            tags: updatedTags,
            created_at: currentResource.created_at,
            updated_at: new Date().toISOString()
          });
        });
      });
    });
  }
  },
};

module.exports = resourceResolvers;
