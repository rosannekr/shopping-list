DROP TABLE if exists `items`;
DROP TABLE if exists `weeks`;
DROP TABLE if exists `products`;
DROP TABLE if exists `users`;

CREATE TABLE `items` (
	`id` INT NOT NULL AUTO_INCREMENT UNIQUE,
	`completed` DATE,
	`weekId` INT NOT NULL,
	`productID` INT NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `weeks` (
	`id` INT NOT NULL AUTO_INCREMENT UNIQUE,
	`start` DATE NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `products` (
	`id` INT NOT NULL AUTO_INCREMENT UNIQUE,
	`name` varchar(255) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `users`(
	`id` INT NOT NULL AUTO_INCREMENT, 
	`username` VARCHAR(255) NOT NULL, 
	`password` VARCHAR(255) NOT NULL, 
	PRIMARY KEY (id)
);

ALTER TABLE `items` ADD CONSTRAINT `items_fk0` FOREIGN KEY (`weekId`) REFERENCES `weeks`(`id`);

ALTER TABLE `items` ADD CONSTRAINT `items_fk1` FOREIGN KEY (`productID`) REFERENCES `products`(`id`);
