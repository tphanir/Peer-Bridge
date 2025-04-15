const db = require('../db');

const getMyMessages = (req, res) => {
    const {sender_id}= req.body;
    const page = req.query.page || 1;  // Default to page 1 if not provided
    const limit = req.query.limit || 10;  // Default to limit 10 if not provided

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    const query = `
        SELECT * FROM messages 
        WHERE parent_message_id IS NULL 
        AND sender_id = ? 
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?
    `;

    db.execute(query, [sender_id, String(limit), String(offset)], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        res.status(200).json({ messages: results });
    });
};


const getAllMessages = (req, res) => {
    const page = parseInt(req.params.page, 10) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.params.limit, 10) || 10; // Default to 10 if not provided

    // Calculate the offset based on the page and limit
    const offset = (page - 1) * limit;

    const query = `SELECT * FROM messages WHERE parent_message_id IS NULL ORDER BY created_at DESC LIMIT ? OFFSET ?`;

    db.execute(query, [String(limit), String(offset)], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        res.status(200).json({ messages: results });
    });
};


const addMessage = (req, res) => {
    const { sender_id, content, parent_message_id = null } = req.body; // parent_message_id is optional

    if (!sender_id || !content) {
        return res.status(400).json({ error: "sender_id and content are required" });
    }

    const query = `INSERT INTO messages (sender_id, content, parent_message_id) VALUES (?, ?, ?)`;

    db.execute(query, [sender_id, content, parent_message_id], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        res.status(201).json({ message: "Message added successfully", message_id: result.insertId });
    });
};

const getReplies = (req, res) => {
    const { msgid } = req.params; // Extract message ID from URL params

    if (!msgid) {
        return res.status(400).json({ error: "Message ID is required" });
    }

        const query = `
        SELECT m.id AS message_id, m.content AS message_content, m.created_at AS message_created_at, u.studentid, u.name, u.email, u.year, u.created_at AS user_created_at
        FROM messages m
        JOIN users u ON m.sender_id = u.studentid
        WHERE m.parent_message_id = ?;
    `;

    db.execute(query, [msgid], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        res.status(200).json({ replies: results });
    });
};


const addReply = (req, res) => {
    const { msgid } = req.params; // Extract message ID from URL params
    const { sender_id, content } = req.body; // Extract sender_id and content from request body

    if (!msgid || !sender_id || !content) {
        return res.status(400).json({ error: "Message ID, sender_id, and content are required" });
    }

    const query = `INSERT INTO messages (sender_id, content, parent_message_id) VALUES (?, ?, ?)`;

    db.execute(query, [sender_id, content, msgid], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        res.status(201).json({ message: "Reply added successfully", reply_id: result.insertId });
    });
};


module.exports = { getMyMessages,addMessage, getReplies, addReply, getAllMessages};
