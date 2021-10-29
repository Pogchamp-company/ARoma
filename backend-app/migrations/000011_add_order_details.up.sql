CREATE TABLE addresses
(
    id          SERIAL       NOT NULL CONSTRAINT addresses_pkey PRIMARY KEY,
    country     VARCHAR(60)  NOT NULL,
    city        VARCHAR(60)  NOT NULL,
    route       VARCHAR(60)  NOT NULL,
    zip_code    VARCHAR(10)  NOT NULL
);

CREATE TABLE order_details
(
    order_id     INT            NOT NULL CONSTRAINT order_details_fkey REFERENCES orders PRIMARY KEY,
    address_id   INT            NOT NULL CONSTRAINT order_details_address_id_fkey REFERENCES addresses,
    first_name   VARCHAR(100)   NOT NULL,
    last_name    VARCHAR(100)   NOT NULL,
    phone_number VARCHAR(15)    NOT NULL,
    extra_info   VARCHAR(1024)  NOT NULL
);