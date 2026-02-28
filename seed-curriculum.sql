-- First Year: First Semester
INSERT OR IGNORE INTO curriculum (id, course_code, course_title, credit, year, semester, is_optional) VALUES
(hex(randomblob(12)), 'CSE 1101', 'Discrete Mathematics', 3.0, 1, 1, 0),
(hex(randomblob(12)), 'CSE 1102', 'Computer Maintenance and Troubleshooting Lab', 1.0, 1, 1, 0),
(hex(randomblob(12)), 'CSE 1103', 'Structured Programming Language', 3.0, 1, 1, 0),
(hex(randomblob(12)), 'CSE 1104', 'Structured Programming Language Lab', 1.5, 1, 1, 0),
(hex(randomblob(12)), 'EEE 1105', 'Fundamental of Electrical Engineering', 3.0, 1, 1, 0),
(hex(randomblob(12)), 'EEE 1106', 'Fundamental of Electrical Engineering Lab', 1.5, 1, 1, 0),
(hex(randomblob(12)), 'HUM 1107', 'Communicative English', 2.0, 1, 1, 0),
(hex(randomblob(12)), 'HUM 1108', 'Communicative English Skills Lab', 1.0, 1, 1, 0),
(hex(randomblob(12)), 'MATH 1109', 'Algebra and Trigonometry', 3.0, 1, 1, 0);

-- First Year: Second Semester
INSERT OR IGNORE INTO curriculum (id, course_code, course_title, credit, year, semester, is_optional) VALUES
(hex(randomblob(12)), 'CSE 1201', 'Data Structures', 3.0, 1, 2, 0),
(hex(randomblob(12)), 'CSE 1202', 'Data Structures Lab', 1.5, 1, 2, 0),
(hex(randomblob(12)), 'EEE 1203', 'Electronics Devices and Circuits', 3.0, 1, 2, 0),
(hex(randomblob(12)), 'EEE 1204', 'Electronics Devices and Circuits Lab', 1.0, 1, 2, 0),
(hex(randomblob(12)), 'CSE 1205', 'Object Oriented Programming', 3.0, 1, 2, 0),
(hex(randomblob(12)), 'CSE 1206', 'Object Oriented Programming Lab', 1.5, 1, 2, 0),
(hex(randomblob(12)), 'PHY 1207', 'Physics', 3.0, 1, 2, 0),
(hex(randomblob(12)), 'PHY 1208', 'Physics Lab', 1.0, 1, 2, 0),
(hex(randomblob(12)), 'MATH 1209', 'Calculus and Differential Equations', 3.0, 1, 2, 0),
(hex(randomblob(12)), 'CSE 1210', 'Viva Voce', 1.0, 1, 2, 0);

-- Second Year: First Semester
INSERT OR IGNORE INTO curriculum (id, course_code, course_title, credit, year, semester, is_optional) VALUES
(hex(randomblob(12)), 'CSE 2101', 'Web Programming', 3.0, 2, 1, 0),
(hex(randomblob(12)), 'CSE 2102', 'Web Programming Lab', 1.5, 2, 1, 0),
(hex(randomblob(12)), 'CSE 2103', 'Algorithms', 3.0, 2, 1, 0),
(hex(randomblob(12)), 'CSE 2104', 'Algorithms Lab', 1.5, 2, 1, 0),
(hex(randomblob(12)), 'CSE 2105', 'Digital Logic Design', 3.0, 2, 1, 0),
(hex(randomblob(12)), 'CSE 2106', 'Digital Logic Design Lab', 1.0, 2, 1, 0),
(hex(randomblob(12)), 'HUM 2107', 'Economics and Sociology', 2.0, 2, 1, 0),
(hex(randomblob(12)), 'MATH 2109', 'Geometry and Vector Analysis', 3.0, 2, 1, 0),
(hex(randomblob(12)), 'CHEM 2111', 'Chemistry', 2.0, 2, 1, 0);

-- Second Year: Second Semester
INSERT OR IGNORE INTO curriculum (id, course_code, course_title, credit, year, semester, is_optional) VALUES
(hex(randomblob(12)), 'CSE 2201', 'Computer Architecture and Organization', 3.0, 2, 2, 0),
(hex(randomblob(12)), 'CSE 2202', 'Computer Architecture and Organization Lab', 1.0, 2, 2, 0),
(hex(randomblob(12)), 'CSE 2203', 'Database Management Systems', 3.0, 2, 2, 0),
(hex(randomblob(12)), 'CSE 2204', 'Database Management Systems Lab', 1.0, 2, 2, 0),
(hex(randomblob(12)), 'CSE 2205', 'Numerical Methods', 2.0, 2, 2, 0),
(hex(randomblob(12)), 'CSE 2206', 'Numerical Methods Lab', 1.0, 2, 2, 0),
(hex(randomblob(12)), 'STAT 2207', 'Statistics for Engineers', 2.0, 2, 2, 0),
(hex(randomblob(12)), 'STAT 2208', 'Statistics for Engineers Lab', 1.0, 2, 2, 0),
(hex(randomblob(12)), 'MATH 2209', 'Complex Analysis, Laplace and Fourier Transforms', 2.0, 2, 2, 0),
(hex(randomblob(12)), 'MATH 2210', 'Complex Analysis, Laplace and Fourier Transforms Lab', 1.0, 2, 2, 0),
(hex(randomblob(12)), 'HUM 2211', 'Business and Intellectual Property Law', 2.0, 2, 2, 0),
(hex(randomblob(12)), 'CSE 2212', 'Viva Voce', 1.0, 2, 2, 0);

-- Third Year: First Semester
INSERT OR IGNORE INTO curriculum (id, course_code, course_title, credit, year, semester, is_optional) VALUES
(hex(randomblob(12)), 'CSE 3101', 'Theory of Computation', 3.0, 3, 1, 0),
(hex(randomblob(12)), 'CSE 3102', 'Theory of Computation Lab', 1.0, 3, 1, 0),
(hex(randomblob(12)), 'CSE 3103', 'Software Engineering', 3.0, 3, 1, 0),
(hex(randomblob(12)), 'CSE 3104', 'Software Engineering Lab', 1.0, 3, 1, 0),
(hex(randomblob(12)), 'CSE 3105', 'Microprocessors and Assembly Language', 3.0, 3, 1, 0),
(hex(randomblob(12)), 'CSE 3106', 'Microprocessors and Assembly Language Lab', 1.0, 3, 1, 0),
(hex(randomblob(12)), 'CSE 3107', 'Data Communication', 3.0, 3, 1, 0),
(hex(randomblob(12)), 'CSE 3108', 'Data Communication Lab', 1.0, 3, 1, 0),
(hex(randomblob(12)), 'ME 3110', 'Engineering Drawing Lab', 1.0, 3, 1, 0),
(hex(randomblob(12)), 'HUM 3111', 'Technical Writing and Presentation', 2.0, 3, 1, 0);

-- Third Year: Second Semester
INSERT OR IGNORE INTO curriculum (id, course_code, course_title, credit, year, semester, is_optional) VALUES
(hex(randomblob(12)), 'CSE 3201', 'Computer Network', 3.0, 3, 2, 0),
(hex(randomblob(12)), 'CSE 3202', 'Computer Network Lab', 1.0, 3, 2, 0),
(hex(randomblob(12)), 'CSE 3203', 'Computer Peripherals and Interfacing', 3.0, 3, 2, 0),
(hex(randomblob(12)), 'CSE 3204', 'Computer Peripherals and Interfacing Lab', 1.0, 3, 2, 0),
(hex(randomblob(12)), 'CSE 3205', 'Compiler Design', 3.0, 3, 2, 0),
(hex(randomblob(12)), 'CSE 3206', 'Compiler Design Lab', 1.0, 3, 2, 0),
(hex(randomblob(12)), 'CSE 3207', 'Operating Systems', 3.0, 3, 2, 0),
(hex(randomblob(12)), 'CSE 3208', 'Operating Systems Lab', 1.0, 3, 2, 0),
(hex(randomblob(12)), 'CSE 3210', 'Integrated Design Project-I', 2.0, 3, 2, 0),
(hex(randomblob(12)), 'CSE 3212', 'Viva Voce', 1.0, 3, 2, 0);

-- Fourth Year: First Semester
INSERT OR IGNORE INTO curriculum (id, course_code, course_title, credit, year, semester, is_optional) VALUES
(hex(randomblob(12)), 'CSE 4101', 'Artificial Intelligence', 3.0, 4, 1, 0),
(hex(randomblob(12)), 'CSE 4102', 'Artificial Intelligence Lab', 1.5, 4, 1, 0),
(hex(randomblob(12)), 'CSE 4103', 'Digital Signal Processing', 3.0, 4, 1, 0),
(hex(randomblob(12)), 'CSE 4104', 'Digital Signal Processing Lab', 1.0, 4, 1, 0),
(hex(randomblob(12)), 'CSE 4105', 'Embedded System and IoT', 3.0, 4, 1, 0),
(hex(randomblob(12)), 'CSE 4106', 'Embedded System and IoT Lab', 1.5, 4, 1, 0),
(hex(randomblob(12)), 'CSE 4112', 'Industrial Tour/Training', 1.0, 4, 1, 0);

-- Fourth Year: Second Semester
INSERT OR IGNORE INTO curriculum (id, course_code, course_title, credit, year, semester, is_optional) VALUES
(hex(randomblob(12)), 'CSE 4201', 'Machine Learning', 3.0, 4, 2, 0),
(hex(randomblob(12)), 'CSE 4202', 'Machine Learning Lab', 1.0, 4, 2, 0),
(hex(randomblob(12)), 'CSE 4203', 'Network Security', 3.0, 4, 2, 0),
(hex(randomblob(12)), 'CSE 4204', 'Network Security Lab', 1.0, 4, 2, 0),
(hex(randomblob(12)), 'CSE 4205', 'Computer Graphics', 3.0, 4, 2, 0),
(hex(randomblob(12)), 'CSE 4206', 'Computer Graphics Lab', 1.0, 4, 2, 0),
(hex(randomblob(12)), 'ACC 4207', 'Industrial Management and Accountancy', 2.0, 4, 2, 0),
(hex(randomblob(12)), 'CSE 4212', 'Project-II', 4.0, 4, 2, 0),
(hex(randomblob(12)), 'CSE 4214', 'Viva Voce', 1.0, 4, 2, 0);

-- Optional Courses: Fourth Year First Semester
INSERT OR IGNORE INTO curriculum (id, course_code, course_title, credit, year, semester, is_optional) VALUES
(hex(randomblob(12)), 'CSE 4113', 'Cloud Computing', 2.0, 4, 1, 1),
(hex(randomblob(12)), 'CSE 4114', 'Cloud Computing Lab', 1.0, 4, 1, 1),
(hex(randomblob(12)), 'CSE 4115', 'Bioinformatics', 2.0, 4, 1, 1),
(hex(randomblob(12)), 'CSE 4116', 'Bioinformatics Lab', 1.0, 4, 1, 1),
(hex(randomblob(12)), 'CSE 4117', 'Mobile Computing', 2.0, 4, 1, 1),
(hex(randomblob(12)), 'CSE 4118', 'Mobile Computing Lab', 1.0, 4, 1, 1),
(hex(randomblob(12)), 'CSE 4119', 'Data Mining', 2.0, 4, 1, 1),
(hex(randomblob(12)), 'CSE 4120', 'Data Mining Lab', 1.0, 4, 1, 1),
(hex(randomblob(12)), 'CSE 4121', 'Pattern Recognition', 2.0, 4, 1, 1),
(hex(randomblob(12)), 'CSE 4122', 'Pattern Recognition Lab', 1.0, 4, 1, 1),
(hex(randomblob(12)), 'CSE 4123', 'Multimedia Engineering', 2.0, 4, 1, 1),
(hex(randomblob(12)), 'CSE 4124', 'Multimedia Engineering Lab', 1.0, 4, 1, 1);

-- Optional Courses: Fourth Year Second Semester
INSERT OR IGNORE INTO curriculum (id, course_code, course_title, credit, year, semester, is_optional) VALUES
(hex(randomblob(12)), 'CSE 4215', 'System Simulation and Modeling', 2.0, 4, 2, 1),
(hex(randomblob(12)), 'CSE 4216', 'System Simulation and Modeling Lab', 1.0, 4, 2, 1),
(hex(randomblob(12)), 'CSE 4217', 'Digital Image Processing', 2.0, 4, 2, 1),
(hex(randomblob(12)), 'CSE 4218', 'Digital Image Processing Lab', 1.0, 4, 2, 1),
(hex(randomblob(12)), 'CSE 4219', 'Wireless Communication', 2.0, 4, 2, 1),
(hex(randomblob(12)), 'CSE 4220', 'Wireless Communication Lab', 1.0, 4, 2, 1);
