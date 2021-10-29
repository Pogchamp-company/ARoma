AlTER TABLE products
    DROP COLUMN IF EXISTS price,
    DROP COLUMN IF EXISTS description,
    DROP COLUMN IF EXISTS long_description;