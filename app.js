// Define a function to calculate the weighted average for a learner.
function calculateWeightedAverage(assignments, submissions) {
    let totalScore = 0;
    let totalPossible = 0;

    for (const assignment of assignments) {
        const submission = submissions.find((sub) => sub.assignment_id === assignment.id);

        if (submission && submission.submission && submission.submission.score >= 0) {
            const assignmentScore = submission.submission.score;
            const pointsPossible = assignment.points_possible;
            const late = new Date(submission.submission.submitted_at) > new Date(assignment.due_at);

            if (late) {
                // Deduct 10% if submission is late
                assignmentScore -= 0.1 * pointsPossible;
            }

            totalScore += assignmentScore;
            totalPossible += pointsPossible;
        }
    }

    if (totalPossible === 0) {
        return 0; // Handle division by zero
    }

    const weightedAverage = totalScore / totalPossible;
    console.log("Calculated Weighted Average:", weightedAverage);
    return weightedAverage;
}

// Define the main function to get learner data.
function getLearnerData(course, ag, submissions) {
    if (ag.course_id !== course.id) {
        throw new Error("AssignmentGroup does not belong to the specified course.");
    }

    const learnerData = {};

    for (const submission of submissions) {
        if (!learnerData[submission.learner_id]) {
            learnerData[submission.learner_id] = {
                id: submission.learner_id,
                avg: 0,
            };
        }

        const learner = learnerData[submission.learner_id];

        // Calculate the weighted average for the learner.
        const weightedAverage = calculateWeightedAverage(ag.assignments, submissions);
        learner.avg = weightedAverage;

        if (
            submission.assignment_id &&
            submission.submission &&
            submission.submission.score >= 0
        ) {
            const assignmentId = submission.assignment_id;
            const assignmentScore = submission.submission.score;
            const pointsPossible = ag.assignments.find((a) => a.id === assignmentId).points_possible;

            // Calculate the percentage score for the assignment.
            const assignmentPercentage = assignmentScore / pointsPossible;

            learner[assignmentId] = assignmentPercentage;
        }
    }

    // Convert the learner data object into an array of objects.
    const result = Object.values(learnerData);
    console.log("Final Learner Data:", result);
    return result;
}

// Test data
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript",
};

const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
        {
            id: 1,
            name: "Declare a Variable",
            due_at: "2023-01-25",
            points_possible: 50,
        },
        {
            id: 2,
            name: "Write a Function",
            due_at: "2023-02-27",
            points_possible: 150,
        },
        {
            id: 3,
            name: "Code the World",
            due_at: "3156-11-15",
            points_possible: 500,
        },
    ],
};

const LearnerSubmissions = [
    {
        learner_id: 125,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-25",
            score: 47,
        },
    },
    {
        learner_id: 125,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-02-12",
            score: 150,
        },
    },
    {
        learner_id: 125,
        assignment_id: 3,
        submission: {
            submitted_at: "2023-01-15",  
            score: 400,
        },
    },
    {
        learner_id: 132,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-24",
            score: 39,
        },
    },
    {
        learner_id: 132,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-03-07",
            score: 140,
        },
    },
];

// Call the function and log the result
const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
console.log(result);