ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY 'root';

/***CREATING ALL TABLES*/
CREATE TABLE `tom`.`product` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `stock` INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`));

CREATE TABLE `tom`.`order` (
  `id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`));


CREATE TABLE `tom`.`order_line` (
  `product_id` INT NOT NULL,
  `order_id` INT NOT NULL,
  `quantity` INT UNSIGNED NOT NULL,
  INDEX `fk_order_id_idx` (`order_id` ASC),
  INDEX `fk_product_id_idx` (`product_id` ASC),
  CONSTRAINT `fk_order_id`
    FOREIGN KEY (`order_id`)
    REFERENCES `tom`.`order` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_product_id`
    FOREIGN KEY (`product_id`)
    REFERENCES `tom`.`product` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
/******************************************************************/






