<?php

include "dbconn.php";

class Requests extends dbConnect
{

    function addPosition()
    {
        $position = $_POST['position'];

        // Check if the position already exists
        $query = "SELECT COUNT(*) AS count FROM positions WHERE position_name = '$position'";
        $result = mysqli_query($this->connect(), $query);

        if ($result) {
            $row = mysqli_fetch_assoc($result);
            $count = $row['count'];

            if ($count > 0) {
                $response = array(
                    'status' => false,
                    'message' => 'Position already exists.'
                );
            } else {
                // Position does not exist, insert it into the database
                $insertQuery = "INSERT INTO positions (position_name) VALUES ('$position')";
                $insertResult = mysqli_query($this->connect(), $insertQuery);

                if ($insertResult) {
                    $response = array(
                        'status' => true,
                        'message' => 'Position added successfully.'
                    );
                } else {
                    $response = array(
                        'status' => false,
                        'message' => 'Failed to add position.'
                    );
                }
            }
        } else {
            $response = array(
                'status' => false,
                'message' => 'Database query error.'
            );
        }

        echo json_encode($response);
    }

    function editPosition()
    {
        $positionID = $_POST['positionId'];
        $newPositionName = $_POST['position'];

        // Check if the position already exists
        $checkQuery = "SELECT COUNT(*) AS count FROM positions WHERE position_name = '$newPositionName' AND id != $positionID";
        $checkResult = mysqli_query($this->connect(), $checkQuery);

        if ($checkResult) {
            $row = mysqli_fetch_assoc($checkResult);
            $count = $row['count'];

            if ($count > 0) {
                $response = array(
                    'status' => false,
                    'message' => 'Position already exists.'
                );
            } else {
                // Update the position in the database
                $updateQuery = "UPDATE positions SET position_name = '$newPositionName' WHERE id = $positionID";
                $updateResult = mysqli_query($this->connect(), $updateQuery);

                if ($updateResult) {
                    $response = array(
                        'status' => true,
                        'message' => 'Position updated successfully.'
                    );
                } else {
                    $response = array(
                        'status' => false,
                        'message' => 'Failed to update position.'
                    );
                }
            }
        } else {
            $response = array(
                'status' => false,
                'message' => 'Database query error.'
            );
        }

        echo json_encode($response);
    }

    function deletePosition()
    {
        $positionID = $_GET['PID'];

        // Delete the position from the database
        $deleteQuery = "DELETE FROM positions WHERE id = $positionID";
        $deleteResult = mysqli_query($this->connect(), $deleteQuery);

        if ($deleteResult) {
            $response = array(
                'status' => true,
                'message' => 'Position deleted successfully.'
            );
        } else {
            $response = array(
                'status' => false,
                'message' => 'Failed to delete position.'
            );
        }

        echo json_encode($response);
    }


    function getAllPositions()
    {
        $query = "SELECT * FROM positions";
        $result = mysqli_query($this->connect(), $query);

        $positions = array();

        if ($result) {
            while ($row = mysqli_fetch_assoc($result)) {
                $positions[] = $row;
            }

            $response = array(
                'status' => true,
                'message' => 'Positions retrieved successfully.',
                'data' => $positions
            );
        } else {
            $response = array(
                'status' => false,
                'message' => 'Failed to retrieve positions.',
                'data' => null
            );
        }

        echo json_encode($response);
    }

    function addCandidate()
    {
        $candidateName = $_POST['candidateName'];
        $positionId = $_POST['positionSelect'];
        $description = $_POST['candidateDescription'];
        $candidateImage = $_FILES['candidateImage'];

        $dbServerConn = $this->connect();

        // Check if the candidate already exists
        $query = "SELECT COUNT(*) AS count FROM candidates WHERE candidate_name = '$candidateName'";
        $result = mysqli_query($dbServerConn, $query);

        if ($result) {
            $row = mysqli_fetch_assoc($result);
            $count = $row['count'];

            if ($count > 0) {
                $response = array(
                    'status' => false,
                    'message' => 'Candidate already exists.'
                );
            } else {
                // Candidate does not exist, insert it into the database
                $insertQuery = "INSERT INTO candidates (candidate_name, position_id, tagline) VALUES ('$candidateName', '$positionId', '$description')";
                $insertResult = mysqli_query($dbServerConn, $insertQuery);

                if ($insertResult) {
                    // Get the candidate ID of the inserted candidate
                    $candidateId = mysqli_insert_id($dbServerConn);

                    // Generate a unique image name using the candidate ID
                    $imageName = $candidateId . '_' . $candidateImage['name'];

                    // Set the destination path to save the image
                    $destinationPath = 'uploads/candidates/' . $imageName;

                    // Move the uploaded image to the destination path
                    move_uploaded_file($candidateImage['tmp_name'], $destinationPath);

                    // Update the candidate record with the image path
                    $updateQuery = "UPDATE candidates SET candidate_image = '$destinationPath' WHERE id = $candidateId";
                    $updateResult = mysqli_query($dbServerConn, $updateQuery);

                    if ($updateResult) {
                        $response = array(
                            'status' => true,
                            'message' => 'Candidate added successfully.'
                        );
                    } else {
                        $response = array(
                            'status' => false,
                            'message' => 'Failed to update candidate image path.'
                        );
                    }
                } else {
                    $response = array(
                        'status' => false,
                        'message' => 'Failed to add candidate.'
                    );
                }
            }
        } else {
            $response = array(
                'status' => false,
                'message' => 'Database query error.'
            );
        }

        echo json_encode($response);
    }

    function getAllCandidates()
    {
        $dbServerConn = $this->connect();

        $query = "SELECT c.*, p.position_name FROM candidates c
                  INNER JOIN positions p ON c.position_id = p.id";
        $result = mysqli_query($dbServerConn, $query);

        if ($result) {
            $candidates = mysqli_fetch_all($result, MYSQLI_ASSOC);

            $response = array(
                'status' => true,
                'message' => 'Candidates retrieved successfully.',
                'candidates' => $candidates
            );
        } else {
            $response = array(
                'status' => false,
                'message' => 'Failed to retrieve candidates.'
            );
        }

        echo json_encode($response);
    }

    function editCandidate()
    {
        $candidateId = $_POST['candidateId'];
        $candidateName = $_POST['candidateName'];
        $positionId = $_POST['positionSelect'];
        $description = $_POST['candidateDescription'];
        $candidateImage = $_FILES['candidateImage'];

        $dbServerConn = $this->connect();

        // Update the candidate details in the database
        $updateQuery = "UPDATE candidates SET candidate_name = '$candidateName', position_id = '$positionId', tagline = '$description' WHERE id = $candidateId";
        $updateResult = mysqli_query($dbServerConn, $updateQuery);

        if ($updateResult) {
            // Check if a new image was uploaded
            if (!empty($candidateImage['name'])) {
                // Generate a unique image name using the candidate ID
                $imageName = $candidateId . '_' . $candidateImage['name'];

                // Set the destination path to save the image
                $destinationPath = 'uploads/candidates/' . $imageName;

                // Move the uploaded image to the destination path
                move_uploaded_file($candidateImage['tmp_name'], $destinationPath);

                // Update the candidate record with the new image path
                $updateImageQuery = "UPDATE candidates SET candidate_image = '$destinationPath' WHERE id = $candidateId";
                $updateImageResult = mysqli_query($dbServerConn, $updateImageQuery);

                if ($updateImageResult) {
                    $response = array(
                        'status' => true,
                        'message' => 'Candidate updated successfully.'
                    );
                } else {
                    $response = array(
                        'status' => false,
                        'message' => 'Failed to update candidate image path.'
                    );
                }
            } else {
                $response = array(
                    'status' => true,
                    'message' => 'Candidate updated successfully.'
                );
            }
        } else {
            $response = array(
                'status' => false,
                'message' => 'Failed to update candidate details.'
            );
        }

        echo json_encode($response);
    }

    function deleteCandidate()
    {
        $candidateId = $_GET['candidateId'];

        $dbServerConn = $this->connect();

        // Delete the candidate from the database
        $deleteQuery = "DELETE FROM candidates WHERE id = $candidateId";
        $deleteResult = mysqli_query($dbServerConn, $deleteQuery);

        if ($deleteResult) {
            $response = array(
                'status' => true,
                'message' => 'Candidate deleted successfully.'
            );
        } else {
            $response = array(
                'status' => false,
                'message' => 'Failed to delete candidate.'
            );
        }

        echo json_encode($response);
    }

    function addVoter()
    {
        $voterName = $_POST['voterName'];
        $voterID = $_POST['voterId'];
        $accessCode = $_POST['accessCode'];

        // Check if the voter ID already exists
        $checkQuery = "SELECT COUNT(*) AS count FROM voters WHERE voter_id = '$voterID'";
        $checkResult = mysqli_query($this->connect(), $checkQuery);

        if ($checkResult) {
            $row = mysqli_fetch_assoc($checkResult);
            $count = $row['count'];

            if ($count > 0) {
                $response = array(
                    'status' => false,
                    'message' => 'Voter ID already exists.'
                );
            } else {
                // Voter ID does not exist, insert the voter into the database
                $insertQuery = "INSERT INTO voters (voter_name, voter_id, access_code) VALUES ('$voterName', '$voterID', '$accessCode')";
                $insertResult = mysqli_query($this->connect(), $insertQuery);

                if ($insertResult) {
                    $response = array(
                        'status' => true,
                        'message' => 'Voter added successfully.'
                    );
                } else {
                    $response = array(
                        'status' => false,
                        'message' => 'Failed to add voter.'
                    );
                }
            }
        } else {
            $response = array(
                'status' => false,
                'message' => 'Database query error.'
            );
        }

        echo json_encode($response);
    }

    function getAllVoters()
    {
        $query = "SELECT * FROM voters";
        $result = mysqli_query($this->connect(), $query);

        if ($result) {
            $voters = array();

            while ($row = mysqli_fetch_assoc($result)) {
                $voters[] = $row;
            }

            $response = array(
                'status' => true,
                'message' => 'Voters retrieved successfully.',
                'voters' => $voters
            );
        } else {
            $response = array(
                'status' => false,
                'message' => 'Failed to retrieve voters.'
            );
        }

        echo json_encode($response);
    }

    function editVoter()
    {
        $rowId = $_POST['rowId']; // The ID of the row in the table
        $voterId = $_POST['voterId'];
        $newVoterName = $_POST['voterName'];
        $newAccessCode = $_POST['accessCode'];

        $dbServerConn = $this->connect();

        // Check if the row ID exists in the voters table
        $checkQuery = "SELECT COUNT(*) AS count FROM voters WHERE id = $rowId";
        $checkResult = mysqli_query($dbServerConn, $checkQuery);

        if ($checkResult) {
            $row = mysqli_fetch_assoc($checkResult);
            $count = $row['count'];

            if ($count > 0) {
                // Check if the new voter ID already exists
                $voterIdCheckQuery = "SELECT COUNT(*) AS count FROM voters WHERE voter_id = '$voterId' AND id != $rowId";
                $voterIdCheckResult = mysqli_query($dbServerConn, $voterIdCheckQuery);
                $voterIdRow = mysqli_fetch_assoc($voterIdCheckResult);
                $voterIdCount = $voterIdRow['count'];

                if ($voterIdCount > 0) {
                    $response = array(
                        'status' => false,
                        'message' => 'Voter ID already exists.'
                    );
                } else {
                    // Row exists and the new voter ID is not used by another row, update the voter's details based on the row ID
                    $updateQuery = "UPDATE voters SET voter_name = '$newVoterName', voter_id = '$voterId', access_code = '$newAccessCode' WHERE id = $rowId";
                    $updateResult = mysqli_query($dbServerConn, $updateQuery);

                    if ($updateResult) {
                        $response = array(
                            'status' => true,
                            'message' => 'Voter details updated successfully.'
                        );
                    } else {
                        $response = array(
                            'status' => false,
                            'message' => 'Failed to update voter details.'
                        );
                    }
                }
            } else {
                $response = array(
                    'status' => false,
                    'message' => 'Row ID does not exist in the voters table.'
                );
            }
        } else {
            $response = array(
                'status' => false,
                'message' => 'Database query error.'
            );
        }

        echo json_encode($response);
    }


    function deleteVoter()
{
    $rowId = $_GET['rowId'];

    // Check if the row ID exists
    $checkQuery = "SELECT COUNT(*) AS count FROM voters WHERE id = $rowId";
    $checkResult = mysqli_query($this->connect(), $checkQuery);

    if ($checkResult) {
        $row = mysqli_fetch_assoc($checkResult);
        $count = $row['count'];

        if ($count > 0) {
            // Row ID exists, delete the voter
            $deleteQuery = "DELETE FROM voters WHERE id = $rowId";
            $deleteResult = mysqli_query($this->connect(), $deleteQuery);

            if ($deleteResult) {
                $response = array(
                    'status' => true,
                    'message' => 'Voter deleted successfully.'
                );
            } else {
                $response = array(
                    'status' => false,
                    'message' => 'Failed to delete voter.'
                );
            }
        } else {
            $response = array(
                'status' => false,
                'message' => 'Row ID does not exist.'
            );
        }
    } else {
        $response = array(
            'status' => false,
            'message' => 'Database query error.'
        );
    }

    echo json_encode($response);
}

function getPositionsAndCandidates()
{
    $dbServerConn = $this->connect();

    // Get all positions
    $positionsQuery = "SELECT * FROM positions";
    $positionsResult = mysqli_query($dbServerConn, $positionsQuery);

    if ($positionsResult) {
        $positions = array();

        // Fetch all positions
        $positionsData = mysqli_fetch_all($positionsResult, MYSQLI_ASSOC);

        foreach ($positionsData as $positionData) {
            $positionId = $positionData['id'];
            $positionName = $positionData['position_name'];

            // Get candidates for each position
            $candidatesQuery = "SELECT * FROM candidates WHERE position_id = $positionId";
            $candidatesResult = mysqli_query($dbServerConn, $candidatesQuery);

            if ($candidatesResult) {
                $candidatesData = mysqli_fetch_all($candidatesResult, MYSQLI_ASSOC);

                $candidates = array_map(function ($candidateData) {
                    return array(
                        'id' => $candidateData['id'],
                        'name' => $candidateData['candidate_name'],
                        'description' => $candidateData['tagline'],
                        'image' => $candidateData['candidate_image'],
                    );
                }, $candidatesData);

                // Add the position and its candidates to the positions array
                $position = array(
                    'id' => $positionId,
                    'name' => $positionName,
                    'candidates' => $candidates,
                );

                $positions[] = $position;
            }
        }

        // Return the positions array containing all positions and their candidates
        $response = array(
            'status' => true,
            'message' => 'Positions and candidates retrieved successfully.',
            'data' => $positions,
        );
    } else {
        $response = array(
            'status' => false,
            'message' => 'Failed to fetch positions and candidates from the database.',
            'data' => array(),
        );
    }

    // Send the response as JSON
    echo json_encode($response);
}

function castVote()
{
    $voterID = $_POST['voterId'];
    $selectedCandidates = $_POST['selectedCandidates'];

    // Check if the voter ID exists in the voters table
    $checkVoterQuery = "SELECT COUNT(*) AS count FROM voters WHERE voter_id = '$voterID'";
    $checkVoterResult = mysqli_query($this->connect(), $checkVoterQuery);

    if ($checkVoterResult) {
        $row = mysqli_fetch_assoc($checkVoterResult);
        $count = $row['count'];

        if ($count > 0) {
            // Check if the voter has already voted
            $checkVoteQuery = "SELECT COUNT(*) AS count FROM votes WHERE voter_id = '$voterID'";
            $checkVoteResult = mysqli_query($this->connect(), $checkVoteQuery);

            if ($checkVoteResult) {
                $row = mysqli_fetch_assoc($checkVoteResult);
                $count = $row['count'];

                if ($count > 0) {
                    $response = array(
                        'status' => false,
                        'message' => 'You have already voted.'
                    );
                } else {
                    // Voter has not voted, proceed to insert the vote into the votes table
                    $insertQuery = "INSERT INTO votes (voter_id, candidates_selected) VALUES ('$voterID', '$selectedCandidates')";
                    $insertResult = mysqli_query($this->connect(), $insertQuery);

                    if ($insertResult) {
                        $response = array(
                            'status' => true,
                            'message' => 'Vote cast successfully.'
                        );
                    } else {
                        $response = array(
                            'status' => false,
                            'message' => 'Failed to cast vote.'
                        );
                    }
                }
            } else {
                $response = array(
                    'status' => false,
                    'message' => 'Database query error.'
                );
            }
        } else {
            $response = array(
                'status' => false,
                'message' => 'Voter ID does not exist.'
            );
        }
    } else {
        $response = array(
            'status' => false,
            'message' => 'Database query error.'
        );
    }

    echo json_encode($response);
}

function voterLogin()
{
    $voterID = $_POST['voterId'];
    $accessCode = $_POST['accessCode'];

    // Check if the voter ID exists in the voters table
    $checkVoterQuery = "SELECT COUNT(*) AS count, access_code FROM voters WHERE voter_id = '$voterID'";
    $checkVoterResult = mysqli_query($this->connect(), $checkVoterQuery);

    if ($checkVoterResult) {
        $row = mysqli_fetch_assoc($checkVoterResult);
        $count = $row['count'];

        if ($count > 0) {
            $storedAccessCode = $row['access_code'];

            // Check if the provided access code matches the stored access code
            if ($accessCode === $storedAccessCode) {
                // Check if the voter has already voted
                $checkVoteQuery = "SELECT COUNT(*) AS count FROM votes WHERE voter_id = '$voterID'";
                $checkVoteResult = mysqli_query($this->connect(), $checkVoteQuery);

                if ($checkVoteResult) {
                    $voteRow = mysqli_fetch_assoc($checkVoteResult);
                    $voteCount = $voteRow['count'];

                    if ($voteCount > 0) {
                        $response = array(
                            'status' => false,
                            'message' => 'You have already voted.'
                        );
                    } else {
                        $response = array(
                            'status' => true,
                            'message' => 'Voter login successful.'
                        );
                    }
                } else {
                    $response = array(
                        'status' => false,
                        'message' => 'Database query error.'
                    );
                }
            } else {
                $response = array(
                    'status' => false,
                    'message' => 'Invalid access code.'
                );
            }
        } else {
            $response = array(
                'status' => false,
                'message' => 'Voter ID does not exist.'
            );
        }
    } else {
        $response = array(
            'status' => false,
            'message' => 'Database query error.'
        );
    }

    echo json_encode($response);
}

function checkVoter()
{
    $voterID = $_GET['voterId'];

    // Check if the voter ID exists in the voters table
    $checkVoterQuery = "SELECT * FROM voters WHERE voter_id = '$voterID'";
    $checkVoterResult = mysqli_query($this->connect(), $checkVoterQuery);

    if (mysqli_num_rows($checkVoterResult) > 0) {
        $row = mysqli_fetch_assoc($checkVoterResult);

        // Check if the voter has already voted
        $checkVoteQuery = "SELECT COUNT(*) AS count FROM votes WHERE voter_id = '$voterID'";
        $checkVoteResult = mysqli_query($this->connect(), $checkVoteQuery);

        if ($checkVoteResult) {
            $voteRow = mysqli_fetch_assoc($checkVoteResult);
            $voteCount = $voteRow['count'];

            if ($voteCount > 0) {
                $response = array(
                    'status' => false,
                    'message' => 'You have already voted.',
                    'voterDetails' => $row
                );
            } else {
                $response = array(
                    'status' => true,
                    'message' => 'Voter details retrieved successfully.',
                    'voterDetails' => $row
                );
            }
        } else {
            $response = array(
                'status' => false,
                'message' => 'Database query error.'
            );
        }
    } else {
        $response = array(
            'status' => false,
            'message' => 'Voter ID does not exist.'
        );
    }

    echo json_encode($response);
}

function getPositionCandidatesAndVotes()
{
    // Get all positions
    $positionsQuery = "SELECT * FROM positions";
    $positionsResult = mysqli_query($this->connect(), $positionsQuery);

    $positionsData = array();

    if ($positionsResult) {
        while ($positionRow = mysqli_fetch_assoc($positionsResult)) {
            $positionId = $positionRow['id'];
            $positionName = $positionRow['position_name'];

            // Get candidates for each position
            $candidatesQuery = "SELECT * FROM candidates WHERE position_id = '$positionId'";
            $candidatesResult = mysqli_query($this->connect(), $candidatesQuery);

            $candidatesData = array();

            if ($candidatesResult) {
                while ($candidateRow = mysqli_fetch_assoc($candidatesResult)) {
                    $candidateId = $candidateRow['id'];
                    $candidateName = $candidateRow['candidate_name'];

                    // Get votes for each candidate
                    $votesQuery = "SELECT * FROM votes";
                    $votesResult = mysqli_query($this->connect(), $votesQuery);

                    $totalVotes = 0;
                    $candidateVotes = 0;
                    if ($votesResult) {
                        while ($voteRow = mysqli_fetch_assoc($votesResult)) {
                            $voterID = $voteRow['voter_id'];
                            $candidatesSelected = json_decode($voteRow['candidates_selected'], true);

                            if (in_array($candidateId, $candidatesSelected)) {
                                $candidateVotes++;
                            }
                            $totalVotes += 1;
                        }
                    }

                    // Calculate the percentage
                    $percentage = ($totalVotes > 0) ? (($candidateVotes / $totalVotes) * 100) : 0;

                    $candidatesData[] = array(
                        'id' => $candidateId,
                        'name' => $candidateName,
                        'votes' => $candidateVotes,
                        'percentage' => round($percentage, 2) // Rounded to 2 decimal places,
                    );
                }
            }

            $positionsData[] = array(
                'id' => $positionId,
                'name' => $positionName,
                'candidates' => $candidatesData
            );
        }

        $response = array(
            'status' => true,
            'message' => 'Position, candidates, and votes retrieved successfully.',
            'positionsData' => $positionsData
        );
    } else {
        $response = array(
            'status' => false,
            'message' => 'Failed to retrieve data from the database.'
        );
    }

    echo json_encode($response);
}

function getDashboardSummary(){
    $candidatesCountQuery = "SELECT COUNT(*) as total_candidates FROM candidates";
    $candidatesCount = mysqli_query($this->connect(),$candidatesCountQuery);
    $total_candidates = mysqli_fetch_assoc($candidatesCount);

    $votersCountQuery = "SELECT COUNT(*) as total_voters FROM voters";
    $votersCount = mysqli_query($this->connect(),$votersCountQuery);
    $total_voters = mysqli_fetch_assoc($votersCount);

    $response = array(
        'status' => true,
        'total_candidates' => $total_candidates['total_candidates'],
        'total_voters' => $total_voters['total_voters']
    );
    
    echo json_encode($response);
}

}

?>