const express = require('express');
const router = express.Router();

// Assuming you have a controller file for the skill routes
const { addSkill, updateResourceByName, getResource, listResources } = require('../controllers/skillController');

// Route to add a new skill/resource
router.post('/add', addSkill);

// Route to update an existing skill/resource by skill name
router.put('/update', updateResourceByName);

// Route to get details of a specific skill/resource
router.get('/:skill_name', getResource);

// Route to list all skills/resources
router.get('/', listResources);

module.exports = router;
