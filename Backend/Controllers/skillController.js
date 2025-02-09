const db = require('../db');

const addSkill = (req, res) => {
    // Extracting values from the request body
    const { skill_name, description, category, resources, tags } = req.body;

    // Validation: Check if all required fields are provided
    if (!skill_name || !description || !category || !resources) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Prepare the SQL query for inserting resource data
    const query = `
        INSERT INTO resources (skill_name, description, category, resources, tags)
        VALUES (?, ?, ?, ?, ?)
    `;

    // Execute the query to insert the data
    db.execute(query, [
        skill_name,
        description,
        category,
        JSON.stringify(resources),  // Convert the resources array to a JSON string
        JSON.stringify(tags)         // Convert the tags array to a JSON string
    ], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error adding resource', error: err.message });
        }

        // Return success message with the inserted resource details
        res.status(201).json({
            status: 'success',
            message: 'Resource added successfully',
            data: {
                resource_id: results.insertId,  // New resource ID generated by MySQL
                skill_name,
                description,
                category,
                resources,
                tags
            }
        });
    });
};

const updateResourceByName = (req, res) => {
    // Extracting values from the request body
    const { skill_name, additional_resources, additional_tags } = req.body;

    // Validation: Ensure that skill_name is provided, and at least one of the additional fields is provided
    if (!skill_name || (!additional_resources && !additional_tags)) {
        return res.status(400).json({ message: 'Missing required fields or no new data provided' });
    }

    // Prepare the SQL query to fetch the existing resource data by skill_name
    const query = 'SELECT * FROM resources WHERE skill_name = ?';

    // Fetch the existing resource from the database
    db.execute(query, [skill_name], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching resource', error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        // Get the current values for resources and tags from the database
        const currentResource = results[0];
        let updatedResources = currentResource.resources ? (currentResource.resources) : [];
        let updatedTags = currentResource.tags ? (currentResource.tags) : [];

        // Add new resources and/or tags
        if (additional_resources) {
            updatedResources = [...updatedResources, ...additional_resources];
        }
        if (additional_tags) {
            updatedTags = [...updatedTags, ...additional_tags];
        }

        // Prepare the update SQL query
        const updateQuery = `
            UPDATE resources
            SET resources = ?, tags = ?, updated_at = CURRENT_TIMESTAMP
            WHERE skill_name = ?
        `;

        // Execute the update query
        db.execute(updateQuery, [
            JSON.stringify(updatedResources),
            JSON.stringify(updatedTags),
            skill_name
        ], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error updating resource', error: err.message });
            }

            // Return success message with the updated resource details
            res.status(200).json({
                status: 'success',
                message: 'Resource updated successfully',
                data: {
                    skill_name,
                    updatedResources,
                    updatedTags
                }
            });
        });
    });
};

const getResource = (req, res) => {
    const { skill_name } = req.params;

    if (!skill_name) {
        return res.status(400).json({ message: 'Skill name is required' });
    }

    const query = 'SELECT * FROM resources WHERE skill_name = ?';

    db.execute(query, [skill_name], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching resource', error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        const resource = results[0];
        res.status(200).json({
            status: 'success',
            data: {
                results
            }
        });
    });
};

const listResources = (req, res) => {
    const query = 'SELECT * FROM resources';

    db.execute(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching resources', error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No resources found' });
        }
        res.status(200).json({
            status: 'success',
            data: results
        });
    });
};


module.exports = {addSkill,updateResourceByName,getResource, listResources};