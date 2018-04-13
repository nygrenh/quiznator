import _get from 'lodash.get'

import { 
    FETCH_PRIVACY_AGREEMENT, 
    FETCH_PRIVACY_AGREEMENT_SUCCESS, 
    FETCH_PRIVACY_AGREEMENT_FAIL,
    STORE_PRIVACY_AGREEMENT_LOCAL_STORAGE_KEY,
    REFRESH_PRIVACY_AGREEMENT
} from 'state/privacy-agreement';

const privacyAgreementLogic = store => next => action => {
    switch (action.type) {
        case STORE_PRIVACY_AGREEMENT_LOCAL_STORAGE_KEY:
            const { accepted } = action.payload.data
            var { userId, quizId } = action
            const currentAgreement = window.localStorage.getItem('research-agreement') || '{}'
            const oldAgreement = JSON.parse(currentAgreement)
            const agreement = Object.assign(oldAgreement, { [quizId]: { ...oldAgreement[quizId], [userId]: accepted } }) 

            window.localStorage.setItem('research-agreement', JSON.stringify(agreement))
            return next(Object.assign({}, action, { agreement }))
        case REFRESH_PRIVACY_AGREEMENT:
            console.log('middleware refresh')
            return next(action)
        case FETCH_PRIVACY_AGREEMENT_FAIL:
            // console.log("middleware fail", action);
            return next(action);
        case FETCH_PRIVACY_AGREEMENT:
            const { privacyAgreements, quizzes } = store.getState();
            console.log('fpa', action)
            console.log('state', store.getState())
            // TODO: unnecessary requests
            var { quizId, userId } = action;
            
            console.log('in fpa middleware', privacyAgreements)
            // const agreementIsBeingLoaded = !!privacyAgreements[quizId] && privacyAgreements[quizId].userId === userId;
            // const quizIsLoaded = quizzes[quizId] & quizzes[quizId].data

            return next(action);
        default:
            return next(action);
    }
}

export default privacyAgreementLogic;