USE virtualfitting;
-- Database: `virtualfitting`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`) VALUES
(1, 'Minxer', '$2b$10$z7Vab2bqQ2PsRDFDVxXHq.tkEUDAwxRLvY.B8XAXL6huZewk1.IM2'),
(2, 'Janice', '$2b$10$rf/4w5Dib1OVm/oghYOgvenjE2T1ywyJ2AoBew6Cp6pkkxyuI7S7K');

-- --------------------------------------------------------

--
-- Table structure for table `virtual_fitting`
--

CREATE TABLE `virtual_fitting` (
  `id` int(11) NOT NULL,
  `username` int(11) NOT NULL,
  `type_of_clothes` varchar(50) NOT NULL,
  `size` varchar(10) NOT NULL,
  `color` varchar(20) NOT NULL,
  `brand` varchar(50) NOT NULL,
  `image` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `virtual_fitting`
--

INSERT INTO `virtual_fitting` (`id`, `username`, `type_of_clothes`, `size`, `color`, `brand`, `image`) VALUES
(1, 0, 'Jacket', 'M', 'Black', 'BrandH', '0PXJKW215001JBLX-pdp-1.jpg'),
(9, 0, 'Skirt', 'S', 'White', 'BrandI', 'twenty-eight-shoes-5581-9209222-1.webp'),
(10, 0, 'Skirt', 'M', 'Brown', 'BrandJ', '41xOpgCKhDL._AC_.jpg'),
(11, 0, 'Sweater', 'L', 'White', 'BrandK', 'twenty-eight-shoes-9231-5795633-1.webp'),
(12, 0, 'Sweater', 'M', 'Brown', 'BrandL', '1696949286-instock_m_q123_OrrSweater_Acorn_001.jpg'),
(13, 0, 'Shorts', '32', 'Blue', 'BrandM', 'SD_04_T87_3044V_HD_X_EC_90.jpg'),
(14, 0, 'Shorts', '34', 'Grey', 'BrandN', 'adyfb03047_dcshoes,f_kpvh_frt1.jpg'),
(15, 0, 'Blouse', 'S', 'White', 'BrandO', 'white_blouse_women_niche_desig_1675962957_76b3e5f9_progressive.jpg'),
(16, 0, 'Blouse', 'M', 'Black', 'BrandP', '171284042561e301e77bccf494ea8797c35fc7f592_thumbnail_336x.jpg'),
(17, 0, 'Suit', 'L', 'Navy', 'BrandQ', '22148890_52419242_1000.webp'),
(18, 0, 'Suit', 'M', 'Gray', 'BrandR', 'happy-fridays-9632-7121013-1.webp'),
(20, 0, 'Hat', 'One Size', 'Black', 'BrandT', 'Solid-Black-Baseball-Cap-Hat-with-Adjustable-Buckle-Back-Unisex_2b2bd9e5-d9df-4432-89e6-e22570e2de9e.bd72dfea18cccbcce241cbf7d35226c5.webp');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `virtual_fitting`
--
ALTER TABLE `virtual_fitting`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `virtual_fitting`
--
ALTER TABLE `virtual_fitting`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
