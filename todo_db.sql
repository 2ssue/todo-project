-- MySQL Script generated by MySQL Workbench
-- Tue Oct  8 14:15:41 2019
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema todo_db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema todo_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `todo_db` DEFAULT CHARACTER SET utf8 ;
USE `todo_db` ;

-- -----------------------------------------------------
-- Table `todo_db`.`USER`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `todo_db`.`USER` ;

CREATE TABLE IF NOT EXISTS `todo_db`.`USER` (
  `userid` VARCHAR(20) NOT NULL,
  `password` VARCHAR(20) NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `admin` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`userid`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `todo_db`.`BOARD_LIST`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `todo_db`.`BOARD_LIST` ;

CREATE TABLE IF NOT EXISTS `todo_db`.`BOARD_LIST` (
  `board_id` VARCHAR(20) NOT NULL,
  `access_state` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`board_id`),
  CONSTRAINT `board_id`
    FOREIGN KEY (`board_id`)
    REFERENCES `todo_db`.`USER` (`userid`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `todo_db`.`COLUMNS`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `todo_db`.`COLUMNS` ;

CREATE TABLE IF NOT EXISTS `todo_db`.`COLUMNS` (
  `column_id` VARCHAR(21) NOT NULL,
  `board_id` VARCHAR(20) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  INDEX `fk_COLUMNS_BOARD_LIST1_idx` (`board_id` ASC),
  PRIMARY KEY (`column_id`),
  CONSTRAINT `fk_COLUMNS_BOARD_LIST1`
    FOREIGN KEY (`board_id`)
    REFERENCES `todo_db`.`BOARD_LIST` (`board_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `todo_db`.`BOARD`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `todo_db`.`BOARD` ;

CREATE TABLE IF NOT EXISTS `todo_db`.`BOARD` (
  `board_id` VARCHAR(20) NOT NULL,
  `card_id` INT NOT NULL AUTO_INCREMENT,
  `column_id` VARCHAR(21) NOT NULL,
  `content` TEXT NOT NULL,
  `file_src` TEXT NULL,
  `prev_card_id` INT NULL,
  PRIMARY KEY (`card_id`),
  INDEX `fk_BOARD_BOARD_LIST1_idx` (`board_id` ASC),
  INDEX `fk_BOARD_COLUMNS1_idx` (`column_id` ASC),
  CONSTRAINT `fk_BOARD_BOARD_LIST1`
    FOREIGN KEY (`board_id`)
    REFERENCES `todo_db`.`BOARD_LIST` (`board_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_BOARD_COLUMNS1`
    FOREIGN KEY (`column_id`)
    REFERENCES `todo_db`.`COLUMNS` (`column_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `todo_db`.`BOARD_AUTH`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `todo_db`.`BOARD_AUTH` ;

CREATE TABLE IF NOT EXISTS `todo_db`.`BOARD_AUTH` (
  `board_id` VARCHAR(20) NOT NULL,
  `userid` VARCHAR(20) NOT NULL,
  `access_auth` VARCHAR(1) NOT NULL,
  INDEX `fk_BOARD_AUTH_BOARD_LIST1_idx` (`board_id` ASC),
  CONSTRAINT `fk_BOARD_AUTH_BOARD_LIST1`
    FOREIGN KEY (`board_id`)
    REFERENCES `todo_db`.`BOARD_LIST` (`board_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `todo_db`.`BOARD_LOG`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `todo_db`.`BOARD_LOG` ;

CREATE TABLE IF NOT EXISTS `todo_db`.`BOARD_LOG` (
  `log_id` INT NOT NULL AUTO_INCREMENT,
  `board_id` VARCHAR(20) NOT NULL,
  `card` TEXT NOT NULL,
  `userid` VARCHAR(20) NOT NULL,
  `action` VARCHAR(45) NOT NULL,
  `prev` VARCHAR(45) NULL,
  `at` VARCHAR(45) NULL,
  PRIMARY KEY (`log_id`),
  INDEX `fk_BOARD_LOG_BOARD_LIST1_idx` (`board_id` ASC),
  CONSTRAINT `fk_BOARD_LOG_BOARD_LIST1`
    FOREIGN KEY (`board_id`)
    REFERENCES `todo_db`.`BOARD_LIST` (`board_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

INSERT INTO USER (userid, password, name, admin) VALUES ('admin', 'rootadmin', 'admin', 1);