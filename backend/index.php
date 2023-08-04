<?php

// Allow CORS for all domains (*)
header("Access-Control-Allow-Origin: *");

include "server.php";

$server = new Requests("root", "", "localhost", "DUCElections");

$q = isset($_GET['q']) ? $_GET['q'] : '';

switch ($q) {
    case 'addPosition':
        $server->addPosition();
        break;

    case 'editPosition':
        $server->editPosition();
        break;

    case 'getAllPositions':
        $server->getAllPositions();
        break;

    case 'deletePosition':
        $server->deletePosition();
        break;

    case 'addCandidate':
        $server->addCandidate();
        break;

    case 'getAllCandidates':
        $server->getAllCandidates();
        break;

    case 'editCandidate':
        $server->editCandidate();
        break;

    case 'deleteCandidate':
        $server->deleteCandidate();
        break;

    case 'addVoter':
        $server->addVoter();
        break;

    case 'getAllVoters':
        $server->getAllVoters();
        break;

    case 'editVoter':
        $server->editVoter();
        break;

    case 'deleteVoter':
        $server->deleteVoter();
        break;

    case 'getPositionsAndCandidates':
        $server->getPositionsAndCandidates();
        break;

    case 'castVote':
        $server->castVote();
        break;

    case 'voterLogin':
        $server->voterLogin();
        break;

    case 'checkVoter':
        $server->checkVoter();
        break;

    case 'getPositionCandidatesAndVotes':
        $server->getPositionCandidatesAndVotes();
        break;

    case 'getDashboardSummary':
        $server->getDashboardSummary();
        break;
    

    default:
        # code...
        break;
}

?>