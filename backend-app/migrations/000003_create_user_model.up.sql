CREATE TABLE users
(
    id      serial not null constraint users_pkey primary key,
    nickname   VARCHAR(255) UNIQUE NOT NULL,
    email   VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) UNIQUE NOT NULL
);