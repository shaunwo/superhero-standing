import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '../common/Alert';

/** Login form.
 *
 * Shows form and manages update to state on changes.
 * On submission:
 * - calls login function prop
 * - redirects to /companies route
 *
 * Routes -> LoginForm -> Alert
 * Routed as /login
 */

function LoginForm({ login }) {
	const navigate = useNavigate();

	// setting veriables from the form fields passed in the form
	const [formData, setFormData] = useState({
		username: '',
		password: '',
	});

	// using state for any form errors
	const [formErrors, setFormErrors] = useState([]);

	console.debug(
		'LoginForm',
		'login=',
		typeof login,
		'formData=',
		formData,
		'formErrors',
		formErrors
	);

	// handles the login and passes to the CompaniesList, if authenticated... otherwise, passes back to form with the errors
	async function handleSubmit(evt) {
		evt.preventDefault();
		console.log(formData);
		let result = await login(formData);
		if (result.success) {
			navigate('/home');
			//window.location.href = '/home';
		} else {
			setFormErrors(result.errors);
		}
	}

	// updating the form fields
	function handleChange(evt) {
		const { name, value } = evt.target;
		setFormData((l) => ({ ...l, [name]: value }));
	}

	// displaying the login form on the screen
	return (
		<div className="LoginForm">
			<div className="container col-md-8 offset-md-2 col-lg-6 offset-lg-3">
				<h1 className="mb-3">Log In</h1>

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
									autoComplete="username"
									required
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
									autoComplete="current-password"
									required
								/>
							</div>

							{formErrors.length ? (
								<Alert
									type="danger"
									messages={formErrors}
								/>
							) : null}

							<button
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

export default LoginForm;
