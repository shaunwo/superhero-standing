import React, { useState } from 'react';

function ImageTest() {
	const [image, setImage] = useState('');
	function handleImage(e) {
		console.log(e.target.files);
		setImage(e.target.files[0]);
	}
	return (
		<div>
			<input type="file" name="file" onChange={handleImage} />
			<button>Submit</button>
		</div>
	);
}

export default ImageTest;
