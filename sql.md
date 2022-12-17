
# MAKEOUT SQL

```sql

CREATE USER 'makeout'@'localhost' IDENTIFIED BY 'makeout';
GRANT ALL PRIVILEGES ON * . * TO 'makeout'@'localhost';
FLUSH PRIVILEGES;

CREATE DATABASE makeout;

USE makeout;

drop table user;
CREATE TABLE `user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NULL,
  `password` VARCHAR(60) NULL,
  `birthdate` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));
  
CREATE TABLE `r_user` (
  `id` INT NOT NULL,
  `id_user_1` INT NOT NULL,
  `id_user_2` INT NOT NULL,
  `choice` TINYINT NULL,
  PRIMARY KEY (`id`),
  INDEX `user 1_idx` (`id_user_1` ASC) VISIBLE,
  INDEX `user_2_idx` (`id_user_2` ASC) VISIBLE,
  CONSTRAINT `user 1`
    FOREIGN KEY (`id_user_1`)
    REFERENCES `user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `user_2`
    FOREIGN KEY (`id_user_2`)
    REFERENCES `user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
    
    
ALTER TABLE `makeout`.`r_user` 
CHANGE COLUMN `id` `id` INT NOT NULL AUTO_INCREMENT ;
```
