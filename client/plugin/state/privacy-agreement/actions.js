import _get from 'lodash.get';

import { createTemporalAlert } from 'state/quiz-alerts';

export const POST_PRIVACY_AGREEMENT = 'PRIVACY_AGREEMENT::POST_PRIVACY_AGREEMENT';
export const POST_PRIVACY_AGREEMENT_SUCCESS = 'PRIVACY_AGREEMENT::POST_PRIVACY_AGREEMENT_SUCCESS';
export const POST_PRIVACY_AGREEMENT_FAIL = 'PRIVACY_AGREEMENT::POST_PRIVACY_AGREEMENT_FAIL';
export const STORE_PRIVACY_AGREEMENT_LOCAL_STORAGE_KEY = "PRIVACY_AGREEMENT::STORE_PRIVACY_AGREEMENT_LOCAL_STORAGE_KEY";
export const FETCH_PRIVACY_AGREEMENT = 'PRIVACY_AGREEMENT::FETCH_PRIVACY_AGREEMENT';
export const FETCH_PRIVACY_AGREEMENT_SUCCESS = 'PRIVACY_AGREEMENT::FETCH_PRIVACY_AGREEMENT_SUCCESS';
export const FETCH_PRIVACY_AGREEMENT_FAIL = 'PRIVACY_AGREEMENT::FETCH_PRIVACY_AGREEMENT_FAIL';

export function createPrivacyAgreement({ quizId, data }) {
    return (dispatch, getState) => {
        const { user, quizzes } = getState();

        const quiz = _get(quizzes, `${quizId}.data`);
        const meta = _get(quiz, 'data.meta');

        if(!user.id || !quiz) {
            return Promise.resolve();
        }

        dispatch(createPrivacyAgreementLocalStorageKey({ userId: user.id, quizId, data }))

        return dispatch(createPrivacyAgreementRequest({ quizId, data, meta }));
        
/*         return dispatch(createPrivacyAgreementRequest({ quizId, data, meta }))
            .then(action => {
                console.log('action from createpa', action)
                dispatch(createTemporalAlert({ quizId, type: 'success', content: 'Your answer has been saved' }))
            })
            .catch(err => console.log(error)); // debug
 */    }
}

export function getPrivacyAgreement({ quizId }) {
    return (dispatch, getState) => {
        const { user } = getState();

        return dispatch(fetchPrivacyAgreement({ userId: user.id, quizId }))
            .then(action => {
                console.log("fetch success!", action.payload.data)
                // debug: let's not create when fetching
                // dispatch(createPrivacyAgreementLocalStorageKey({ userId: user.id, data: action.payload.data }));
            })
            .catch(err => console.log(err))
        }
}

export function createPrivacyAgreementRequest({ quizId, data, meta }) {
    return {
        type: POST_PRIVACY_AGREEMENT,
        quizId,
        payload: {
            request: {
                url: `/quizzes/${quizId}/privacy-agreement`,
                method: 'POST',
                data: {
                    data,
                    meta
                }
            }
        }
    }
}

export function createPrivacyAgreementLocalStorageKey({ userId, quizId, data }) {
    return {
        type: STORE_PRIVACY_AGREEMENT_LOCAL_STORAGE_KEY,
        userId,
        quizId,
        payload: {
            data
        }
    }
}

export function fetchPrivacyAgreement({ userId, quizId }) {
    return {
        type: FETCH_PRIVACY_AGREEMENT,
        quizId,
        userId,
        payload: {
            request: {
                url: `/quizzes/${quizId}/privacy-agreement/${userId}`,
                method: 'GET'
            }
        }

    }
}