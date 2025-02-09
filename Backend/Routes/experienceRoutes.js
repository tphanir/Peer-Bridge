const express = require('express');
const experienceController = require('../Controllers/experienceController');

const experienceRoutes = express.Router();

experienceRoutes.route('/addExperience').post(experienceController.addExperience);
experienceRoutes.route('/getExperience').get(experienceController.getExperienceByCompany);

module.exports = experienceRoutes;
