import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as authorActions from '../../redux/actions/authorActions';
import * as courseActions from '../../redux/actions/courseActions';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import CourseList from './CourseList';
import Spinner from '../common/Spinner';
import { toast } from 'react-toastify';


class CoursesPage extends React.Component {

	state = {
		redirectToAddCoursePage: false,
		courseDeleted: false,
		courseAdded: false
	};

	componentDidMount() {

		const { courses, authors, actions, numCourses } = this.props;

		if (courses.length === 0) {

			actions.loadCourses().catch(error => {
				alert("loading courses failed " + error);
			});

		}
		if (authors.length === 0) {
			actions.loadAuthors().catch(error => {
				alert("loading authors failed " + error);
			});
		}
	}

	handleFilter = async filterStr => {

		if (filterStr === 'title') {
			try {
				await this.props.actions.filterByTitle(this.props.courses);
			} catch (error) {
				toast.error("filter by title failed .. " + error.message, { autoClose: false });
			}

		} else if (filterStr === 'author') {
			try {
				await this.props.actions.filterByAuthor(this.props.courses);
			} catch (error) {
				toast.error("filter by author fialed .. " + error.message, { autoClose: false });
			}
		} else {
			toast.error("No corresponding action for this filter " + filterStr);
		}


	};

	handleDecr = async (coursesLen) => {
		try 
		{
			await this.props.actions.decrCoursesLen(coursesLen);
		}
		catch (error)
		{
			console.log("decrementing courses length failed... " + error.message);
		}
	}

	handleDeleteCourse = async course => {
		try {
			await this.props.actions.deleteCourse(course).then(this.handleDecr(this.props.numCourses)).then(toast.success("Course deleted"));

		} catch (error) {
			toast.error("Delete failed.. " + error.message, { autoClose: false });
		}
	}

	


	render() {
		return (
			<>
				{this.state.redirectToAddCoursePage && <Redirect to="/course" />}
				<h2>Courses</h2>

				{this.props.loading
					? <Spinner />
					: (
						<>

							<div className="dropdown" style={{ marginRight: 5, marginBottom: 20 }}>
								<button className="btn btn-secondary dropdown-toggle"
									type="button" 
									id="dropdownMenuButton" 
									data-toggle="dropdown" 
									aria-haspopup="true" 
									aria-expanded="false">
										Filter
								</button>
								<div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
									<a className="dropdown-item" 
										href="#" 
										onClick={() => this.handleFilter('title')}>
											Title
									</a>
									<a className="dropdown-item" 
									href="#"
									onClick={() => this.handleFilter('author')}>
										Author
									</a>
								</div>
							</div>

							<button
								style={{ marginBottom: 20 }}
								className="btn btn-primary add-course"
								onClick={() => this.setState({ redirectToAddCoursePage: true })}
							>
								Add Course
							</button>
							<div className="text-muted"
								style = {{ marginLeft: 5, marginBottom: 10 }}>
									{this.props.numCourses} courses currently active
							</div>

							<CourseList
								onDeleteClick={this.handleDeleteCourse}
								courses={this.props.courses}
							/>
						</>
					)}


			</>

		);
	}
}

CoursesPage.propTypes = {
	authors: PropTypes.array.isRequired,
	courses: PropTypes.array.isRequired,
	actions: PropTypes.object.isRequired,
	loading: PropTypes.bool.isRequired,
	numCourses: PropTypes.number.isRequired
};

function mapStateToProps(state) {
	return {
		courses: state.authors.length === 0 ? [] : state.courses.map(course => {
			return {
				...course,
				authorName: state.authors.find(a => a.id === course.authorId).name,
			}
		}),
		authors: state.authors,
		loading: state.apiCallsInProgress > 0,
		numCourses: state.numCourses
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: {
			loadCourses: bindActionCreators(courseActions.loadCourses, dispatch),
			loadAuthors: bindActionCreators(authorActions.loadAuthors, dispatch),
			deleteCourse: bindActionCreators(courseActions.deleteCourse, dispatch),
			filterByAuthor: bindActionCreators(courseActions.filterByAuthor, dispatch),
			filterByTitle: bindActionCreators(courseActions.filterByTitle, dispatch),
			decrCoursesLen: bindActionCreators(courseActions.decrCoursesLen, dispatch),
			incrCoursesLen: bindActionCreators(courseActions.incrCoursesLen, dispatch)
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CoursesPage);