// check Bank details exists are not
export const CheckBankDetailsExistsQuery = `
select mentor_bank_user_dtls_id from  mentor_bank_dtls where mentor_bank_user_dtls_id = @mentorBankUserDtlsId`;

// inserting the bank details in to database
export const InsertBankDetailsQuery = `INSERT INTO [dbo].[mentor_bank_dtls] (
    [mentor_bank_user_dtls_id],
    [mentor_bank_mentor_dtls_id],
    [mentor_bank_account_holder_name],
    [mentor_bank_account_number],
    [mentor_bank_name],
    [mentor_bank_account_ifsc_code],
    [mentor_bank_branch],
    [mentor_bank_account_type],
    [mentor_bank_address],
    [mentor_bank_pan_number],
    [mentor_bank_swift_code],
    [mentor_bank_cr_date]
) VALUES (
    @mentorBankUserDtlsId,
    @mentorBankMentorDtlsId,
    @mentorBankAccountHolderName,
    @mentorBankAccountNumber,
    @mentorBankName,
    @mentorBankAccountIfscCode,
    @mentorBankBranch,
    @mentorBankAccountType,
    @mentorBankAddress,
    @mentorBankPanNumber,
    @mentorBankSwiftCode,
    @mentorBankCrDate
);
`;

// get the mentor details in the dashboard after login

// to fetch the booking details and timeslots and everything this is working right now
export const fetchMentorSingleDashboardQuery = `SELECT 
    u.[user_dtls_id],
    u.[user_email],
    u.[user_firstname],
    u.[user_lastname],
    u.[user_phone_number],
    u.[user_type],
    u.[user_is_superadmin],
    m.[mentor_dtls_id],
    m.[mentor_user_dtls_id],
    m.[mentor_email],
    m.[mentor_profile_photo],
    m.[mentor_social_media_profile],
    m.[mentor_job_title],
    m.[mentor_company_name],
    m.[mentor_years_of_experience],
    m.[mentor_academic_qualification],
    m.[mentor_recommended_area_of_mentorship],
    m.[mentor_guest_lectures_interest],
    m.[mentor_curating_case_studies_interest],
    m.[mentor_sessions_free_of_charge],
    m.[mentor_language],
    m.[mentor_timezone],
    m.[mentor_country],
    m.[mentor_dtls_cr_date],
    m.[mentor_dtls_update_date],
    m.[mentor_headline],
    m.[mentor_approved_status],
    m.[mentor_session_price],
    m.[mentor_currency_type],
    m.[mentor_city],
    (
        SELECT 
            e.[mentor_expertise_id],
            e.[mentor_expertise],
            e.[mentor_exp_cr_date],
            e.[mentor_exp_update_date]
        FROM 
            [dbo].[mentor_expertise_dtls] e
        WHERE 
            e.[mentor_dtls_id] = m.[mentor_dtls_id]
        FOR JSON PATH
    ) AS expertise_list,
    (
        SELECT 
            p.[mentor_passion_id],
            p.[mentor_passion],
            p.[mentor_passion_cr_date],
            p.[mentor_passion_update_date]
        FROM 
            [dbo].[mentor_passion_dtls] p
        WHERE 
            p.[mentor_dtls_id] = m.[mentor_dtls_id]
        FOR JSON PATH
    ) AS passion_list,
    (
        SELECT 
            t.[mentor_timeslot_id],
            t.[mentor_dtls_id],
            t.[mentor_timeslot_day],
            t.[mentor_timeslot_from],
            t.[mentor_timeslot_to],
            t.[mentor_timeslot_rec_indicator],
            t.[mentor_timeslot_rec_end_timeframe],
            t.[mentor_timeslot_rec_cr_date],
            t.[mentor_timeslot_booking_status]
        FROM 
            [dbo].[mentor_timeslots_dtls] t
        WHERE 
            t.[mentor_dtls_id] = m.[mentor_dtls_id]
        FOR JSON PATH
    ) AS timeslot_list,
    (
        SELECT 
        n.[notification_dtls_id],
        n.[notification_user_dtls_id],
        n.[notification_type],
        n.[notification_heading],
        n.[notification_message],
        n.[notification_is_read],
        n.[notification_created_at],
        n.[notification_read_at]
        FROM 
            [dbo].[notifications_dtls] n
        WHERE 
            u.[user_dtls_id] = n.[notification_user_dtls_id]
        ORDER BY 
            n.[notification_created_at] DESC
        FOR JSON PATH
    ) AS notification_list,
    (
        SELECT 
        b.[mentor_dtls_id],
        b.[mentor_session_booking_date],
        b.[mentor_booked_date],
        b.[mentor_booking_starts_time],
        b.[mentor_booking_end_time],
        b.[mentor_booking_time],
        b.[mentor_booking_confirmed],
        b.[mentor_session_status]
        FROM 
            [dbo].[mentor_booking_appointments_dtls] b
        WHERE 
            b.[mentor_dtls_id] = m.[mentor_dtls_id] and b.[mentor_booking_confirmed] = 'Yes' or b.[mentor_booking_confirmed] = 'No'
        FOR JSON PATH
    ) AS booking_dtls_list,
     (
    SELECT 
        bank.[mentor_bank_dtls_id],
        bank.[mentor_bank_user_dtls_id],
        bank.[mentor_bank_mentor_dtls_id],
        bank.[mentor_bank_account_holder_name]
      ,bank.[mentor_bank_account_number]
      ,bank.[mentor_bank_name]
      ,bank.[mentor_bank_account_ifsc_code]
      ,bank.[mentor_bank_branch]
      ,bank.[mentor_bank_account_type]
      ,bank.[mentor_bank_address]
      ,bank.[mentor_bank_pan_number]
      ,bank.[mentor_bank_swift_code]
      ,bank.[mentor_bank_cr_date]
    FROM [dbo].[mentor_bank_dtls] bank
        WHERE 
            u.[user_dtls_id] = bank.[mentor_bank_user_dtls_id] 
        FOR JSON PATH
    ) AS banking_dtls_list,
    ISNULL(
        (SELECT COUNT(*) 
        FROM [dbo].[mentor_feedback_dtls] f
        WHERE f.[mentor_user_dtls_id] = m.[mentor_user_dtls_id]),
        0
    ) AS feedback_count,
    (
        SELECT AVG(CAST(f.[mentor_feedback_session_overall_rating] AS FLOAT))
        FROM [dbo].[mentor_feedback_dtls] f
        WHERE f.[mentor_user_dtls_id] = m.[mentor_user_dtls_id]
    ) AS avg_mentor_rating,
    (
        SELECT 
            f.[mentor_feedback_dtls_id],
            f.[mentor_appt_booking_dtls_id],
            f.[mentee_user_dtls_id],
            f.[mentor_feedback_detailed_fb],
            f.[mentor_feedback_add_fb_sugg],
            f.[mentor_feedback_session_overall_rating],
            f.[mentor_feedback_dtls_cr_date],
            mentee.[mentee_profile],
            uma.[user_firstname] as mentee_firstname,
            uma.[user_lastname] as mentee_lastname
        FROM 
            [dbo].[mentor_feedback_dtls] f
        JOIN
            [dbo].[mentee_dtls] mentee
        ON
            f.[mentee_user_dtls_id] = mentee.[mentee_user_dtls_id] 
        JOIN 
            [dbo].[users_dtls] uma
        ON
            f.[mentee_user_dtls_id] = uma.[user_dtls_id]
        WHERE 
            f.[mentor_user_dtls_id] = m.[mentor_user_dtls_id]
        FOR JSON PATH
    ) AS feedback_details
FROM 
    [dbo].[users_dtls] u
JOIN 
    [dbo].[mentor_dtls] m
ON 
    u.[user_dtls_id] = m.[mentor_user_dtls_id]
WHERE 
    u.[user_dtls_id] = @desired_mentor_dtls_id
`;

export const MarkMentorAllMessagesAsReadQuery = `update notifications_dtls set notification_is_read = 1, notification_read_at =@timestamp where notification_user_dtls_id = @mentorUserDtlsId`;

export const MarkMentorSingleMessageAsReadQuery = `update notifications_dtls set notification_is_read = 1, notification_read_at =@timestamp where notification_user_dtls_id = @mentorUserDtlsId and notification_dtls_id = @mentorNotificationId
`;

//showing the mentor completed session in the mentor dashboard completed page
export const MentorCompletedSessionsBookingQuery = ` SELECT 
    u.user_dtls_id,
    u.user_firstname as mentee_firstname,
    u.user_lastname as mentee_lastname,
    m.mentor_user_dtls_id,
    m.mentor_job_title,
    m.mentor_company_name,
    mba.mentor_booking_appt_id,
    mba.mentee_user_dtls_id,
    mba.mentor_session_booking_date,
    mba.mentor_booking_time
FROM 
    dbo.users_dtls u
INNER JOIN 
    dbo.mentor_dtls m ON u.user_dtls_id = m.mentor_user_dtls_id
INNER JOIN 
    dbo.mentor_booking_appointments_dtls mba ON m.mentor_dtls_id = mba.mentor_dtls_id
WHERE 
    u.user_dtls_id = @mentorUserDtlsId
    AND (mba.[mentor_booking_confirmed] = 'Yes' and mba.[mentor_session_status] = 'completed' AND mba.[trainee_session_status] = 'completed');
`;
