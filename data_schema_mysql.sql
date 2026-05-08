SET NAMES utf8mb4;

CREATE TABLE countries (
  code VARCHAR(2) PRIMARY KEY,
  name_ru TEXT NOT NULL,
  name_en TEXT NOT NULL
);

CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name VARCHAR(255),
  grade_level INT,
  preferred_country VARCHAR(2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_country FOREIGN KEY (preferred_country) REFERENCES countries(code)
);

CREATE TABLE subjects (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(64) UNIQUE NOT NULL,
  name_ru VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL
);

CREATE TABLE publishers (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  country_code VARCHAR(2),
  website TEXT,
  CONSTRAINT fk_publishers_country FOREIGN KEY (country_code) REFERENCES countries(code)
);

CREATE TABLE textbooks (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  country VARCHAR(64) NOT NULL,
  country_code VARCHAR(2),
  title TEXT NOT NULL,
  subject VARCHAR(255) NOT NULL,
  subject_id BIGINT,
  grade INT NOT NULL,
  authors TEXT NOT NULL,
  language_code VARCHAR(8) DEFAULT 'ru',
  year_published INT,
  publisher_id BIGINT,
  isbn VARCHAR(32),
  description TEXT,
  cover_url TEXT,
  source_url TEXT,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_textbooks_country FOREIGN KEY (country_code) REFERENCES countries(code),
  CONSTRAINT fk_textbooks_subject FOREIGN KEY (subject_id) REFERENCES subjects(id),
  CONSTRAINT fk_textbooks_publisher FOREIGN KEY (publisher_id) REFERENCES publishers(id)
);

CREATE INDEX idx_textbooks_country_grade ON textbooks(country_code, grade);
CREATE INDEX idx_textbooks_subject_grade ON textbooks(subject_id, grade);

CREATE TABLE textbook_topics (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  textbook_id BIGINT,
  chapter_number INT,
  chapter_title TEXT,
  topic_number INT,
  topic_title TEXT NOT NULL,
  topic_keywords JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_topics_textbook FOREIGN KEY (textbook_id) REFERENCES textbooks(id) ON DELETE CASCADE
);

CREATE TABLE textbook_pages (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  textbook_id BIGINT,
  page_number INT NOT NULL,
  page_image_url TEXT,
  ocr_text LONGTEXT,
  embedding JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pages_textbook FOREIGN KEY (textbook_id) REFERENCES textbooks(id) ON DELETE CASCADE
);

CREATE TABLE tasks (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  textbook_id BIGINT,
  topic_id BIGINT,
  task_number VARCHAR(128) NOT NULL,
  statement LONGTEXT NOT NULL,
  answer_short TEXT,
  answer_full LONGTEXT,
  difficulty SMALLINT DEFAULT 1,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tasks_textbook FOREIGN KEY (textbook_id) REFERENCES textbooks(id) ON DELETE CASCADE,
  CONSTRAINT fk_tasks_topic FOREIGN KEY (topic_id) REFERENCES textbook_topics(id) ON DELETE SET NULL
);

CREATE TABLE solution_styles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(64) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  prompt_template LONGTEXT NOT NULL
);

CREATE TABLE ai_sessions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  textbook_id BIGINT,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  mode VARCHAR(64) NOT NULL,
  metadata JSON,
  CONSTRAINT fk_ai_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_ai_sessions_textbook FOREIGN KEY (textbook_id) REFERENCES textbooks(id) ON DELETE SET NULL
);

CREATE TABLE ai_messages (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  session_id BIGINT,
  role VARCHAR(32) NOT NULL,
  content LONGTEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ai_messages_session FOREIGN KEY (session_id) REFERENCES ai_sessions(id) ON DELETE CASCADE
);

CREATE TABLE ai_solutions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  session_id BIGINT,
  task_id BIGINT,
  style_id BIGINT,
  request_text LONGTEXT,
  response_text LONGTEXT NOT NULL,
  quality_score DECIMAL(4,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ai_solutions_session FOREIGN KEY (session_id) REFERENCES ai_sessions(id) ON DELETE CASCADE,
  CONSTRAINT fk_ai_solutions_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL,
  CONSTRAINT fk_ai_solutions_style FOREIGN KEY (style_id) REFERENCES solution_styles(id) ON DELETE SET NULL
);

CREATE TABLE uploads (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  source VARCHAR(128) NOT NULL,
  mime_type VARCHAR(128),
  file_size BIGINT,
  storage_key VARCHAR(512) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_uploads_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE moderation_events (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  message_id BIGINT,
  policy_name VARCHAR(255),
  status VARCHAR(64),
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_mod_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_mod_message FOREIGN KEY (message_id) REFERENCES ai_messages(id) ON DELETE CASCADE
);

INSERT INTO countries (code, name_ru, name_en) VALUES
('KZ', 'Казахстан', 'Kazakhstan'),
('RU', 'Россия', 'Russia'),
('BY', 'Беларусь', 'Belarus'),
('KG', 'Кыргызстан', 'Kyrgyzstan'),
('UZ', 'Узбекистан', 'Uzbekistan'),
('TJ', 'Таджикистан', 'Tajikistan'),
('AM', 'Армения', 'Armenia'),
('AZ', 'Азербайджан', 'Azerbaijan'),
('MD', 'Молдова', 'Moldova');

INSERT INTO subjects (code, name_ru, name_en) VALUES
('math', 'Математика', 'Mathematics'),
('algebra', 'Алгебра', 'Algebra'),
('geometry', 'Геометрия', 'Geometry'),
('physics', 'Физика', 'Physics'),
('chemistry', 'Химия', 'Chemistry'),
('biology', 'Биология', 'Biology'),
('history', 'История', 'History'),
('geography', 'География', 'Geography'),
('language_ru', 'Русский язык', 'Russian Language'),
('literature', 'Литература', 'Literature'),
('english', 'Английский язык', 'English Language'),
('informatics', 'Информатика', 'Informatics');

INSERT INTO solution_styles (code, title, prompt_template) VALUES
('school_classic', 'Школьный классический метод', 'Реши строго по школьной методике, с записью "Дано", "Решение", "Ответ".'),
('simple_explain', 'Простое объяснение', 'Объясни тему максимально просто и дружелюбно, без сложной терминологии.'),
('exam_fast', 'Краткий формат для проверки', 'Дай короткое, но корректное решение с ключевыми шагами.');
