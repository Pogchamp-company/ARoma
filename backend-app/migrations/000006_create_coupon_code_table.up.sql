CREATE TABLE coupon_codes
(
    id    serial       not null
        constraint coupon_codes_pkey primary key,
    title varchar(20) NOT NULL UNIQUE,
    sale int NOT NULL,
    expired_at date NOT NULL
);

ALTER TABLE orders
ADD COLUMN coupon_code_id int constraint order_coupon_code_id_fkey references coupon_codes;