import CourseModel from '../models/courseModel.js'

// GET course
const getCourses = async (req, res, next) => {
    try {
        const { search = '', page = 1, limit = 50 } = req.query;
        const data = await CourseModel.findAll({ search, page: parseInt(page), limit: parseInt(limit) });
        res.json({ success: true, ...data });
    } catch (err) {
        next(err);
    }
};

// GET courses/:id
const getCourseById = async (req, res, next) => {
    try {
        const course = await CourseModel.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found.' });
        res.json({ success: true, course });
    } catch (err) {
        next(err);
    }
};

// create course
const createCourse = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        if (!title) return res.status(400).json({ message: 'Course title is required.' });

        const course = await CourseModel.create({ title, description, created_by: req.user.id });
        res.status(201).json({ success: true, message: 'Course created.', course });
    } catch (err) {
        next(err);
    }
};

// PUT update course
const updateCourse = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const course = await CourseModel.update(req.params.id, { title, description });
        if (!course) return res.status(404).json({ message: 'Course not found.' });
        res.json({ success: true, message: 'Course updated.', course });
    } catch (err) {
        next(err);
    }
};

// delete course
const deleteCourse = async (req, res, next) => {
    try {
        const deleted = await CourseModel.delete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Course not found.' });
        res.json({ success: true, message: 'Course deleted.' });
    } catch (err) {
        next(err);
    }
};

export { getCourses, getCourseById, createCourse, updateCourse, deleteCourse };