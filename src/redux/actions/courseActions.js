import * as types from "./actionTypes";
import * as courseApi from "../../api/courseApi";
import { beginApiCall, apiCallError } from './apiStatusActions';


export function loadCoursesSuccess(courses) {
	return { type: types.LOAD_COURSES_SUCCESS, courses }
}

export function createCourseSuccess(course) {
	return { type: types.CREATE_COURSE_SUCCESS, course }
}

export function updateCourseSuccess(course) {
	return { type: types.UPDATE_COURSE_SUCCESS, course }
}

export function deleteCourseOptimistic(course) {
	return { type: types.DELETE_COURSE_OPTIMISTIC, course };
}

export function filterByAuthorSuccess(courses) {
	return { type: types.FILTER_BY_AUTHOR_SUCCESS, courses }
}

export function filterByTitleSuccess(courses) {
	return { type: types.FILTER_BY_TITLE_SUCCESS, courses }
}

export function setCoursesLen(coursesLen) {
	return { type: types.SET_COURSES_LEN, coursesLen }
}

export function incrCoursesLenSuccess(coursesLen) {
	return { type: types.INCR_COURSES_LEN, coursesLen }
}

export function decrCoursesLenSuccess(coursesLen) {
	return { type: types.DECR_COURSES_LEN, coursesLen }
}

export function incrCoursesLen(coursesLen) {
	return function(dispatch) {
		return dispatch(incrCoursesLenSuccess(coursesLen));
	}
}

export function decrCoursesLen(coursesLen){
	return function(dispatch) {
		return dispatch(decrCoursesLenSuccess(coursesLen));
	}
}

export function filterByAuthor(courses) {
	return function(dispatch) {
		return dispatch(filterByAuthorSuccess(courses));
	}
}

export function filterByTitle(courses) {
	return function(dispatch) {
		return dispatch(filterByTitleSuccess(courses))
	}
}


export function loadCourses() {
	return function(dispatch) {
		dispatch(beginApiCall());
		return courseApi.getCourses().then(courses => {
			dispatch(setCoursesLen(courses.length));
			dispatch(loadCoursesSuccess(courses));

		}).catch(error => {
			dispatch(apiCallError(error));
			throw error;
		});
	}
}

export function deleteCourse(course) {
	return function (dispatch) {

		dispatch(deleteCourseOptimistic(course));
		return courseApi.deleteCourse(course.id);
	};
}

export function saveCourse(course) {

	return function(dispatch, getState) {
		dispatch(beginApiCall());
		return courseApi.saveCourse(course).then(savedCourse => {
			course.id
				? dispatch(updateCourseSuccess(savedCourse))
				: dispatch(createCourseSuccess(savedCourse));
		})
			.catch(error => {
				dispatch(apiCallError(error));
				throw error;
			});

	};
}