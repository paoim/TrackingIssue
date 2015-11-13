ALTER TABLE `issue` CHANGE `description` `fix` text NULL;
ALTER TABLE `issue` CHANGE `comments` `problem` text NULL;
ALTER TABLE `history_issue` CHANGE `HISTORY_ID` `PROBLEM_ID` bigint(20) NOT NULL;
ALTER TABLE `history_issue` CHANGE `versionComment` `versionProblem` text NULL;
ALTER TABLE `history_issue` DROP `description`;
ALTER TABLE `history_issue` ADD `partNum` varchar(255) NULL;
ALTER TABLE `todo` ADD `partNum` varchar(255) NULL;
/**ALTER TABLE `history_issue` RENAME `historical_problem`;**/
RENAME TABLE `history_issue` TO `historical_problem`;
update `todo` set `ISSUE_ID` = -1 where `TODO_ID` > 0;