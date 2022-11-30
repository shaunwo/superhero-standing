CREATE TABLE users (
  user_id INT PRIMARY KEY,
  username VARCHAR(25) UNIQUE,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  location TEXT NULL,
  bio TEXT NULL,
  image_url TEXT NULL,
  created_dt TIMESTAMP NOT NULL DEFAULT NOW(),
  last_updated_dt TIMESTAMP NULL,
  active BOOLEAN NOT NULL
);

CREATE TABLE user_connections (
  connection_id INT PRIMARY KEY,
  connector_user_id INT NOT NULL,
  connectee_user_id INT NOT NULL,
  created_dt TIMESTAMP NOT NULL DEFAULT NOW(),
  last_updated_dt TIMESTAMP NULL,
  status SMALLINT NOT NULL,
  active BOOLEAN NOT NULL
);

CREATE TABLE follows (
  follow_id INT PRIMARY KEY,
  user_id INT NOT NULL,
  superhero_id INT NOT NULL,
  created_dt TIMESTAMP NOT NULL DEFAULT NOW(),
  last_updated_dt TIMESTAMP NULL,
  active BOOLEAN NOT NULL
);

CREATE TABLE likes (
  like_id INT PRIMARY KEY,
  user_id INT NOT NULL,
  superhero_id INT NOT NULL,
  created_dt TIMESTAMP NOT NULL DEFAULT NOW(),
  last_updated_dt TIMESTAMP NULL,
  active BOOLEAN NOT NULL
);

CREATE TABLE recent_activity (
  activity_id INT PRIMARY KEY,
  user_id INT NOT NULL,
  description TEXT NULL,
  created_dt TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE comments (
  comment_id INT PRIMARY KEY,
  user_id INT NOT NULL,
  superhero_id INT NOT NULL,
  comments TEXT NULL,
  created_dt TIMESTAMP NOT NULL DEFAULT NOW(),
  last_updated_dt TIMESTAMP NULL,
  active BOOLEAN NOT NULL
);

CREATE TABLE comment_likes (
  comment_like_id INT PRIMARY KEY,
  user_id INT NOT NULL,
  comment_id INT NOT NULL,
  created_dt TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE images (
  image_url TEXT PRIMARY KEY,
  user_id INT NOT NULL,
  superhero_id INT NOT NULL,
  created_dt TIMESTAMP NOT NULL DEFAULT NOW(),
  active BOOLEAN NOT NULL
);

CREATE TABLE image_likes (
  image_like_id INT PRIMARY KEY,
  user_id INT NOT NULL,
  image_url TEXT NOT NULL,
  created_dt TIMESTAMP NOT NULL DEFAULT NOW()
);