CREATE TABLE `travel_tips` (
	`id` int AUTO_INCREMENT NOT NULL,
	`kind` enum('event','location') NOT NULL,
	`title` varchar(180) NOT NULL,
	`description` text NOT NULL,
	`location` varchar(255) NOT NULL,
	`externalUrl` varchar(1024) NOT NULL,
	`categories` json NOT NULL,
	`startsAt` timestamp,
	`endsAt` timestamp,
	`openingHours` varchar(255),
	`imageKey` varchar(512),
	`imageUrl` varchar(1024),
	`isPublished` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `travel_tips_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
