import _get from 'lodash.get'

import { 
    FETCH_PRIVACY_AGREEMENT, 
    FETCH_PRIVACY_AGREEMENT_SUCCESS, 
    FETCH_PRIVACY_AGREEMENT_FAIL,
    STORE_PRIVACY_AGREEMENT_LOCAL_STORAGE_KEY
} from 'state/privacy-agreement';

const fetchUserQuizKeys = (quizId, userId) => {
    return Object.keys(window.localStorage)
        .filter(key => key.startsWith(`${quizId}-${userId}`))
        .map(key => window.localStorage[key])
}

const privacyAgreementLogic = store => next => action => {
    switch (action.type) {
        case STORE_PRIVACY_AGREEMENT_LOCAL_STORAGE_KEY:
            const accepted = action.payload.data
            const { userId, quizId } = action
            const currentAgreement = window.localStorage.getItem('research-agreement') || '{}'
            const oldAgreement = JSON.parse(currentAgreement)
            const agreement = Object.assign(oldAgreement, { [quizId]: { ...oldAgreement[quizId], [userId]: accepted } }) 

            window.localStorage.setItem('research-agreement', JSON.stringify(agreement))
            return next(Object.assign({}, action, { agreement }))
        case FETCH_PRIVACY_AGREEMENT_FAIL:
            console.log("middleware fail", action);
        case FETCH_PRIVACY_AGREEMENT:

        default:
            return next(action);
    }
}

export default privacyAgreementLogic;