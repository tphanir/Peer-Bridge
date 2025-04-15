const db = require('../db'); // Assuming you're using this to connect to the database

const getDetails = (req, res) => {
    const { course_code } = req.query; // Get course_code from query parameters

    // Check if course_code is provided
    if (!course_code) {
        return res.status(400).json({ message: 'Course code is required' });
    }

    // SQL query to find reviews by course_code
    const query = `SELECT * FROM course_reviews WHERE course_code = ?`;

    // Execute the query
    db.execute(query, [course_code], (err, results) => {
        if (err) {
            // Handle database errors
            return res.status(500).json({ message: 'Error fetching course details', error: err.message });
        }

        // If no reviews are found for the given course_code
        if (results.length === 0) {
            return res.status(404).json({ message: 'No reviews found for this course' });
        }

        // Return the reviews for the course
        res.status(200).json({
            status: 'success',
            data: results  // Send all the results of course_reviews matching the course_code
        });
    });
};


const addCourse = (req, res) => {
    const { course_name, course_code, instructor_names, institution, semester, studentid, experience_rating, review, tips } = req.body;

    // Input validation
    if (!course_name || !course_code || !instructor_names || !institution || !semester || !studentid || !experience_rating || !review) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Validate the experience rating (should be between 1 and 5)
    if (experience_rating < 1 || experience_rating > 5) {
        return res.status(400).json({ message: 'Experience rating must be between 1 and 5' });
    }

    try {
        // SQL query to insert the course review into the database
        const query = `INSERT INTO course_reviews 
                       (course_name, course_code, instructor_names, institution, semester, studentid, experience_rating, review, tips) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        // Execute the query
        db.execute(query, [course_name, course_code, JSON.stringify(instructor_names), institution, semester, studentid, experience_rating, review, tips || ''], (err, results) => {
            if (err) {
                // Handle error (e.g., if there's a problem with the database)
                return res.status(500).json({ message: 'Error saving course review', error: err.message });
            }

            // Send success response with the new course review ID
            res.status(201).json({
                message: 'Course review added successfully',
                course_id: results.insertId
            });
        });
    } catch (err) {
        // Handle any other unexpected errors
        res.status(500).json({ message: 'Error occurred while adding the course review', error: err.message });
    }
};


module.exports = { getDetails, addCourse };
