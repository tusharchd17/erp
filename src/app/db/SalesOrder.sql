CREATE TABLE SalesOrder (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_date    TIMESTAMP NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    total_amount  DECIMAL(12, 2) NOT NULL,
    status        VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled')),
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
