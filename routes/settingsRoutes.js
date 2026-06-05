const express = require('express');
const settingsController = require('../controllers/settingsController');

const router = express.Router();

router.get('/catalogs', settingsController.getCatalogs);
router.post('/careers', settingsController.createCareer);
router.delete('/careers/:id', settingsController.deleteCareer);
router.post('/semesters', settingsController.createSemester);
router.delete('/semesters/:id', settingsController.deleteSemester);
router.post('/periods', settingsController.createPeriod);
router.delete('/periods/:id', settingsController.deletePeriod);

module.exports = router;
