db.oauthauthorizationcodes.createIndex({ authCode: 1 }, { unique: true });

db.oauthaccesstokens.createIndex({ userId: 1, clientId: 1 });
db.oauthaccesstokens.createIndex({ accessToken: 1 }, { unique: true });

db.oauthrefreshtokens.createIndex({ userId: 1, clientId: 1 });
db.oauthrefreshtokens.createIndex({ refreshToken: 1 }, { unique: true });

db.oauthclients.createIndex({ clientId: 1 }, { unique: true });

db.quizanswers.createIndex({ quizId: 1, createdAt: -1, answererId: 1 });

db.quizzes.createIndex({ userId: 1 });

db.users.createIndex({ email: 1 }, { unique: true });
