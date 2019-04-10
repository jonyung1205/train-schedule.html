$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyApXWDcBoo_E_y-vBXpyqqtKn4-InDGnq4",
        authDomain: "train-schedule-5c021.firebaseapp.com",
        databaseURL: "https://train-schedule-5c021.firebaseio.com",
        projectId: "train-schedule-5c021",
        storageBucket: "train-schedule-5c021.appspot.com",
        messagingSenderId: "211812447285"
    };

    firebase.initializeApp(config);

    // Variable for database reference
    var database = firebase.database();

    // Variables for the train
    var vesselName;
    var destination;
    var firstVessel;
    var frequency = 0;

    // Adds information about the train when the user presses the button
    $("#add-train").on("click", function () {
        event.preventDefault();

        // Store and retrieve new train data
        vesselName = $("#vessel-name").val().trim();
        destination = $("#destination").val().trim();
        firstVessel = $("#first-vessel").val().trim();
        frequency = $("#frequency").val().trim();

        // Pushing to database
        database.ref().push({
            vesselName: vesselName,
            destination: destination,
            firstVessel: firstVessel,
            frequency: frequency,
        });
    });

    // Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
    database.ref().on("child_added", function (snapshot) {
        // Console.log the "snapshot" value (a point-in-time representation of the database)
        console.log(snapshot);

        // Log everything that's coming out of the snapshot
        console.log(snapshot.val().vesselName);
        console.log(snapshot.val().destination);
        console.log(snapshot.val().firstVessel);
        console.log(snapshot.val().frequency);

        // Change the HTML to reflect
        $("#vesselName").text(snapshot.val().vesselName);
        $("#destination").text(snapshot.val().destination);
        $("#firstVessel").text(snapshot.val().firstVessel);
        $("#frequency").text(snapshot.val().frequency);

        // Assumptions
        var tFrequency = parseInt(snapshot.val().frequency, 10)

        // Time is 3:30 AM
        var firstTime = snapshot.val().firstVessel;

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
        console.log(firstTimeConverted);

        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % tFrequency;
        console.log(tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = tFrequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

        // Train Time
        var trainTime = (moment(nextTrain).format("HH:mm"));
        console.log("TRAIN TIME: " + moment(trainTime).format("hh:mm"));

        // Table Display
        $("#table-display").append(
            "<tr><td>" + snapshot.val().vesselName +
            "</td><td>" + snapshot.val().destination +
            "</td><td>" + snapshot.val().frequency +
            "</td><td>" + trainTime +
            "</td><td>" + tMinutesTillTrain + ' </td></tr>');

        // If any errors are found, register them in the console.
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });
});