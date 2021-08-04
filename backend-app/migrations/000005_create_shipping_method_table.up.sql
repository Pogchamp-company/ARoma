CREATE TABLE shipping_methods
(
    id    serial       not null
        constraint shipping_methods_pkey primary key,
    title varchar(255) NOT NULL,
    price float        NOT NULL
);

ALTER TABLE orders
ADD COLUMN shipping_method_id int not null constraint order_shipping_method_id_fkey references shipping_methods;

ALTER TABLE products
ADD COLUMN quantity_in_stock int NOT NULL DEFAULT 100,
ALTER COLUMN attributes TYPE jsonb