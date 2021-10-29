CREATE TABLE shipping_methods
(
    id    SERIAL       NOT NULL CONSTRAINT shipping_methods_pkey PRIMARY KEY ,
    title VARCHAR(255) NOT NULL,
    price FLOAT        NOT NULL
);

ALTER TABLE orders
    ADD COLUMN shipping_method_id INT NOT NULL CONSTRAINT order_shipping_method_id_fkey REFERENCES shipping_methods;

ALTER TABLE products
    ADD COLUMN quantity_in_stock INT NOT NULL DEFAULT 100,
    ALTER COLUMN attributes TYPE JSONB;