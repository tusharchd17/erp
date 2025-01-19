CREATE TABLE SalesOrderItem (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sales_order_id UUID NOT NULL,
    product_id     UUID NOT NULL,
    quantity       INT NOT NULL,
    unit_price     DECIMAL(12, 2) NOT NULL,
    total_price    DECIMAL(12, 2) NOT NULL,
    FOREIGN KEY (sales_order_id) REFERENCES SalesOrder(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Product(id) ON DELETE CASCADE
);
