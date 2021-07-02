CREATE TABLE catalogs
(
    id      serial not null constraint catalogs_pkey primary key,
    title   VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE products
(
    id          serial not null constraint products_pkey primary key,
    title       varchar(255) NOT NULL,
    catalog_id  int not null constraint product_catalog_id_fkey references catalogs,
    attributes json
);
