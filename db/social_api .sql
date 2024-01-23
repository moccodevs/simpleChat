-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-01-2024 a las 21:46:06
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `social_api`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `amigos`
--

CREATE TABLE `amigos` (
  `id` int(11) NOT NULL,
  `usuario1` varchar(255) NOT NULL,
  `usuario2` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `amigos`
--

INSERT INTO `amigos` (`id`, `usuario1`, `usuario2`) VALUES
(1, 'usuario1', 'usuario2');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `chats`
--

CREATE TABLE `chats` (
  `emisor` varchar(20) DEFAULT NULL,
  `destino` varchar(20) DEFAULT NULL,
  `mensaje` varchar(1500) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `chats`
--

INSERT INTO `chats` (`emisor`, `destino`, `mensaje`, `fecha`) VALUES
('usuario1', 'usuario2', 'mensaje de prueba', '2024-01-22 19:57:58'),
('usuario1', 'usuario2', '111', '2024-01-22 20:04:44'),
('usuario1', 'usuario2', 'Buenas', '2024-01-22 21:39:27'),
('usuario1', 'usuario2', 'Como va?', '2024-01-22 21:39:29'),
('usuario1', 'usuario2', 'Todo bien?', '2024-01-22 21:39:43'),
('usuario2', 'usuario1', 'Buenas', '2024-01-22 21:43:59'),
('usuario2', 'usuario1', 'Como va?', '2024-01-22 21:44:01'),
('usuario1', 'usuario2', 'bien', '2024-01-22 21:44:11'),
('usuario1', 'usuario2', 'sf', '2024-01-22 21:46:04'),
('usuario1', 'usuario1', 'asd', '2024-01-22 21:46:11'),
('usuario1', 'usuario2', 'saf', '2024-01-22 21:50:31'),
('usuario1', 'usuario1', 'asf', '2024-01-22 21:50:33'),
('usuario1', 'usuario1', 'swadf', '2024-01-22 22:19:49'),
('usuario2', 'usuario1', 'asf', '2024-01-22 22:20:43'),
('usuario2', 'usuario1', 'asd', '2024-01-22 22:27:05'),
('usuario2', 'usuario1', 'asfas', '2024-01-22 22:27:12'),
('usuario2', 'usuario1', 'asfas', '2024-01-22 22:27:13'),
('usuario2', 'usuario1', 'asfas', '2024-01-22 22:27:28'),
('usuario2', 'usuario1', 'asd', '2024-01-22 22:27:32'),
('usuario2', 'usuario1', 'asf', '2024-01-22 22:55:29'),
('usuario2', 'usuario1', 'asf', '2024-01-22 22:55:32'),
('usuario2', 'usuario1', 'd', '2024-01-22 22:55:39'),
('usuario2', 'usuario1', 'sadf', '2024-01-22 22:56:30'),
('usuario2', 'usuario1', 'as', '2024-01-22 22:57:46'),
('usuario2', 'usuario1', 'asf', '2024-01-22 22:58:28'),
('usuario2', 'usuario1', 'asf', '2024-01-22 22:59:57'),
('usuario1', 'usuario2', 'asf', '2024-01-22 23:01:26'),
('usuario2', 'usuario1', 'asf', '2024-01-22 23:04:06'),
('usuario1', 'usuario2', 'saf', '2024-01-22 23:19:50');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `username` varchar(15) NOT NULL,
  `pass` varchar(10) DEFAULT NULL,
  `token` varchar(100) DEFAULT NULL,
  `logged` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`username`, `pass`, `token`, `logged`) VALUES
('usuario1', 'pass1', 'pW2I16m8f6pNhxof0hco6-9ldh7dF3-z', 1),
('usuario2', 'pass2', 'no token', 0),
('usuario3', 'pass3', 'no token', 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `amigos`
--
ALTER TABLE `amigos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_amigos` (`usuario1`,`usuario2`),
  ADD KEY `fk_usuario2` (`usuario2`);

--
-- Indices de la tabla `chats`
--
ALTER TABLE `chats`
  ADD KEY `fk_emisor` (`emisor`),
  ADD KEY `fk_destino` (`destino`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`username`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `amigos`
--
ALTER TABLE `amigos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `amigos`
--
ALTER TABLE `amigos`
  ADD CONSTRAINT `fk_usuario1` FOREIGN KEY (`usuario1`) REFERENCES `users` (`username`),
  ADD CONSTRAINT `fk_usuario2` FOREIGN KEY (`usuario2`) REFERENCES `users` (`username`);

--
-- Filtros para la tabla `chats`
--
ALTER TABLE `chats`
  ADD CONSTRAINT `fk_destino` FOREIGN KEY (`destino`) REFERENCES `users` (`username`),
  ADD CONSTRAINT `fk_emisor` FOREIGN KEY (`emisor`) REFERENCES `users` (`username`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
