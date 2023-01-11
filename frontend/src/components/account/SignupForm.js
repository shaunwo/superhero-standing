import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '../common/Alert';

/** Signup form.
 *
 * Shows form and manages update to state on changes.
 * On submission:
 * - calls signup function prop
 * - redirects to /companies route
 *
 * Routes -> SignupForm -> Alert
 * Routed as /signup
 */

function SignupForm({ signup }) {
	const navigate = useNavigate();

	// setting veriables from the form fields passed in the form
	const [formData, setFormData] = useState({
		username: '',
		password: '',
		firstName: '',
		lastName: '',
		email: '',
	});

	// using state for any form errors
	const [formErrors, setFormErrors] = useState([]);

	console.debug(
		'SignupForm',
		'signup=',
		typeof signup,
		'formData=',
		formData,
		'formErrors=',
		formErrors
	);

	// handles the login and passes to the CompaniesList, if authenticated... otherwise, passes back to form with the errors
	async function handleSubmit(evt) {
		evt.preventDefault();
		let result = await signup(formData);
		if (result.success) {
			navigate('/search');
		} else {
			setFormErrors(result.errors);
		}
	}

	// updating the form fields
	function handleChange(evt) {
		const { name, value } = evt.target;
		setFormData((data) => ({ ...data, [name]: value }));
	}

	// displaying the signup form on the screen
	return (
		<div className="SignupForm">
			<div className="container col-md-8 offset-md-2 col-lg-6 offset-lg-3">
				<h1 className="mb-3">Sign Up</h1>
				<div className="card">
					<div className="card-body">
						<form onSubmit={handleSubmit}>
							<div className="form-group">
								<label>Username</label>
								<input
									name="username"
									className="form-control"
									value={formData.username}
									onChange={handleChange}
								/>
							</div>
							<div className="form-group">
								<label>Password</label>
								<input
									type="password"
									name="password"
									className="form-control"
									value={formData.password}
									onChange={handleChange}
								/>
							</div>

							<div className="form-group">
								<label>First name</label>
								<input
									name="firstName"
									className="form-control"
									value={formData.firstName}
									onChange={handleChange}
								/>
							</div>
							<div className="form-group">
								<label>Last name</label>
								<input
									name="lastName"
									className="form-control"
									value={formData.lastName}
									onChange={handleChange}
								/>
							</div>
							<div className="form-group">
								<label>Email</label>
								<input
									type="email"
									name="email"
									className="form-control"
									value={formData.email}
									onChange={handleChange}
								/>
							</div>

							{formErrors.length ? (
								<Alert
									type="danger"
									messages={formErrors}
								/>
							) : null}

							<button
								type="submit"
								className="btn btn-primary float-right"
								onSubmit={handleSubmit}
							>
								Submit
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

export default SignupForm;
