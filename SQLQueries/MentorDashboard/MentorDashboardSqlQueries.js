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
    m.[mentor_pricing],
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
    ) AS booking_dtls_list
FROM 
    [dbo].[users_dtls] u
JOIN 
    [dbo].[mentor_dtls] m
ON 
    u.[user_dtls_id] = m.[mentor_user_dtls_id]
WHERE 
    u.[user_dtls_id] = @desired_mentor_dtls_id 
`;
