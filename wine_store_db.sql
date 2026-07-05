-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: wine_store_db
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` text DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `parent_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKt8o6pivur7nn124jehx7cygw5` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (9,'Rượu vang đỏ','Red Wine','https://i.pinimg.com/736x/5f/68/aa/5f68aabde38bae7fcaf74fcdcdc8d90a.jpg',NULL),(10,'Rượu vang trắng','White Wine','https://i.pinimg.com/736x/cb/62/9c/cb629c12f0b97a387edbefbf8a4999cf.jpg',NULL),(11,'Rượu vang hồng','Rosé Wine','https://i.pinimg.com/736x/49/bf/83/49bf83b2bf6aac58488535907d9ad2a5.jpg',NULL),(12,'Sâm panh','Champagne','https://i.pinimg.com/1200x/5d/f6/a2/5df6a25130b08cebeff1e9e5644a86a0.jpg',NULL),(13,'Rượu vang sủi bọt','Sparkling Wine','https://i.pinimg.com/736x/22/70/93/2270937732163751f9d9572f9dbdba5d.jpg',NULL),(14,'Rượu vang ngọt','Sweet Wine','https://i.pinimg.com/1200x/59/f1/44/59f1444ea1c124057c64ab658ad4a70e.jpg',NULL),(15,'Rượu hoa quả','Fruit Wine','https://i.pinimg.com/736x/c0/8d/c0/c08dc05f961cf26fda13f251cdab39bd.jpg',NULL),(16,'Rượu sức khỏe','Health Wine','https://i.pinimg.com/1200x/f4/1f/e2/f41fe299cd539ac9e26eabce42aece61.jpg',NULL),(17,'Whisky','Whisky','https://i.pinimg.com/1200x/f0/42/42/f0424236c2f8bfdd4859bd360d721188.jpg',NULL),(18,'Cognac','Cognac','https://i.pinimg.com/1200x/c6/a2/3b/c6a23b6f1342452b48bf78c7a5618301.jpg',NULL),(19,'Rượu Sake','Sake','https://i.pinimg.com/736x/51/09/8a/51098a04cb81a504b574dc2038bddba9.jpg',NULL),(20,'Vodka','Vodka','https://i.pinimg.com/1200x/99/fd/c2/99fdc2c8679166942435b11f41722d9d.jpg',NULL),(21,'Phụ kiện rượu vang (Dụng cụ mở rượu, ly...)','Accessories','https://i.pinimg.com/1200x/29/47/84/294784587ee4d052001ba8d5fdda0e55.jpg',NULL),(22,'Ly rượu','Glassware','https://i.pinimg.com/736x/e5/0e/ee/e50eeed02e5d4b5859a1e21ba0f24bca.jpg',NULL);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `coupons` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `active` bit(1) DEFAULT NULL,
  `code` varchar(255) NOT NULL,
  `discount_percent` double NOT NULL,
  `expiry_date` date DEFAULT NULL,
  `max_usage` int(11) DEFAULT NULL,
  `used_count` int(11) DEFAULT NULL,
  `discount_type` varchar(255) NOT NULL,
  `discount_value` double NOT NULL,
  `minimum_order` double DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKeplt0kkm9yf2of2lnx6c1oy9b` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
INSERT INTO `coupons` VALUES (4,'','GIAM GIA MUA HE',1000000,'2026-07-31',15,0,'FIXED',0,10,'2026-07-04');
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedbacks`
--

DROP TABLE IF EXISTS `feedbacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `feedbacks` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `replied_at` datetime(6) DEFAULT NULL,
  `reply_message` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedbacks`
--

LOCK TABLES `feedbacks` WRITE;
/*!40000 ALTER TABLE `feedbacks` DISABLE KEYS */;
INSERT INTO `feedbacks` VALUES (1,'2026-01-10 07:20:59.000000','aaa@gmail.com','aaa','Tu van giup toi ','09876544213','NEW','Sự kiện',NULL,NULL),(2,'2026-01-10 08:27:41.000000','guest@winestore.com','Khách hàng ẩn danh','[1 SAO] - Cam nhan rat te',NULL,'NEW','Rượu Mơ Yên Tử Premium',NULL,NULL),(4,'2026-01-31 06:10:53.000000','guest@winestore.com','Khách hàng ẩn danh','[1 SAO] - On\n',NULL,'NEW','Moët & Chandon Imperial Brut',NULL,NULL);
/*!40000 ALTER TABLE `feedbacks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_logs`
--

DROP TABLE IF EXISTS `inventory_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `inventory_logs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `action_type` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `new_stock` int(11) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `previous_stock` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `wine_id` bigint(20) NOT NULL,
  `order_id` bigint(20) DEFAULT NULL,
  `quantity_changed` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKmpfvuw445ardux6566ykebskr` (`wine_id`),
  CONSTRAINT `FKmpfvuw445ardux6566ykebskr` FOREIGN KEY (`wine_id`) REFERENCES `wines` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_logs`
--

LOCK TABLES `inventory_logs` WRITE;
/*!40000 ALTER TABLE `inventory_logs` DISABLE KEYS */;
INSERT INTO `inventory_logs` VALUES (1,'RESTOCK','2026-05-25 08:34:39.000000',6,'Nhập hàng bổ sung',0,6,26,NULL,NULL),(2,'RESTOCK','2026-06-07 07:50:58.000000',16,'Test restock',6,10,26,NULL,NULL),(3,'RESTOCK','2026-06-07 07:58:50.000000',36,'Nhập kho bổ sung',16,20,26,NULL,NULL),(4,'SALE','2026-06-07 08:03:11.000000',99,'Xuất kho - Đơn hàng #17 đã xác nhận',100,-1,5,17,NULL),(5,'SALE','2026-06-07 08:03:11.000000',149,'Xuất kho - Đơn hàng #17 đã xác nhận',150,-1,16,17,NULL),(6,'SALE','2026-06-07 08:03:11.000000',29,'Xuất kho - Đơn hàng #17 đã xác nhận',30,-1,15,17,NULL),(7,'SALE','2026-06-07 08:03:18.000000',98,'Xuất kho - Đơn hàng #16 đã xác nhận',99,-1,5,16,NULL),(8,'SALE','2026-06-07 08:03:18.000000',148,'Xuất kho - Đơn hàng #16 đã xác nhận',149,-1,16,16,NULL),(9,'SALE','2026-06-07 08:03:18.000000',28,'Xuất kho - Đơn hàng #16 đã xác nhận',29,-1,15,16,NULL),(10,'SALE','2026-06-07 09:08:18.000000',27,'Xuất kho - Đơn hàng #38 đã xác nhận',28,-1,15,38,NULL),(11,'SALE','2026-06-07 09:08:18.000000',35,'Xuất kho - Đơn hàng #38 đã xác nhận',36,-1,26,38,NULL),(12,'SALE','2026-06-07 09:08:18.000000',29,'Xuất kho - Đơn hàng #38 đã xác nhận',30,-1,25,38,NULL),(13,'SALE','2026-06-07 09:09:06.000000',34,'Xuất kho - Đơn hàng #39 đã xác nhận',35,-1,26,39,NULL),(14,'SALE','2026-06-07 09:17:50.000000',89,'Xuất kho - Đơn hàng #40 đã xác nhận',90,-1,20,40,NULL),(15,'SALE','2026-06-07 09:17:50.000000',39,'Xuất kho - Đơn hàng #40 đã xác nhận',40,-1,17,40,NULL),(16,'SALE','2026-06-07 09:25:26.000000',14,'Xuất kho - Đơn hàng #41 đã xác nhận',15,-1,3,41,NULL),(17,'SALE','2026-06-07 09:32:56.000000',13,'Xuất kho - Đơn hàng #42 đã xác nhận',14,-1,3,42,NULL),(18,'SALE','2026-06-07 09:39:28.000000',12,'Xuất kho - Đơn hàng #43 đã xác nhận',13,-1,3,43,NULL),(19,'SALE','2026-06-07 09:39:28.000000',29,'Xuất kho - Đơn hàng #43 đã xác nhận',30,-1,8,43,NULL),(20,'SALE','2026-06-10 10:59:00.000000',28,'Xuất kho - Đơn hàng #47 đã xác nhận',29,-1,25,47,NULL),(21,'SALE','2026-06-10 10:59:00.000000',19,'Xuất kho - Đơn hàng #47 đã xác nhận',20,-1,23,47,NULL),(22,'SALE','2026-06-10 10:59:00.000000',44,'Xuất kho - Đơn hàng #47 đã xác nhận',45,-1,22,47,NULL),(23,'SALE','2026-06-10 11:51:06.000000',76,'Xuất kho - Đơn hàng #49 đã xác nhận',80,-4,11,49,NULL),(24,'SALE','2026-06-10 12:18:35.000000',27,'Xuất kho - Đơn hàng #48 đã xác nhận',28,-1,25,48,NULL),(25,'SALE','2026-06-10 12:49:17.000000',71,'Xuất kho - Đơn hàng #50 đã xác nhận',76,-5,11,50,NULL),(26,'SALE','2026-06-10 12:49:17.000000',38,'Xuất kho - Đơn hàng #50 đã xác nhận',39,-1,17,50,NULL),(27,'SALE','2026-06-10 12:49:17.000000',199,'Xuất kho - Đơn hàng #50 đã xác nhận',200,-1,9,50,NULL),(28,'SALE','2026-06-10 12:49:17.000000',149,'Xuất kho - Đơn hàng #50 đã xác nhận',150,-1,10,50,NULL),(29,'SALE','2026-06-10 12:49:17.000000',499,'Xuất kho - Đơn hàng #50 đã xác nhận',500,-1,12,50,NULL),(30,'RESTOCK','2026-06-10 12:54:50.000000',22,'Nhập kho bổ sung',12,10,3,NULL,NULL),(31,'SALE','2026-06-18 08:25:22.000000',88,'Xuất kho - Đơn hàng #51 đã xác nhận',89,-1,20,51,NULL),(32,'SALE','2026-06-18 08:25:22.000000',64,'Xuất kho - Đơn hàng #51 đã xác nhận',65,-1,18,51,NULL),(33,'SALE','2026-06-18 08:25:49.000000',86,'Xuất kho - Đơn hàng #52 đã xác nhận',88,-2,20,52,NULL),(34,'SALE','2026-06-18 08:25:49.000000',63,'Xuất kho - Đơn hàng #52 đã xác nhận',64,-1,18,52,NULL),(35,'SALE','2026-06-18 08:25:49.000000',43,'Xuất kho - Đơn hàng #52 đã xác nhận',44,-1,22,52,NULL),(36,'SALE','2026-06-18 08:25:49.000000',109,'Xuất kho - Đơn hàng #52 đã xác nhận',110,-1,21,52,NULL),(37,'SALE','2026-06-18 08:36:41.000000',83,'Xuất kho - Đơn hàng #55 đã xác nhận',86,-3,20,55,NULL),(38,'SALE','2026-06-18 08:36:41.000000',55,'Xuất kho - Đơn hàng #55 đã xác nhận',63,-8,18,55,NULL),(39,'CANCEL_ORDER','2026-06-18 08:39:47.000000',84,'Hoàn kho - Đơn hàng #51 đã hủy',83,1,20,51,NULL),(40,'CANCEL_ORDER','2026-06-18 08:39:47.000000',56,'Hoàn kho - Đơn hàng #51 đã hủy',55,1,18,51,NULL),(41,'CANCEL_ORDER','2026-06-18 08:40:00.000000',87,'Hoàn kho - Đơn hàng #55 đã hủy',84,3,20,55,NULL),(42,'CANCEL_ORDER','2026-06-18 08:40:00.000000',64,'Hoàn kho - Đơn hàng #55 đã hủy',56,8,18,55,NULL),(43,'SALE','2026-07-03 14:36:06.000000',84,'Xuất kho - Đơn hàng #56 đã xác nhận',87,-3,20,56,NULL),(44,'SALE','2026-07-03 14:36:06.000000',56,'Xuất kho - Đơn hàng #56 đã xác nhận',64,-8,18,56,NULL),(45,'SALE','2026-07-03 14:36:06.000000',24,'Xuất kho - Đơn hàng #56 đã xác nhận',25,-1,19,56,NULL),(46,'SALE','2026-07-03 14:47:05.000000',23,'Xuất kho - Đơn hàng #57 đã xác nhận',24,-1,19,57,NULL),(47,'SALE','2026-07-03 14:47:05.000000',55,'Xuất kho - Đơn hàng #57 đã xác nhận',56,-1,18,57,NULL),(48,'SALE','2026-07-03 14:59:33.000000',22,'Xuất kho - Đơn hàng #58 đã xác nhận',23,-1,19,58,NULL),(49,'SALE','2026-07-03 14:59:33.000000',54,'Xuất kho - Đơn hàng #58 đã xác nhận',55,-1,18,58,NULL),(50,'CANCEL_ORDER','2026-07-03 15:01:21.000000',23,'Hoàn kho - Đơn hàng #58 đã hủy',22,1,19,58,NULL),(51,'CANCEL_ORDER','2026-07-03 15:01:21.000000',55,'Hoàn kho - Đơn hàng #58 đã hủy',54,1,18,58,NULL),(52,'SALE','2026-07-05 04:13:55.000000',21,'Xuất kho - Đơn hàng #62 đã xác nhận',22,-1,3,62,NULL),(53,'SALE','2026-07-05 04:13:55.000000',19,'Xuất kho - Đơn hàng #62 đã xác nhận',20,-1,4,62,NULL);
/*!40000 ALTER TABLE `inventory_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_items` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `order_id` bigint(20) DEFAULT NULL,
  `wine_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKha0tksyu2o43lmwaaia08gbkn` (`order_id`),
  KEY `FKih8buj9cijyof4y1qdj7mo15k` (`wine_id`),
  CONSTRAINT `FKha0tksyu2o43lmwaaia08gbkn` FOREIGN KEY (`order_id`) REFERENCES `wine_orders` (`id`),
  CONSTRAINT `FKih8buj9cijyof4y1qdj7mo15k` FOREIGN KEY (`wine_id`) REFERENCES `wines` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=190 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (33,'The Macallan 12 Sherry Oak',2800000,1,8,17),(34,'Miraval Côtes de Provence',807500,1,8,6),(35,'Moët & Chandon Imperial Brut',1650000,1,8,7),(36,'Bottega Gold',1100000,1,8,8),(37,'Cloudy Bay Sauvignon Blanc',1250000,1,8,5),(38,'The Macallan 12 Sherry Oak',2800000,1,9,17),(39,'Miraval Côtes de Provence',807500,1,9,6),(40,'Moët & Chandon Imperial Brut',1650000,1,9,7),(41,'Bottega Gold',1100000,1,9,8),(42,'Cloudy Bay Sauvignon Blanc',1250000,1,9,5),(43,'The Macallan 12 Sherry Oak',2800000,1,10,17),(44,'Miraval Côtes de Provence',807500,1,10,6),(45,'Moët & Chandon Imperial Brut',1650000,1,10,7),(46,'Bottega Gold',1100000,1,10,8),(47,'Cloudy Bay Sauvignon Blanc',1250000,1,10,5),(48,'Bình Decanter Pha lê Thiên nga (Swan)',1200000,1,10,23),(51,'Cloudy Bay Sauvignon Blanc',1250000,1,13,5),(52,'Cloudy Bay Sauvignon Blanc',1250000,1,14,5),(54,'Cloudy Bay Sauvignon Blanc',1250000,1,16,5),(55,'Johnnie Walker Black Label',850000,1,16,16),(56,'Rượu Sâm Ngọc Linh K5',2500000,1,16,15),(57,'Cloudy Bay Sauvignon Blanc',1250000,1,17,5),(58,'Johnnie Walker Black Label',850000,1,17,16),(59,'Rượu Sâm Ngọc Linh K5',2500000,1,17,15),(108,'Rượu Sâm Ngọc Linh K5',2500000,1,31,15),(109,'RƯỢU BẦU ĐÁ',10000000,1,31,26),(110,'Bộ 6 ly pha lê Lucaris Bordeaux',1450000,1,31,25),(111,'Bình Decanter Pha lê Thiên nga (Swan)',1200000,1,31,23),(112,'Rượu Sâm Ngọc Linh K5',2500000,1,32,15),(113,'RƯỢU BẦU ĐÁ',10000000,1,32,26),(114,'Bộ 6 ly pha lê Lucaris Bordeaux',1450000,1,32,25),(115,'Bình Decanter Pha lê Thiên nga (Swan)',1200000,1,32,23),(116,'Rượu Sâm Ngọc Linh K5',2500000,1,33,15),(117,'RƯỢU BẦU ĐÁ',10000000,1,33,26),(118,'Bộ 6 ly pha lê Lucaris Bordeaux',1450000,1,33,25),(119,'Rượu Sâm Ngọc Linh K5',2500000,1,34,15),(120,'RƯỢU BẦU ĐÁ',10000000,1,34,26),(121,'Bộ 6 ly pha lê Lucaris Bordeaux',1450000,1,34,25),(131,'Rượu Sâm Ngọc Linh K5',2500000,1,38,15),(132,'RƯỢU BẦU ĐÁ',10000000,1,38,26),(133,'Bộ 6 ly pha lê Lucaris Bordeaux',1450000,1,38,25),(134,'RƯỢU BẦU ĐÁ',10000000,1,39,26),(135,'Belvedere Pure Vodka',980000,1,40,20),(136,'The Macallan 12 Sherry Oak',2800000,1,40,17),(137,'Penfolds Grange Bin 95',18500000,1,41,3),(138,'Penfolds Grange Bin 95',18500000,1,42,3),(139,'Penfolds Grange Bin 95',18500000,1,43,3),(140,'Bottega Gold',1100000,1,43,8),(146,'Bộ 6 ly pha lê Lucaris Bordeaux',1450000,1,46,25),(147,'Bình Decanter Pha lê Thiên nga (Swan)',1200000,1,46,23),(148,'Bộ khui vang tự động Xiaomi Circle Joy',850000,1,46,22),(149,'Bộ 6 ly pha lê Lucaris Bordeaux',1450000,1,47,25),(150,'Bình Decanter Pha lê Thiên nga (Swan)',1200000,1,47,23),(151,'Bộ khui vang tự động Xiaomi Circle Joy',850000,1,47,22),(152,'Bộ 6 ly pha lê Lucaris Bordeaux',1450000,1,48,25),(153,'Moscato d\'Asti DOCG',650000,4,49,11),(154,'Moscato d\'Asti DOCG',650000,5,50,11),(155,'The Macallan 12 Sherry Oak',2800000,1,50,17),(156,'Casillero del Diablo Cabernet',450000,1,50,9),(157,'Jacob\'s Creek Shiraz Cabernet',380000,1,50,10),(158,'Vang Đà Lạt Export Red Wine',120000,1,50,12),(159,'Belvedere Pure Vodka',980000,1,51,20),(160,'Hennessy VSOP Privilège',1750000,1,51,18),(161,'Belvedere Pure Vodka',980000,2,52,20),(162,'Hennessy VSOP Privilège',1750000,1,52,18),(163,'Bộ khui vang tự động Xiaomi Circle Joy',850000,1,52,22),(164,'Chivas Regal 18 Year Old',1600000,1,52,21),(165,'Belvedere Pure Vodka',980000,3,53,20),(166,'Hennessy VSOP Privilège',1750000,2,53,18),(167,'Bộ khui vang tự động Xiaomi Circle Joy',850000,1,53,22),(168,'Chivas Regal 18 Year Old',1600000,1,53,21),(169,'Belvedere Pure Vodka',980000,3,54,20),(170,'Hennessy VSOP Privilège',1750000,2,54,18),(171,'Bộ khui vang tự động Xiaomi Circle Joy',850000,1,54,22),(172,'Chivas Regal 18 Year Old',1600000,1,54,21),(173,'Belvedere Pure Vodka',980000,3,55,20),(174,'Hennessy VSOP Privilège',1750000,8,55,18),(175,'Belvedere Pure Vodka',980000,3,56,20),(176,'Hennessy VSOP Privilège',1750000,8,56,18),(177,'Sake Dassai 45 Junmai Daiginjo',1305000,1,56,19),(178,'Sake Dassai 45 Junmai Daiginjo',1450000,1,57,19),(179,'Hennessy VSOP Privilège',1750000,1,57,18),(180,'Sake Dassai 45 Junmai Daiginjo',1450000,1,58,19),(181,'Hennessy VSOP Privilège',1750000,1,58,18),(182,'Penfolds Grange Bin 95',18500000,1,59,3),(183,'Opus One 2018',12000000,1,59,4),(184,'Penfolds Grange Bin 95',18500000,1,60,3),(185,'Opus One 2018',12000000,1,60,4),(186,'Penfolds Grange Bin 95',18500000,1,61,3),(187,'Opus One 2018',12000000,1,61,4),(188,'Penfolds Grange Bin 95',18500000,1,62,3),(189,'Opus One 2018',12000000,1,62,4);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotions`
--

DROP TABLE IF EXISTS `promotions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `promotions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `active` bit(1) NOT NULL,
  `code` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `discount_percentage` double NOT NULL,
  `end_date` datetime(6) DEFAULT NULL,
  `min_order_amount` double DEFAULT NULL,
  `start_date` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKjdho73ymbyu46p2hh562dk4kk` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotions`
--

LOCK TABLES `promotions` WRITE;
/*!40000 ALTER TABLE `promotions` DISABLE KEYS */;
/*!40000 ALTER TABLE `promotions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_settings`
--

DROP TABLE IF EXISTS `system_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `system_settings` (
  `setting_key` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `setting_value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_settings`
--

LOCK TABLES `system_settings` WRITE;
/*!40000 ALTER TABLE `system_settings` DISABLE KEYS */;
INSERT INTO `system_settings` VALUES ('FREE_SHIPPING_THRESHOLD','Ngưỡng miễn phí vận chuyển (VNĐ)','2000000'),('SHIPPING_FEE','Phí vận chuyển mặc định (VNĐ)','35000');
/*!40000 ALTER TABLE `system_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `role` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'123 ABC , Đường XYZ ','admin001@gmail.com','ADMIN','123456','0972778480','ADMIN','admin001',1),(2,NULL,'user001@gmail.com','USER','123456',NULL,'CUSTOMER','user001',1),(3,NULL,'404@gmail.com','404','123456',NULL,'CUSTOMER','404',1),(4,'200/3A Dương Đình Hội','hanhatduy28805@gmail.com','Hà Nhật Duy','123456','0972778480','CUSTOMER','nd',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wine_orders`
--

DROP TABLE IF EXISTS `wine_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wine_orders` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `address` text DEFAULT NULL,
  `customer_email` varchar(255) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `order_date` datetime(6) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `total_amount` double DEFAULT NULL,
  `payment_method` varchar(20) DEFAULT NULL,
  `payment_status` varchar(20) DEFAULT NULL,
  `vnp_txn_ref` varchar(100) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `cancellation_reason` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK863boosq42cn2q1lltubtq3ae` (`user_id`),
  CONSTRAINT `FK863boosq42cn2q1lltubtq3ae` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wine_orders`
--

LOCK TABLES `wine_orders` WRITE;
/*!40000 ALTER TABLE `wine_orders` DISABLE KEYS */;
INSERT INTO `wine_orders` VALUES (8,'200/3A Dương Đình Hội','hanhatduy28805@gmail.com','Hà Nhật Duy','2026-05-25 06:14:36.000000','0972778480','PENDING',7607500,'COD','UNPAID',NULL,NULL,NULL),(9,'200/3A Dương Đình Hội','hanhatduy28805@gmail.com','Hà Nhật Duy','2026-05-25 06:52:05.000000','0972778480','DELIVERED',7607500,NULL,NULL,NULL,NULL,NULL),(10,'100 Dương Đình Hội','404@gmail.com','404 HN','2026-05-25 08:33:34.000000','0123456789','DELIVERED',8807500,'VNPAY','PENDING','66182470_10',NULL,NULL),(13,'200/3A Dương Đình Hội','hanhatduy28805@gmail.com','Hà Nhật Duy','2026-05-25 11:41:09.000000','0972778480','PENDING',1285000,NULL,NULL,NULL,NULL,NULL),(14,'200/3A Dương Đình Hội','hanhatduy28805@gmail.com','Hà Nhật Duy','2026-05-25 11:58:45.000000','0972778480','PENDING',1285000,NULL,NULL,NULL,NULL,NULL),(16,'100 Dương Đình Hội','404@gmail.com','404 404','2026-05-25 12:19:01.000000','0123456789','DELIVERED',4600000,NULL,NULL,NULL,NULL,NULL),(17,'200/3A Dương Đình Hội','ndwe@gmail.comm','AAA AAAA','2026-05-25 12:24:19.000000','0972778480','DELIVERED',4600000,NULL,NULL,NULL,NULL,NULL),(31,'200/3A Dương Đình Hội','dwyevan@gmail.com','Hà Nhật Duy','2026-06-07 08:39:14.000000','0972778480','PENDING',15150000,NULL,NULL,NULL,NULL,NULL),(32,'200/3A Dương Đình Hội','dwyevan@gmail.com','Hà Nhật Duy','2026-06-07 08:53:19.000000','0972778480','PENDING',15150000,NULL,NULL,NULL,NULL,NULL),(33,'200/3A Dương Đình Hội','dwyevan@gmail.com','Hà Nhật Duy','2026-06-07 08:53:46.000000','0972778480','PENDING',13950000,NULL,NULL,NULL,NULL,NULL),(34,'200/3A Dương Đình Hội','dwyevan@gmail.com','Hà Nhật Duy','2026-06-07 08:54:00.000000','0972778480','PENDING',13950000,NULL,NULL,NULL,NULL,NULL),(38,'123 Đường Chính, Hà Nội, Việt Nam','NVA@gmail.com','Nguyễn Văn A','2026-06-07 09:08:17.000000','0972778480','PAID',13950000,NULL,NULL,NULL,NULL,NULL),(39,'123 Đường Chính, Hà Nội, Việt Nam','NVA@gmail.com','Nguyễn Văn B','2026-06-07 09:09:06.000000','0923657923','DELIVERED',10000000,NULL,NULL,NULL,NULL,NULL),(40,'123 Đường Chính, Hà Nội, Việt Nam','NVC@gmail.com','Nguyễn Văn C','2026-06-07 09:17:48.000000','0923657923','PAID',3780000,NULL,NULL,NULL,NULL,NULL),(41,'123 Đường Chính, Hà Nội, Việt Nam','NVD@gmail.com','Nguyễn Văn D','2026-06-07 09:25:25.000000','0923657923','PAID',18500000,NULL,NULL,NULL,NULL,NULL),(42,'200/3A Dương Đình Hội','user001@gmail.com','USER Duy','2026-06-07 09:32:55.000000','0972778480','PAID',18500000,NULL,NULL,NULL,2,NULL),(43,'123 Đường Chính, Hà Nội, Việt Nam','404@gmail.com','404 Not Found','2026-06-07 09:39:27.000000','0123456789','PAID',19600000,NULL,NULL,NULL,3,NULL),(46,'122 Đường Chính, Hà Nội, Việt Nam','admin001@gmail.com','ADMIN Duy','2026-06-10 10:49:53.000000','0972778480','PENDING',3500000,NULL,NULL,NULL,1,NULL),(47,'123 Đường Chính, Hà Nội, Việt Nam','user001@gmail.com','USER DEMO','2026-06-10 10:58:59.000000','0972778480','PAID',3500000,NULL,NULL,NULL,2,NULL),(48,'123 Đường Chính, Hà Nội, Việt Nam','user001@gmail.com','USER DEMO','2026-06-10 11:01:13.000000','0972778480','CONFIRMED',1485000,NULL,NULL,NULL,2,NULL),(49,'123 Đường Chính, Hà Nội, Việt Nam','admin001@gmail.com','ADMIN A','2026-06-10 11:51:05.000000','0972778480','SHIPPING',2600000,NULL,NULL,NULL,1,NULL),(50,'123 Đường Chính, Hà Nội, Việt Nam','admin001@gmail.com','ADMIN C','2026-06-10 12:49:17.000000','0972778480','CANCELLED',7000000,NULL,NULL,NULL,1,'Tôi cần bổ sung các sản phảm khác'),(51,'123 Đường Chính, Hà Nội, Việt Nam','user001@gmail.com','USER D','2026-06-18 08:25:21.000000','0972778480','CANCELLED',2730000,NULL,NULL,NULL,2,NULL),(52,'123 Đường Chính, Hà Nội, Việt Nam','user001@gmail.com','USER D','2026-06-18 08:25:48.000000','0972778480','DELIVERED',6160000,NULL,NULL,NULL,2,NULL),(53,'123 Đường Chính, Hà Nội, Việt Nam','user001@gmail.com','USER H','2026-06-18 08:26:55.000000','0972778480','CANCELLED',8890000,NULL,NULL,NULL,2,NULL),(54,'123 Đường Chính, Hà Nội, Việt Nam','user001@gmail.com','USER N','2026-06-18 08:31:26.000000','0972778480','CANCELLED',8890000,NULL,NULL,NULL,2,NULL),(55,'123 Đường Chính, Hà Nội, Việt Nam','user001@gmail.com','USER L','2026-06-18 08:35:20.000000','0972778480','CANCELLED',16940000,NULL,NULL,NULL,2,NULL),(56,'123 Đường Chính, Hà Nội, Việt Nam','admin001@gmail.com','ADMIN A','2026-06-30 07:22:22.000000','0972778480','DELIVERED',18245000,NULL,NULL,NULL,1,NULL),(57,'200/3A Dương Đình Hội','hanhatduy28805@gmail.com','Hà Nhật Duy','2026-07-03 14:47:04.000000','0972778480','PAID',3200000,NULL,NULL,NULL,4,NULL),(58,'200/3A Dương Đình Hội','hanhatduy28805@gmail.com','Hà Nhật Duy','2026-07-03 14:52:33.000000','0972778480','CANCELLED',3200000,NULL,NULL,NULL,4,NULL),(59,'123 ABC , Đường XYZ ','admin001@gmail.com','ADMIN ABC','2026-07-05 04:08:03.000000','0972778480','PENDING',30500000,NULL,NULL,NULL,1,NULL),(60,'123 ABC , Đường XYZ ','admin001@gmail.com','ADMIN ABC','2026-07-05 04:08:27.000000','0972778480','PENDING',30500000,NULL,NULL,NULL,1,NULL),(61,'123 ABC , Đường XYZ ','admin001@gmail.com','ADMIN M','2026-07-05 04:08:53.000000','0972778480','PENDING',30500000,NULL,NULL,NULL,1,NULL),(62,'123 ABC , Đường XYZ ','admin001@gmail.com','ADMIN L','2026-07-05 04:09:24.000000','0972778480','PAID',30500000,NULL,NULL,NULL,1,NULL);
/*!40000 ALTER TABLE `wine_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wines`
--

DROP TABLE IF EXISTS `wines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wines` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `alcohol_content` double DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `discount_percent` int(11) DEFAULT 0,
  `image_url` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `origin` varchar(255) DEFAULT NULL,
  `price` decimal(38,2) DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  `minimum_stock` int(11) DEFAULT 10,
  `sold_count` int(11) DEFAULT 0,
  `enabled` tinyint(1) DEFAULT 1,
  `country` varchar(255) DEFAULT NULL,
  `food_pairing` varchar(255) DEFAULT NULL,
  `grape_variety` varchar(255) DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL,
  `serving_temperature` varchar(255) DEFAULT NULL,
  `sweetness_level` varchar(255) DEFAULT NULL,
  `vintage_year` int(11) DEFAULT NULL,
  `volume` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wines`
--

LOCK TABLES `wines` WRITE;
/*!40000 ALTER TABLE `wines` DISABLE KEYS */;
INSERT INTO `wines` VALUES (3,14.5,'Penfolds','Red Wine','2026-01-10 07:27:08.000000','Biểu tượng vang Úc với hương vị mạnh mẽ từ nho Syrah.',0,'https://i.pinimg.com/736x/28/fe/b7/28feb7a061967fa604221ed365c04e57.jpg','Penfolds Grange Bin 95','Australia',18500000.00,21,10,4,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4,14,'Opus One','Red Wine','2026-01-10 07:27:13.000000','Sự kết hợp hoàn hảo giữa phong cách Pháp và thung lũng Napa.',10,'https://i.pinimg.com/1200x/a2/80/12/a28012e4487314abaa1705aaa23ef64f.jpg','Opus One 2018','USA',12000000.00,19,10,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(5,13,'Cloudy Bay','White Wine','2026-01-10 07:27:18.000000','Hương chanh dây và khoáng chất tươi mát.',0,'https://i.pinimg.com/736x/71/6d/2a/716d2a91a8eb3647bee7805f42a3e791.jpg','Cloudy Bay Sauvignon Blanc','New Zealand',1250000.00,98,10,2,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(6,12.5,'Miraval','Rosé Wine','2026-01-10 07:27:23.000000','Vang hồng thanh lịch với hương dâu tây và hoa hồng.',15,'https://i.pinimg.com/736x/df/76/b6/df76b6f1c4d2b2c2deb2a7d228bf8bcc.jpg','Miraval Côtes de Provence','France',950000.00,45,10,0,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(7,12,'Moët & Chandon','Champagne','2026-01-10 07:27:28.000000','Dòng Champagne phổ biến nhất thế giới cho mọi bữa tiệc.',5,'https://i.pinimg.com/736x/84/71/8b/84718bff4be019a9bca37da594dab204.jpg','Moët & Chandon Imperial Brut','France',1650000.00,60,10,0,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(8,11,'Bottega','Sparkling Wine','2026-01-10 07:27:33.000000','Vang nổ Ý trong thiết kế chai vàng sang trọng.',20,'https://i.pinimg.com/1200x/24/5d/70/245d705375344db58b357903ec359738.jpg','Bottega Gold','Italy',1100000.00,29,10,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(9,13.5,'Concha y Toro','Red Wine','2026-01-10 07:27:38.000000','Vang Chile đậm đà, dễ uống cho bữa tối gia đình.',0,'https://i.pinimg.com/736x/e0/0b/e6/e00be65aa84d698d14dd016095d3c767.jpg','Casillero del Diablo Cabernet','Chile',450000.00,199,10,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(10,13.9,'Jacob\'s Creek','Red Wine','2026-01-10 07:27:42.000000','Sự pha trộn mượt mà giữa nho Shiraz và Cabernet.',5,'https://i.pinimg.com/736x/96/65/00/966500f0e65a1d4ccc68f72181d6d691.jpg','Jacob\'s Creek Shiraz Cabernet','Australia',380000.00,149,10,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(11,5.5,'Prunotto','Sweet Wine','2026-01-10 07:27:47.000000','Vang ngọt nhẹ nhàng, hương thơm của đào và mật ong.',10,'https://i.pinimg.com/736x/80/df/cc/80dfcc8ed39a9db220beed64f24a3ec5.jpg','Moscato d\'Asti DOCG','Italy',650000.00,71,10,9,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(12,12,'Ladofoods','Red Wine','2026-01-10 07:28:55.000000','Dòng vang phổ biến nhất Việt Nam, làm từ nho Cardinal và quả dâu tằm Đà Lạt.',5,'https://i.pinimg.com/1200x/86/1f/ca/861fcadc478e25ca9406f7edd68bc7ad.jpg','Vang Đà Lạt Export Red Wine','Vietnam',120000.00,499,10,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(13,14,'Yen Tu','Fruit Wine','2026-01-10 07:29:02.000000','Sử dụng mơ tươi đặc sản Yên Tử, lên men tự nhiên, vị ngọt thanh, tốt cho sức khỏe.',0,'https://i.pinimg.com/736x/77/89/d7/7789d765eef876cf41fd5123904d93cc.jpg','Rượu Mơ Yên Tử Premium','Vietnam',250000.00,120,10,0,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(15,29,'K5','Health Wine','2026-01-10 07:29:15.000000','Chiết xuất từ sâm Ngọc Linh quý hiếm giúp bồi bổ sức khỏe và tăng cường thể lực.',0,'https://tse3.mm.bing.net/th/id/OIP.8HH_cN2ofIzxiJH8ePV5lwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3','Rượu Sâm Ngọc Linh K5','Vietnam',2500000.00,27,10,3,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(16,40,'Johnnie Walker','Whisky','2026-01-10 07:29:20.000000','Dòng Whisky 12 năm tuổi biểu tượng với hương khói nhẹ nhàng và vị trái cây khô.',5,'https://i.pinimg.com/736x/90/56/09/9056098f03bba5ca2c263a6978a28076.jpg','Johnnie Walker Black Label','Scotland',850000.00,148,10,2,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(17,43,'The Macallan','Whisky','2026-01-10 07:29:25.000000','Đỉnh cao của dòng Single Malt, ủ trong thùng gỗ sồi Sherry từ Tây Ban Nha.',0,'https://i.pinimg.com/736x/7b/d8/5a/7bd85a10fde30888209c0cf2ae5e370d.jpg','The Macallan 12 Sherry Oak','Scotland',2800000.00,38,10,2,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(18,40,'Hennessy','Cognac','2026-01-10 07:29:30.000000','Sự cân bằng hoàn hảo giữa sức mạnh và sự tinh tế, nốt hương cam thảo và mật ong.',8,'https://i.pinimg.com/736x/25/f2/d2/25f2d2b14421f6715539ec58b53b59c6.jpg','Hennessy VSOP Privilège','France',1750000.00,55,10,10,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(19,16,'Dassai','Sake','2026-01-10 07:29:34.000000','Dòng Sake cao cấp nhất của Nhật, vị ngọt dịu và hương hoa tinh tế.',10,'https://i.pinimg.com/1200x/d9/10/c0/d910c0766dae47ee00214611f550737c.jpg','Sake Dassai 45 Junmai Daiginjo','Japan',1450000.00,23,10,2,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(20,40,'Belvedere','Vodka','2026-01-10 07:29:39.000000','Vodka siêu sang được làm từ lúa mạch vàng Dankowskie, chưng cất 4 lần.',15,'https://i.pinimg.com/736x/d9/06/39/d90639251b06f7260d065b8eae1f2067.jpg','Belvedere Pure Vodka','Poland',980000.00,84,10,6,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(21,40,'Chivas Brothers','Whisky','2026-01-10 07:29:46.000000','Sự pha trộn phức tạp của 85 loại hương vị trong mỗi giọt rượu.',10,'https://i.pinimg.com/736x/8a/14/ff/8a14ffcc0a6ddde6a75b3f788a65a32c.jpg','Chivas Regal 18 Year Old','Scotland',1600000.00,109,10,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(22,0,'Circle Joy','Accessories','2026-01-10 07:30:54.000000','Khui nút bần chỉ trong 6 giây bằng một nút bấm. Vỏ thép không gỉ sang trọng, tích hợp sạc USB.',10,'https://i.pinimg.com/1200x/3c/71/6f/3c716ff779e4f6f9dfcac87f71a8dce1.jpg','Bộ khui vang tự động Xiaomi Circle Joy','China',850000.00,43,10,2,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(23,0,'Riedel Style','Accessories','2026-01-10 07:31:01.000000','Chế tác thủ công từ pha lê cao cấp, thiết kế hình thiên nga giúp sục khí tối ưu và rót rượu không bị rớt.',0,'https://i.pinimg.com/1200x/a5/c6/a1/a5c6a1d9ddd10bca6a1553fc6feb33d0.jpg','Bình Decanter Pha lê Thiên nga (Swan)','Czech Republic',1200000.00,19,10,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(25,0,'Lucaris','Glassware','2026-01-10 07:31:14.000000','Dòng ly cao cấp với bầu ly rộng giúp hương vị vang đỏ Bordeaux được bung tỏa hoàn hảo.',0,'https://tse1.mm.bing.net/th/id/OIP.mToS9lYQijr63EsMYoUNkQAAAA?w=450&h=450&rs=1&pid=ImgDetMain&o=7&rm=3','Bộ 6 ly pha lê Lucaris Bordeaux','Thailand',1450000.00,27,10,3,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(26,1.6,'Bình Định','Vodka','2026-01-31 07:02:11.000000','NGON',0,'https://dulich3mien.vn/wp-content/uploads/2022/04/RUOU-BAU-DA-BINH-DINH-06-min-768x614.jpg','RƯỢU BẦU ĐÁ','Việt Nam',10000000.00,34,30,2,1,NULL,NULL,NULL,NULL,NULL,'Dry',NULL,NULL);
/*!40000 ALTER TABLE `wines` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-05 13:43:02
