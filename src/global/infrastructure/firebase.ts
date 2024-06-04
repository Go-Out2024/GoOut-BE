
import firebaseAdmin from 'firebase-admin';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const googleService = require('../docs/firebase-admin.json');

export const firebase = firebaseAdmin.initializeApp({
	credential : firebaseAdmin.credential.cert(googleService)
    });