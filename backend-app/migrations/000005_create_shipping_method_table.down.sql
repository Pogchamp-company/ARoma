ALTER TABLE products
    DROP COLUMN quantity_in_stock,
    ALTER COLUMN attributes TYPE JSON;


ALTER TABLE orders
    DROP COLUMN shipping_method_id;

DROP TABLE shipping_methods;