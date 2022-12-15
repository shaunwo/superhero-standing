import React, { useContext, useState } from 'react';
import BackendApi from '../../private/api/backend-api';
import UserContext from '../../private/auth/UserContext';
import Alert from '../common/Alert';

function ProfileForm() {
	// using context to see if the user is signed in
	const { currentUser, setCurrentUser } = useContext(UserContext);

	// setting veriables from the form fields passed in the form
	const [formData, setFormData] = useState({
		firstName: currentUser.firstName,
		lastName: currentUser.lastName,
		email: currentUser.email,
		location: currentUser.location,
		bio: currentUser.bio,
		username: currentUser.username,
		password: '',
	});

	// using state for any form errors
	const [formErrors, setFormErrors] = useState([]);

	const [saveConfirmed, setSaveConfirmed] = useState(false);

	/** on form submit:
	 * - attempt save to backend & report any errors
	 * - if successful
	 *   - clear previous error messages and password
	 *   - show save-confirmed message
	 *   - set current user info throughout the site
	 */

	// handles the update and passes to the form - with the errors, when applicable
	async function handleSubmit(evt) {
		evt.preventDefault();

		let profileData = {
			firstName: formData.firstName,
			lastName: formData.lastName,
			email: formData.email,
			password: formData.password,
			location: formData.location,
			bio: formData.bio,
		};

		let username = formData.username;
		let updatedUser;

		try {
			updatedUser = await BackendApi.saveProfile(
				username,
				profileData
			);
		} catch (errors) {
			setFormErrors(errors);
			return;
		}

		// reset form data
		setFormData((f) => ({ ...f, password: '' }));

		// reset form errors
		setFormErrors([]);

		// trigger the "success" alert message the appears at the bottom of the form
		setSaveConfirmed(true);

		// trigger reloading of user information throughout the site
		setCurrentUser(updatedUser);
	}

	// updating the form fields
	function handleChange(evt) {
		const { name, value } = evt.target;
		setFormData((f) => ({
			...f,
			[name]: value,
		}));
		setFormErrors([]);
	}

	// displaying the edit profile form on the screen
	return (
		<>
			<h1 className="mb-3">Profile</h1>
			<div className="card">
				<div className="card-body">
					<form>
						<div className="form-group">
							<label>Username</label>
							<p className="form-control-plaintext">
								{formData.username}
							</p>
						</div>
						<div className="form-group">
							<label>First Name</label>
							<input
								name="firstName"
								className="form-control"
								value={formData.firstName}
								onChange={handleChange}
							/>
						</div>
						<div className="form-group">
							<label>Last Name</label>
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
								name="email"
								className="form-control"
								value={formData.email}
								onChange={handleChange}
							/>
						</div>
						<div className="form-group">
							<label>Location</label>
							<input
								name="location"
								className="form-control"
								value={formData.location}
								onChange={handleChange}
							/>
						</div>
						<div className="form-group">
							<label>Bio</label>
							<textarea
								name="bio"
								className="form-control"
								value={formData.bio}
								onChange={handleChange}
								rows="3"
								cols="40"
							/>
						</div>
						<div className="form-group">
							<label>
								Confirm password to make changes:
							</label>
							<input
								type="password"
								name="password"
								className="form-control"
								value={formData.password}
								onChange={handleChange}
							/>
						</div>

						{formErrors.length ? (
							<Alert type="danger" messages={formErrors} />
						) : null}

						{saveConfirmed ? (
							<Alert
								type="success"
								messages={['Updated successfully.']}
							/>
						) : null}

						<button
							className="btn btn-primary btn-block mt-4"
							onClick={handleSubmit}
						>
							Save Changes
						</button>
					</form>
				</div>
			</div>
		</>
	);
}

export default ProfileForm;
