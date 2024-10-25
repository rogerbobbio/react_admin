CREATE TABLE country (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,    
    user_create INT NULL,
    create_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_update INT NULL,
    update_date DATETIME NULL
);

CREATE TABLE league (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,    
    user_create INT NULL,
    create_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_update INT NULL,
    update_date DATETIME NULL
);

CREATE TABLE player_position (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(10) NOT NULL,    
    user_create INT NULL,
    create_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_update INT NULL,
    update_date DATETIME NULL
);

CREATE TABLE player_version (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(100) NOT NULL,     
    user_create INT NULL,
    create_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_update INT NULL,
    update_date DATETIME NULL
);

CREATE TABLE player_zone (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(3) NOT NULL,
    player_position_id INT,
    user_create INT NULL,
    create_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_update INT NULL,
    update_date DATETIME NULL,
    INDEX player_position_id_index (player_position_id),
    FOREIGN KEY (player_position_id)
        REFERENCES player_position(id)
        ON DELETE CASCADE    
);

CREATE TABLE league_team (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    league_id INT,
    user_create INT NULL,
    create_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_update INT NULL,
    update_date DATETIME NULL,
    INDEX league_id_index (league_id),
    FOREIGN KEY (league_id)
        REFERENCES league(id)
        ON DELETE CASCADE    
);


CREATE TABLE player (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    league_id INT,
    league_team_id INT,
    player_version_id INT,
    player_position_id INT,
    player_zone_id INT,    
    country_id INT,
    rating INT,
    player_type VARCHAR(6) NOT NULL,
    duplicate BOOLEAN NOT NULL,
    duplicate_times INT,
    player_seleted BOOLEAN NOT NULL,
    player_deleted BOOLEAN NOT NULL,
    datetime_deleted DATETIME NULL,
    order_number INT,
        
    user_create INT NULL,
    create_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_update INT NULL,
    update_date DATETIME NULL,
    
    INDEX league_id_index (league_id),
    FOREIGN KEY (league_id)
        REFERENCES league(id)
        ON DELETE CASCADE,
    INDEX league_team_id_index (league_team_id),
    FOREIGN KEY (league_team_id)
        REFERENCES league_team(id)
        ON DELETE CASCADE,
	INDEX player_version_id_index (player_version_id),
    FOREIGN KEY (player_version_id)
        REFERENCES player_version(id)
        ON DELETE CASCADE,
    INDEX player_position_id_index (player_position_id),
    FOREIGN KEY (player_position_id)
        REFERENCES player_position(id)
        ON DELETE CASCADE,
    INDEX player_zone_id_index (player_zone_id),
    FOREIGN KEY (player_zone_id)
        REFERENCES player_zone(id)
        ON DELETE CASCADE,	
    INDEX country_id_index (country_id),
    FOREIGN KEY (country_id)
        REFERENCES country(id)
        ON DELETE CASCADE
);