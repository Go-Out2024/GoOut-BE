
import firebaseAdmin from 'firebase-admin';
import * as googleService from '../docs/google-services.json'


export const firebase = firebaseAdmin.initializeApp({

	credential : firebaseAdmin.credential.cert(googleService as firebaseAdmin.ServiceAccount)
    });