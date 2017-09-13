// Initialize Firebase
var config = {
    apiKey: "AIzaSyB5uRi6z6TPKoInnqQtA6CP0NiynJQ3ODs",
    authDomain: "test-b6502.firebaseapp.com",
    databaseURL: "https://test-b6502.firebaseio.com",
    projectId: "test-b6502",
    storageBucket: "test-b6502.appspot.com",
    messagingSenderId: "274224757515"
};
firebase.initializeApp(config);

angular
    .module('blankApp')
    .factory('firebaseFac', function () {
        const rootRef = firebase.database().ref();
        return rootRef;
    });