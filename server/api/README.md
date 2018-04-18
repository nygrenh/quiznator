### Get all available tags
`/tags`

**query params**:

`[?tags=TAG,TAG2...]` match ALL given tags or match all if none given

**returns**:

`[ tags ]` 

*optional*: userid (24-digit hex) set in headers to query only the tags on specific quiz set

### Get quizzes with given tag(s)
`/tags/quizzes`

**query params**:

`[?tags=TAG,TAG2...]` match ALL given tags or match all if none given

**returns**:

`[ array of quizzes with given tag(s) ]`

Needs dashboard authentication

### Get statistics from quizzes
`/quizzes/stats/`

**query params**:

`[?tags=TAG,TAG2...]` match ALL given tags or match all if none given

`[?onlyConfirmed=true|false]`: only confirmed (or answered essays), defaults to false

**returns**:

`[{ 
	quizId: quizId, 
	tags: [ tags ], 
	answererIds: [ answerer ids ], 
	onlyConfirmed: true|false, 
	count: # of answerers, 
	totalTries: # of total tries
 }, ...]`

Needs dashboard authentication

### Get statistics from current TMC user
`/quizzes/stats/user`

**query params**:

`[?tags=TAG,TAG2...]`: match ALL given tags or match all if none given

`[?onlyConfirmed=true|false]`: only confirmed answers (or answered essays), defaults to false

**returns**:

`{ 
	id: userid, 
	tags: [ tags ], 
	answered: [ 
		<quizID>: [
			answerIds: [ ids of answers for this quiz ]
			tries: [ total tries ]
			  ]
		...
	], 
	onlyConfirmed: true|false, 
	count: # of quizzes answered, 
	total: # of quizzes with given tags 
}` 

Needs current user set in authentication

*optional*: userid set in headers to query only specific quiz set

### Get answers by tag
`/quizzes/answers-by-tag/user`

**query params**: 

`?tags=TAG[,TAG1...]`: match ALL given tags

**returns**:

`[ array of confirmed answers, ie. confirmed essays and correct answers for others, limited to one per quiz ]`

Needs dashboard authentication
