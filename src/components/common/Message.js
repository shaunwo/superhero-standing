const messageBarStyle = {
	padding: '20px',
	borderColor: 'red',
	borderLeft: '20px solid red',
	borderRight: '20px solid red',
	borderTop: '3px solid black',
	borderBottom: '3px solid black',
	color: 'black',
	opacity: '1',
	backgroundColor: 'white',
	marginBottom: '15px',
};

const closeButtonStyle = {
	marginLeft: '15px',
	color: 'black',
	fontWeight: 'bold',
	float: 'right',
	fontSize: '22px',
	lineHeight: '20px',
	cursor: 'pointer',
};

const Message = ({ data, id, deleteFlash }) => {
	const [type, content] = data;
	const style =
		type === 'green' || type === 'success'
			? {
					...messageBarStyle,
					borderLeft: '20px solid green',
					borderRight: '20px solid green',
			  }
			: messageBarStyle;
	return (
		<div key={id} style={style}>
			{content}
			<span style={closeButtonStyle} onClick={deleteFlash}>
				&times;
			</span>
		</div>
	);
};

export default Message;
