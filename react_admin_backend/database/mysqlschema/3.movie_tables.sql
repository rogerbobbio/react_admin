-- drop table language;

CREATE TABLE language (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(50) NOT NULL,    
    user_create INT NULL,
    create_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_update INT NULL,
    update_date DATETIME NULL
);

-- drop table actor;

CREATE TABLE actor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,    
    user_create INT NULL,
    create_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_update INT NULL,
    update_date DATETIME NULL
);

-- drop table movie_category;

CREATE TABLE movie_category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(100) NOT NULL,    
    user_create INT NULL,
    create_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_update INT NULL,
    update_date DATETIME NULL
);

-- drop table movie;

CREATE TABLE movie (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(200) NOT NULL UNIQUE,
    link VARCHAR(1000) NOT NULL UNIQUE,
    ranking INT NOT NULL,
    subtitle BOOLEAN NOT NULL,
    serie BOOLEAN NOT NULL,
    note VARCHAR(1000) NULL,
    category_id INT NOT NULL,
    actor_id INT NOT NULL,
    language_id INT NOT NULL,
    user_create INT NULL,
    create_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_update INT NULL,
    update_date DATETIME NULL,
    INDEX category_id_index (category_id),
    FOREIGN KEY (category_id)
        REFERENCES movie_category(id)
        ON DELETE CASCADE,
    INDEX actor_id_index (actor_id),
    FOREIGN KEY (actor_id)
        REFERENCES actor(id)
        ON DELETE CASCADE,
    INDEX language_id_index (language_id),
    FOREIGN KEY (language_id)
        REFERENCES language(id)
        ON DELETE CASCADE   
);


ALTER TABLE movie ADD old BOOLEAN NOT NULL

ALTER TABLE movie ADD converting BOOLEAN NOT NULL

ALTER TABLE movie ADD pending BOOLEAN NOT NULL