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
    id      serial not null constraint orders_pkey primary key,
    order_status order_status,
    customer_id int not null constraint order_user_id_fkey references users
);


CREATE TABLE orders
(
    id      serial not null constraint orders_pkey primary key,
    order_status order_status,
    customer_id int not null constraint order_user_id_fkey references users
);


CREATE TABLE product_order
(
    order_id int not null constraint product_order_id_fkey references orders,
    product_id int not null constraint order_product_id_fkey references products,
    count int not null
);
