import EnrolmentModel from '../models/enrolmentModel.js'

// (admin enrols a student)
const enrolStudent = async (req, res, next) => {
    try {
        const { user_id, course_id } = req.body;
        if (!user_id || !course_id) {
            return res.status(400).json({ message: 'user_id and course_id are required.' });
        }

        const already = await EnrolmentModel.exists({ user_id, course_id });
        if (already) return res.status(409).json({ message: 'Student already enrolled in this course.' });

        const enrolment = await EnrolmentModel.enrol({ user_id, course_id });
        res.status(201).json({ success: true, message: 'Student enrolled.', enrolment });
    } catch (err) {
        next(err);
    }
};

// (student sees their own courses)
const getMyCourses = async (req, res, next) => {
    try {
        const courses = await EnrolmentModel.getStudentCourses(req.user.id);
        res.json({ success: true, courses });
    } catch (err) {
        next(err);
    }
};

// (admin sees all enrolments)
const getAllEnrolments = async (req, res, next) => {
    try {
        const enrolments = await EnrolmentModel.findAll();
        res.json({ success: true, enrolments });
    } catch (err) {
        next(err);
    }
};

// (admin removes enrolment)
const removeEnrolment = async (req, res, next) => {
    try {
        const deleted = await EnrolmentModel.delete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Enrolment not found.' });
        res.json({ success: true, message: 'Enrolment removed.' });
    } catch (err) {
        next(err);
    }
};

// (admin dashboard stats)
const getStats = async (req, res, next) => {
    try {
        const stats = await EnrolmentModel.getStats();
        res.json({ success: true, stats });
    } catch (err) {
        next(err);
    }
};

export { enrolStudent, getMyCourses, getAllEnrolments, removeEnrolment, getStats };