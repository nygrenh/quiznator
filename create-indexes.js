db.oauthaccesstokens.createIndex({ userId: 1, clientId: 1 }, { unique: true });
db.oauthaccesstokens.createIndex({ accessToken: 1 });

db.oauthrefreshtokens.createIndex({ userId: 1, clientId: 1 }, { unique: true });
db.oauthrefreshtokens.createIndex({ refreshToken: 1 });

db.oauthclients.createIndex({ clientId: 1 }, { unique: true });

db.quizanswers.createIndex({ quizId: 1, createdAt: -1, answererId: 1 });

db.quizzes.createIndex({ userId: 1 });
