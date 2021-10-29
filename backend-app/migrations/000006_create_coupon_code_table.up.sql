CREATE TABLE coupon_codes
(
    id         SERIAL       NOT NULL CONSTRAINT coupon_codes_pkey PRIMARY KEY ,
    title      VARCHAR(20)  NOT NULL UNIQUE,
    sale       INT          NOT NULL,
    expired_at DATE         NOT NULL
);

ALTER TABLE orders
    ADD COLUMN coupon_code_id INT CONSTRAINT order_coupon_code_id_fkey REFERENCES coupon_codes;