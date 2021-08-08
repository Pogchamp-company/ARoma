CREATE TABLE users
(
    id              SERIAL       NOT NULL CONSTRAINT users_pkey PRIMARY KEY ,
    nickname        VARCHAR(255) NOT NULL UNIQUE,
    email           VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL UNIQUE
);