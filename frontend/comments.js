import React from 'react';

function commentCard(id, parentId, indent) {
	return (
		<div class="card" style="margin-left: {indent}px">
			<div class="card-body">
				<p class="card-text">{comment.comments}</p>
			</div>
			<div class="card-footer">
				Likes [heart icon that will change from outline to solid if
				the current user has liked that comment, and display the
				count next to it] | Reply [link to reply to this comment]
			</div>
		</div>
	);
}

// pulling comments from DB
let indentLevel = 0;
let currentParentId = null;
while (comments) {
	if (comments.parentId && currentParentId === null) {
		indentLevel += 10;
		currentParentId = comments.parentId;
	} else if (comments.parent != currentParentId) {
		if (indentLevel >= 10) {
			indentLevel -= 10;
		} else {
			indentLevel += 10;
		}
		currentParentId = comments.parentId;
	} else {
		indentLevel = 0;
	}
	commentCard(comments.id, comments.parentId, indent);
}

export default commentCard;
