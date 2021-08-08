CREATE TYPE order_status AS ENUM (
    'DRAFT',
    'NOT_PAID',
    'PAID',
    'SHIPMENT',
    'AWAITING_RECEIPT',
    'COMPLETED'
);


CREATE TABLE orders
(
    id          SERIAL       NOT NULL CONSTRAINT orders_pkey PRIMARY KEY ,
    status      order_status NOT NULL DEFAULT 'DRAFT',
    customer_id INT          NOT NULL CONSTRAINT order_user_id_fkey REFERENCES users
);


CREATE TABLE product_order
(
    order_id   INT NOT NULL CONSTRAINT product_order_id_fkey REFERENCES orders,
    product_id INT NOT NULL CONSTRAINT order_product_id_fkey REFERENCES products,
    quantity   INT NOT NULL
);
