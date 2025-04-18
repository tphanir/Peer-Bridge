// controllers/courseController.js - Fully fixed version

const db = require('../db');

/**
 * Get course reviews - supports filtering, sorting, pagination, and search
 */
const getDetails = (req, res) => {
    const {
        course_code,
        page = 1,
        limit = 10,
        sort_by = 'updated_at',
        sort_order = 'desc',
        search = ''
    } = req.query;

    const offset = (page - 1) * limit;

    let query = `
        SELECT cr.*, u.name AS student_name
        FROM course_reviews cr
        JOIN users u ON cr.studentid = u.studentid
        WHERE 1=1
    `;

    const params = [];

    if (course_code) {
        query += ` AND cr.course_code = ?`;
        params.push(course_code);
    }

    if (search) {
        query += ` AND (cr.course_name LIKE ? OR cr.course_code LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
    }

    const validSortFields = ['updated_at', 'experience_rating', 'likes_count'];
    const sortField = validSortFields.includes(sort_by) ? sort_by : 'updated_at';
    const sortDirection = sort_order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    query += ` ORDER BY cr.${sortField} ${sortDirection} LIMIT ${limit} OFFSET ${offset}`;



    db.execute(query, params, (err, results) => {
        if (err) {
            console.error("🔥 Query Error:", err);
            return res.status(500).json({ message: 'Error fetching course details', error: err.message });
        }
    
        console.log("✅ Raw DB Results:", results);
    
        let formattedResults;
        try {
            formattedResults = results.map(review => {
                let instructorNames = [];
                try {
                    // Check if it's a valid string and then parse it
                    if (typeof review.instructor_names === 'string') {
                        instructorNames = JSON.parse(review.instructor_names || '[]');
                    } else if (Array.isArray(review.instructor_names)) {
                        instructorNames = review.instructor_names;
                    } else {
                        // If it's neither a string nor an array, handle it
                        instructorNames = [];
                    }
                } catch (e) {
                    instructorNames = [];
                }

                return {
                    id: review.course_id,
                    courseName: review.course_name,
                    courseCode: review.course_code,
                    studentName: review.student_name,
                    reviewContent: review.review,
                    rating: review.experience_rating,
                    instructorNames,
                    likeCount: review.likes_count || 0,
                    updatedAt: review.updated_at,
                    semester: review.semester,
                    tips: review.tips
                };
            });
        } catch (formatErr) {
            console.error("❌ Formatting Error:", formatErr);
            return res.status(500).json({ message: 'Error formatting response', error: formatErr.message });
        }
    
        const countQuery = `SELECT COUNT(*) as total FROM course_reviews cr WHERE 1=1` +
            (course_code ? ` AND cr.course_code = ?` : '') +
            (search ? ` AND (cr.course_name LIKE ? OR cr.course_code LIKE ?)` : '');
    
        const countParams = [];
        if (course_code) countParams.push(course_code);
        if (search) countParams.push(`%${search}%`, `%${search}%`);
    
        db.execute(countQuery, countParams, (countErr, countResult) => {
            if (countErr) {
                console.error("❌ Count Query Error:", countErr);
                return res.status(500).json({ message: 'Error fetching count', error: countErr.message });
            }
    
            console.log("📊 Count Result:", countResult);
    
            const total = countResult[0]?.total ?? 0;
            const totalPages = Math.ceil(total / limit);
    
            res.status(200).json({
                status: 'success',
                data: formattedResults,
                pagination: {
                    total,
                    pages: totalPages,
                    current: Number(page)
                }
            });
        });
    });
    
};

/**
 * Add a new course review
 */
const addCourse = (req, res) => {
    const { courseName, courseCode, instructorNames, institution, semester, studentid, rating, reviewContent, tips } = req.body;

    if (!courseName || !courseCode || !instructorNames || !institution || !semester || !studentid || !rating || !reviewContent) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Experience rating must be between 1 and 5' });
    }

    const query = `INSERT INTO course_reviews 
                   (course_name, course_code, instructor_names, institution, semester, studentid, experience_rating, review, tips) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.execute(query, [
        courseName,
        courseCode,
        JSON.stringify(instructorNames),
        institution,
        semester,
        studentid,
        rating,
        reviewContent,
        tips || ''
    ], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error saving course review', error: err.message });
        }

        const getReviewQuery = `
            SELECT cr.*, u.name as student_name 
            FROM course_reviews cr
            JOIN users u ON cr.studentid = u.studentid
            WHERE cr.course_id = ?
        `;

        db.execute(getReviewQuery, [results.insertId], (err, reviewResults) => {
            if (err || reviewResults.length === 0) {
                return res.status(201).json({
                    message: 'Course review added successfully',
                    id: results.insertId
                });
            }

            const review = reviewResults[0];
            let instructorNamesParsed = [];
            const raw = review.instructor_names;

            if (Array.isArray(raw)) {
            // already an array
            instructorNamesParsed = raw;
            } else if (typeof raw === 'string' && raw.trim()) {
            // try JSON first, then comma‑split
            try {
                instructorNamesParsed = JSON.parse(raw);
            } catch (err) {
                instructorNamesParsed = raw.split(',').map(name => name.trim());
            }
            } else {
            instructorNamesParsed = [];
            }
            const formattedReview = {
                id: review.course_id,
                courseName: review.course_name,
                courseCode: review.course_code,
                studentName: review.student_name,
                reviewContent: review.review,
                rating: review.experience_rating,
                instructorNames: instructorNamesParsed,
                likeCount: 0,
                updatedAt: review.updated_at,
                semester: review.semester,
                tips: review.tips
            };

            res.status(201).json({
                message: 'Course review added successfully',
                data: formattedReview
            });
        });
    });
};

/**
 * Toggle like on a review
 */
const toggleLike = (req, res) => {
    const { reviewId } = req.params;
    const { studentid } = req.body;

    if (!reviewId || !studentid) {
        return res.status(400).json({ message: 'Review ID and student ID are required' });
    }

    const checkQuery = `SELECT * FROM review_likes WHERE review_id = ? AND studentid = ?`;

    db.execute(checkQuery, [reviewId, studentid], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error checking like status', error: err.message });
        }

        let query, queryParams, likeAdded;

        if (results.length > 0) {
            query = `DELETE FROM review_likes WHERE review_id = ? AND studentid = ?`;
            queryParams = [reviewId, studentid];
            likeAdded = false;
        } else {
            query = `INSERT INTO review_likes (review_id, studentid, created_at) VALUES (?, ?, NOW())`;
            queryParams = [reviewId, studentid];
            likeAdded = true;
        }

        db.execute(query, queryParams, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error toggling like', error: err.message });
            }

            const updateCountQuery = `
                UPDATE course_reviews 
                SET likes_count = (
                    SELECT COUNT(*) FROM review_likes WHERE review_id = ?
                )
                WHERE course_id = ?
            `;

            db.execute(updateCountQuery, [reviewId, reviewId], (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error updating like count', error: err.message });
                }

                const getCountQuery = `SELECT likes_count FROM course_reviews WHERE course_id = ?`;

                db.execute(getCountQuery, [reviewId], (err, countResults) => {
                    if (err || countResults.length === 0) {
                        return res.status(200).json({
                            message: likeAdded ? 'Review liked successfully' : 'Review unliked successfully',
                            liked: likeAdded
                        });
                    }

                    res.status(200).json({
                        message: likeAdded ? 'Review liked successfully' : 'Review unliked successfully',
                        liked: likeAdded,
                        likeCount: countResults[0].likes_count
                    });
                });
            });
        });
    });
};

/**
 * Check if a student has liked a review
 */
const checkLikeStatus = (req, res) => {
    const { reviewId } = req.params;
    const { studentid } = req.query;

    if (!reviewId || !studentid) {
        return res.status(400).json({ message: 'Review ID and student ID are required' });
    }

    const query = `SELECT * FROM review_likes WHERE review_id = ? AND studentid = ?`;

    db.execute(query, [reviewId, studentid], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error checking like status', error: err.message });
        }

        res.status(200).json({ liked: results.length > 0 });
    });
};

module.exports = {
    getDetails,
    addCourse,
    toggleLike,
    checkLikeStatus
};
