import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as authorActions from '../../redux/actions/authorActions';
import * as courseActions from '../../redux/actions/courseActions';
import PropTypes from 'prop-types';
import CourseForm from './CourseForm';
import { newCourse } from "../../../tools/mockData";
import Spinner from '../common/Spinner';
import { toast } from 'react-toastify';



export function ManageCoursePage({
	courses, 
	authors, 
	loadAuthors, 
	loadCourses,
	saveCourse,
	incrCoursesLen, 
	history,
	...props
	}) {

	const [course, setCourse] = useState({...props.course});
	const [errors, setErrors] = useState({});
	const [saving, setSaving] = useState(false);

	useEffect( () => {

		if(courses.length === 0) {

			loadCourses().catch(error => {
				alert("loading courses failed " + error);
			});

		}else {
			setCourse({...props.course});
		}

		if(authors.length === 0){
			loadAuthors().catch(error => {
				alert("loading authors failed " + error);
			});
		}

	}, [props.course]) // will only run once, when the component mounts
	
	function handleChange(event) {
		const { name, value } = event.target;
		setCourse( prevCourse => ({
			...prevCourse,
			[name]: name === "authorId" ? parseInt(value, 10) : value

		}));
	}

	function formIsValid() {
		const {title, authorId, category} = course;
		const errors = {};

		if(!title) errors.title = "Title is required";
		if(!authorId) errors.author = "Author is required";
		if(!category) errors.category = "Category is required";

		setErrors(errors);

		return Object.keys(errors).length === 0;
	}

	async function handleIncr (coursesLen) {
		try {
			await incrCoursesLen(coursesLen);
		} catch (error) {
			console.log("incrementing courses length failed .. " + error.message);
		}
	}


	function handleSave(event) {
		event.preventDefault();
		if(!formIsValid()) return;
		setSaving(true);
		saveCourse(course).then( () => {
			toast.success("Course saved.");
			handleIncr(courses.length);
			history.push('/courses');
		}).catch(error => {
			setSaving(false);
			setErrors({ onSave: error.message });
		});
	}

	

	return (
		authors.length === 0 || courses.length === 0 
			? (<Spinner />) 
			: (
				<CourseForm 
					course={course}
					errors={errors} 
					authors={authors} 
					onChange={handleChange} 
					onSave={handleSave}
					saving={saving}
				/>

			) 
	);

}

ManageCoursePage.propTypes = {
	course: PropTypes.object.isRequired,
	authors: PropTypes.array.isRequired,
	courses: PropTypes.array.isRequired,
	loadCourses: PropTypes.func.isRequired,
	loadAuthors: PropTypes.func.isRequired,
	saveCourse: PropTypes.func.isRequired,
	incrCoursesLen: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired
};

// selector function
// selects specified course from redux store 
export function getCourseBySlug(courses, slug) {
	return courses.find(course => course.slug === slug) || null;
}

function mapStateToProps(state, ownProps) {
	const slug = ownProps.match.params.slug;
	const course = 
		slug && state.courses.length > 0
		? getCourseBySlug(state.courses, slug) 
		: newCourse;
	return {
		course: course,
		courses: state.courses,
		authors: state.authors, 
	}
}

const mapDispatchToProps = {
	loadCourses: courseActions.loadCourses,
	loadAuthors: authorActions.loadAuthors,
	saveCourse: courseActions.saveCourse,
	incrCoursesLen: courseActions.incrCoursesLen,
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageCoursePage);
