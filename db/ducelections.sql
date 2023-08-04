-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 04, 2023 at 10:39 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ducelections`
--

-- --------------------------------------------------------

--
-- Table structure for table `candidates`
--

CREATE TABLE `candidates` (
  `id` int(11) NOT NULL,
  `candidate_name` varchar(255) NOT NULL,
  `position_id` int(11) DEFAULT NULL,
  `tagline` varchar(255) DEFAULT NULL,
  `candidate_image` varchar(255) DEFAULT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `candidates`
--

INSERT INTO `candidates` (`id`, `candidate_name`, `position_id`, `tagline`, `candidate_image`, `date_created`, `date_updated`) VALUES
(1, 'George Asuako', 1, 'Team Asuako #Elevate', 'uploads/candidates/1_WhatsApp_Image_2023-07-17_at_18.11.03-removebg-preview.png', '2023-07-19 17:50:45', '2023-07-20 23:35:30'),
(2, 'Moses Wayome', 1, 'Team Wayome #Certainity', 'uploads/candidates/2_WhatsApp Image 2023-07-17 18.21.10.jpg', '2023-07-19 17:59:28', '2023-07-19 17:59:28'),
(3, 'Felicia Amoako', 2, 'Team Asuako #Elevate', 'uploads/candidates/3_WhatsApp Image 2023-07-17 at 18.11.03.jpg', '2023-07-19 18:03:54', '2023-07-19 18:03:54'),
(4, 'Amoako Emmanuel', 3, 'Team Wayome #Certainity', 'uploads/candidates/4_WhatsApp Image 2023-07-17 at 21.11.46.jpg', '2023-07-19 18:05:22', '2023-07-21 14:52:29');

-- --------------------------------------------------------

--
-- Table structure for table `positions`
--

CREATE TABLE `positions` (
  `id` int(11) NOT NULL,
  `position_name` varchar(255) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `positions`
--

INSERT INTO `positions` (`id`, `position_name`, `date_created`, `date_updated`) VALUES
(1, 'President', '2023-07-19 01:05:23', '2023-07-19 01:05:23'),
(2, 'Secretary', '2023-07-19 01:13:58', '2023-07-19 01:13:58'),
(3, 'P.R.O', '2023-07-19 01:17:44', '2023-07-19 18:16:19');

-- --------------------------------------------------------

--
-- Table structure for table `voters`
--

CREATE TABLE `voters` (
  `id` int(11) NOT NULL,
  `voter_name` varchar(255) NOT NULL,
  `voter_id` varchar(20) NOT NULL,
  `has_voted` tinyint(1) DEFAULT 0,
  `access_code` varchar(255) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `voters`
--

INSERT INTO `voters` (`id`, `voter_name`, `voter_id`, `has_voted`, `access_code`, `date_created`, `date_updated`) VALUES
(3, 'Abdul-Latif Mohammed', 'BSC/CSM/20222187', 0, 'zFDKRQ', '2023-07-21 00:43:46', '2023-07-21 00:43:46'),
(4, 'Emmanuel Osei', 'HNd/ict/1819337', 0, 'JzhWp4', '2023-07-21 01:36:12', '2023-07-21 01:36:12'),
(5, 'Collins College', 'HND/ICT/1819339', 0, 'Exj3yL', '2023-07-21 14:45:51', '2023-07-21 14:45:51'),
(6, 'Edmound Eduah', 'BSC/CSM/20222186', 0, 'kNF0ME', '2023-07-21 16:43:29', '2023-07-21 16:43:29');

-- --------------------------------------------------------

--
-- Table structure for table `votes`
--

CREATE TABLE `votes` (
  `id` int(11) NOT NULL,
  `voter_id` varchar(30) NOT NULL,
  `candidates_selected` text NOT NULL,
  `date_casted` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `votes`
--

INSERT INTO `votes` (`id`, `voter_id`, `candidates_selected`, `date_casted`) VALUES
(1, 'BSC/CSM/20222187', '[\"1\",\"3\",\"4\"]', '2023-07-21 00:49:41'),
(2, 'HNd/ict/1819337', '[\"2\",\"3\",\"4\"]', '2023-07-21 11:51:29'),
(3, 'HND/ICT/1819339', '[\"1\",\"3\"]', '2023-07-21 14:47:34'),
(4, 'BSC/CSM/20222186', '[\"1\",\"3\",\"4\"]', '2023-07-21 16:47:47');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `candidates`
--
ALTER TABLE `candidates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `position_id` (`position_id`);

--
-- Indexes for table `positions`
--
ALTER TABLE `positions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `voters`
--
ALTER TABLE `voters`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_voter_id` (`voter_id`);

--
-- Indexes for table `votes`
--
ALTER TABLE `votes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `voter_id` (`voter_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `candidates`
--
ALTER TABLE `candidates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `positions`
--
ALTER TABLE `positions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `voters`
--
ALTER TABLE `voters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `votes`
--
ALTER TABLE `votes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `candidates`
--
ALTER TABLE `candidates`
  ADD CONSTRAINT `candidates_ibfk_1` FOREIGN KEY (`position_id`) REFERENCES `positions` (`id`);

--
-- Constraints for table `votes`
--
ALTER TABLE `votes`
  ADD CONSTRAINT `votes_ibfk_1` FOREIGN KEY (`voter_id`) REFERENCES `voters` (`voter_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
