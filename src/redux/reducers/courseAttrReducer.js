import * as types from "../actions/actionTypes";
import initialState from './initialState';

export default function courseAttrReducer(state=initialState.numCourses, action) {
	switch(action.type) {
		case types.SET_COURSES_LEN:
			return action.coursesLen;
		case types.INCR_COURSES_LEN:
			return action.coursesLen + 1;
		case types.DECR_COURSES_LEN:
			return action.coursesLen - 1;
		default:
			return state;
	}
}