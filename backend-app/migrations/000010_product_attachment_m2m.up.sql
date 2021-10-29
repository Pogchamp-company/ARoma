CREATE TABLE product_attachment
(
    product_id    INT NOT NULL CONSTRAINT attachment_product_id_fkey REFERENCES products,
    attachment_id INT NOT NULL CONSTRAINT product_attachment_id_fkey REFERENCES attachments,
    CONSTRAINT pk_product_attachment PRIMARY KEY (product_id, attachment_id)
);
