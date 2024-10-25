use rbobbio_adminpro;

-- drop table user_role;

CREATE TABLE user_role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(50) NOT NULL,    
    user_create INT NULL,
    create_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_update INT NULL,
    update_date DATETIME NULL
);


INSERT INTO `user_role`
(`description`)
VALUES
('Administrador');


-- drop table system_user;

CREATE TABLE system_user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    firstName VARCHAR(20) NOT NULL,
    lastName VARCHAR(20) NOT NULL,
    password VARCHAR(100) NOT NULL,
    img VARCHAR(500)  NULL,    
    role_id INT,
    user_create INT NULL,
    create_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_update INT NULL,
    update_date DATETIME NULL,
    INDEX role_id_index (role_id),
    FOREIGN KEY (role_id)
        REFERENCES user_role(id)
        ON DELETE CASCADE    
);

-- drop table system_module;

CREATE TABLE system_module (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50) NOT NULL UNIQUE,
    icon VARCHAR(50) NOT NULL,
    order_no INT NOT NULL,
    user_create INT NULL,
    create_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_update INT NULL,
    update_date DATETIME NULL
);

-- drop table system_screen;

CREATE TABLE system_screen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50) NOT NULL UNIQUE,
    url VARCHAR(50) NULL,
    order_no INT NOT NULL,
    module_id INT NOT NULL,
    user_create INT NULL,
    create_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_update INT NULL,
    update_date DATETIME NULL,

    INDEX module_id_index (module_id),
    FOREIGN KEY (module_id)
        REFERENCES system_module(id)
        ON DELETE CASCADE
);


-- drop table system_permission;

CREATE TABLE system_permission (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    module_id INT NOT NULL,
    screen_id INT NOT NULL,
    access BOOLEAN NOT NULL,
    created BOOLEAN NOT NULL,
    edit BOOLEAN NOT NULL,
    deleted BOOLEAN NOT NULL,
    especial1 BOOLEAN NOT NULL,
    especial2 BOOLEAN NOT NULL,
    especial3 BOOLEAN NOT NULL,
    especial4 BOOLEAN NOT NULL,
    especial5 BOOLEAN NOT NULL,
    user_create INT NULL,
    create_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_update INT NULL,
    update_date DATETIME NULL,    

    INDEX role_id_index (role_id),
    FOREIGN KEY (role_id)
        REFERENCES user_role(id)
        ON DELETE CASCADE,
    INDEX module_id_index (module_id),
    FOREIGN KEY (module_id)
        REFERENCES system_module(id)
        ON DELETE CASCADE,
    INDEX screen_id_index (screen_id),
    FOREIGN KEY (screen_id)
        REFERENCES system_screen(id)
        ON DELETE CASCADE
);

-- drop table system_index;

CREATE TABLE system_index (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL UNIQUE,
    value INT NOT NULL
);

-- drop table system_loggin;

CREATE TABLE system_loggin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action  VARCHAR(50) NOT NULL,
    user_create INT NOT NULL,
    create_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);


-- drop table system_configuration;

CREATE TABLE system_configuration (
    igv_percentage INT NOT NULL,
    user_create INT NULL,
    create_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_update INT NULL,
    update_date DATETIME NULL
);


INSERT INTO system_configuration
(`igv_percentage`,
`user_create`)
VALUES
(
18,
6)