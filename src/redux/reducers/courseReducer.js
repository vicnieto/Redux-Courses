import * as types from "../actions/actionTypes";
import initialState from './initialState';

export default function courseReducer(state=initialState.courses, action) {
	switch(action.type){
		case types.CREATE_COURSE_SUCCESS: 
			return [...state, { ...action.course }];
		case types.UPDATE_COURSE_SUCCESS:
			return state.map(course => course.id === action.course.id ? action.course : course);
		case types.LOAD_COURSES_SUCCESS:
			return action.courses;
		case types.DELETE_COURSE_OPTIMISTIC:
			return state.filter(course => course.id !== action.course.id);
		case types.FILTER_BY_AUTHOR_SUCCESS: {
			action.courses.sort((c1, c2) => {
				const title1 = c1.authorName.toLowerCase();
				const title2 = c2.authorName.toLowerCase();
				if (title1 < title2) return -1;
				if (title1 > title2) return 1;
				return 0

			});
			return action.courses;
		}

		case types.FILTER_BY_TITLE_SUCCESS: {
			action.courses.sort((c1, c2) => {
				const title1 = c1.title.toLowerCase();
				const title2 = c2.title.toLowerCase();
				if (title1 < title2) return -1;
				if (title1 > title2) return 1;
				return 0

			});
			return action.courses;
		}

		default:
			return state;
	}
}