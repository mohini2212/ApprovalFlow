USE approvalflow;

-- ==========================================
-- 1. CREATIVE APPROVALS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS creative_approvals (

    approval_id INT AUTO_INCREMENT PRIMARY KEY,

    creative_id INT NOT NULL,

    client_id INT NOT NULL,

    agency_id INT NOT NULL,

    approval_status ENUM(
        'Pending',
        'Approved',
        'Changes Requested'
    ) DEFAULT 'Pending',

    client_feedback TEXT,

    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    approved_at DATETIME DEFAULT NULL,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP

);

-- ==========================================
-- 2. APPROVAL HISTORY TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS approval_history (

    history_id INT AUTO_INCREMENT PRIMARY KEY,

    approval_id INT NOT NULL,

    action ENUM(
        'Submitted',
        'Approved',
        'Changes Requested',
        'Resubmitted'
    ) NOT NULL,

    feedback TEXT,

    action_by INT NOT NULL,

    action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (approval_id)
    REFERENCES creative_approvals(approval_id)
    ON DELETE CASCADE

);

-- ==========================================
-- 3. APPROVAL COMMENTS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS approval_comments (

    comment_id INT AUTO_INCREMENT PRIMARY KEY,

    approval_id INT NOT NULL,

    user_id INT NOT NULL,

    comment TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (approval_id)
    REFERENCES creative_approvals(approval_id)
    ON DELETE CASCADE

);

-- ==========================================
-- 4. APPROVAL NOTIFICATIONS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS approval_notifications (

    notification_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    approval_id INT NOT NULL,

    message VARCHAR(255) NOT NULL,

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (approval_id)
    REFERENCES creative_approvals(approval_id)
    ON DELETE CASCADE

);

-- ==========================================
-- 5. INDEXES FOR BETTER PERFORMANCE
-- ==========================================

CREATE INDEX idx_approval_status
ON creative_approvals(approval_status);

CREATE INDEX idx_approval_client
ON creative_approvals(client_id);

CREATE INDEX idx_approval_agency
ON creative_approvals(agency_id);

CREATE INDEX idx_history_approval
ON approval_history(approval_id);