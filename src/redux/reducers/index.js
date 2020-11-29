import { combineReducers } from 'redux';
import courses from './courseReducer';
import authors from './authorReducer';
import apiCallsInProgress from './apiStatusReducer';
import courseAttrs from './courseAttrReducer';

const rootReducer = combineReducers({
	courses: courses,
	authors: authors,
	apiCallsInProgress: apiCallsInProgress,
	numCourses: courseAttrs
});

export default rootReducer;
