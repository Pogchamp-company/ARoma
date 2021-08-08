AlTER TABLE products
    ADD COLUMN price            FLOAT         NOT NULL DEFAULT 5.0,
    ADD COLUMN description      VARCHAR(1024) NOT NULL DEFAULT '',
    ADD COLUMN long_description TEXT          NOT NULL DEFAULT '';