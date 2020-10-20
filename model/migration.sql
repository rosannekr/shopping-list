CREATE TABLE `allItems` (
	`itemId` INT NOT NULL AUTO_INCREMENT UNIQUE,
	`dateCompleted` DATE,
	`weekId` INT NOT NULL,
	`productID` INT NOT NULL,
	PRIMARY KEY (`itemId`)
);

CREATE TABLE `Weeks` (
	`weekId` INT NOT NULL AUTO_INCREMENT UNIQUE,
	`weekStart` DATE NOT NULL,
	`weekEnd` DATE NOT NULL,
	PRIMARY KEY (`weekId`)
);

CREATE TABLE `products` (
	`ProductId` INT NOT NULL AUTO_INCREMENT UNIQUE,
	`foodName` varchar(255) NOT NULL,
	PRIMARY KEY (`ProductId`)
);

ALTER TABLE `allItems` ADD CONSTRAINT `allItems_fk0` FOREIGN KEY (`weekId`) REFERENCES `Weeks`(`weekId`);

ALTER TABLE `allItems` ADD CONSTRAINT `allItems_fk1` FOREIGN KEY (`productID`) REFERENCES `products`(`ProductId`);

