CREATE TABLE attachments
(
    id        SERIAL       NOT NULL CONSTRAINT attachments_pkey PRIMARY KEY ,
    uuid      uuid         NOT NULL UNIQUE,
    bucket    VARCHAR(40)  NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_ext  VARCHAR(5)   NOT NULL,
    file_size int          NOT NULL
);