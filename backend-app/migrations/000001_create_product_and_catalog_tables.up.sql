CREATE TABLE catalogs
(
    id      SERIAL       NOT NULL CONSTRAINT catalogs_pkey primary key,
    title   VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE products
(
    id          SERIAL       NOT NULL CONSTRAINT products_pkey PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    catalog_id  INT          NOT NULL CONSTRAINT product_catalog_id_fkey REFERENCES catalogs,
    attributes  JSON
);
