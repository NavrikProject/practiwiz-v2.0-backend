// fetch all mentor queries
export const fetchAllApprovedMentorQuery = `SELECT 
    u.[user_dtls_id],
    u.[user_email],
    u.[user_firstname],
    u.[user_lastname],
    u.[user_phone_number],
    u.[user_type],
    u.[user_is_superadmin],
    m.[mentor_dtls_id],
    m.[mentor_user_dtls_id],
    m.[mentor_phone_number],
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
    ) AS timeslot_list
FROM 
    [dbo].[users_dtls] u
JOIN 
    [dbo].[mentor_dtls] m
ON 
    u.[user_dtls_id] = m.[mentor_user_dtls_id]
WHERE
    m.[mentor_approved_status] = 'Yes'
`;
export const fetchAllNotApprovedMentorQuery = `SELECT 
    u.[user_dtls_id],
    u.[user_email],
    u.[user_firstname],
    u.[user_lastname],
    u.[user_phone_number],
    u.[user_type],
    u.[user_is_superadmin],
    m.[mentor_dtls_id],
    m.[mentor_user_dtls_id],
    m.[mentor_phone_number],
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
    ) AS timeslot_list
FROM 
    [dbo].[users_dtls] u
JOIN 
    [dbo].[mentor_dtls] m
ON 
    u.[user_dtls_id] = m.[mentor_user_dtls_id]
WHERE
    m.[mentor_approved_status] = 'No'
`;

export const UpdateMentorToDisapproveQuery = `update mentor_dtls set mentor_approved_status = 'No' where mentor_dtls_id = @mentorUserDtls;
`;
export const UpdateMentorToApproveQuery = `update mentor_dtls set mentor_approved_status = 'Yes' where mentor_dtls_id = @mentorUserDtls`;

export const fetchAllMentorUpcomingSessionsQuery = `SELECT 
    mba.[mentor_booking_appt_id],
    mba.[mentor_dtls_id],
    mba.[mentee_user_dtls_id],
    mba.[mentor_session_booking_date],
    mba.[mentor_session_status],
    mba.[trainee_session_status],
    mba.[mentor_booking_time],
    mba.[mentor_booking_confirmed],
    mba.[practy_team_host_url],
    mentee.[user_email] AS mentee_email,
    mentee.[user_firstname] AS mentee_firstname,
    mentee.[user_lastname] AS mentee_lastname,
    mentee.[user_phone_number] AS mentee_phone_number,
    mentor.[user_email] AS mentor_email,
    mentor.[user_firstname] AS mentor_firstname,
    mentor.[user_lastname] AS mentor_lastname,
    mentor.[user_phone_number] AS mentor_phone_number,
    mentor.[user_dtls_id] AS mentor_dtls_id
FROM 
    [dbo].[mentor_booking_appointments_dtls] mba
JOIN 
    [dbo].[users_dtls] mentee 
ON 
    mba.[mentee_user_dtls_id] = mentee.[user_dtls_id]
JOIN 
    [dbo].[mentor_dtls] md 
ON 
    mba.[mentor_dtls_id] = md.[mentor_dtls_id]
JOIN 
    [dbo].[users_dtls] mentor
ON 
    md.[mentor_user_dtls_id] = mentor.[user_dtls_id]
where 
    mba.[mentor_session_status] = 'upcoming' and mba.[trainee_session_status] = 'upcoming' and mba.[mentor_session_booking_date] >= CAST(GETDATE() AS DATE);`;

export const fetchAllMentorCompletedSessionsQuery = `
SELECT 
    mba.[mentor_booking_appt_id],
    mba.[mentor_dtls_id],
    mba.[mentee_user_dtls_id],
    mba.[mentor_session_booking_date],
    mba.[mentor_booking_time],
    mba.[mentor_booking_confirmed],
    mba.[practy_team_host_url],
    mba.[mentor_session_status],
    mentee.[user_email] AS mentee_email,
    mentee.[user_firstname] AS mentee_firstname,
    mentee.[user_lastname] AS mentee_lastname,
    mentee.[user_phone_number] AS mentee_phone_number,
    mentor.[user_email] AS mentor_email,
    mentor.[user_firstname] AS mentor_firstname,
    mentor.[user_lastname] AS mentor_lastname,
    mentor.[user_phone_number] AS mentor_phone_number,
    feedback.[mentor_appt_booking_dtls_id],
    feedback.[mentor_feedback_session_overall_rating],
    feedback.[mentor_feedback_session_platform_rating],
    feedback.[mentor_feedback_dtls_cr_date],
    mentee1.[mentee_profile],
    mentee1.[mentee_dtls_id]
FROM 
    [dbo].[mentor_booking_appointments_dtls] mba
JOIN 
    [dbo].[users_dtls] mentee 
ON 
    mba.[mentee_user_dtls_id] = mentee.[user_dtls_id]
JOIN 
    [dbo].[mentor_dtls] md 
ON 
    mba.[mentor_dtls_id] = md.[mentor_dtls_id]
JOIN 
    [dbo].[users_dtls] mentor
ON 
    md.[mentor_user_dtls_id] = mentor.[user_dtls_id]
JOIN 
    [dbo].[mentee_dtls] mentee1 
ON 
    mba.[mentee_user_dtls_id] = mentee1.[mentee_user_dtls_id]
LEFT JOIN 
    [dbo].[mentor_feedback_dtls] feedback
ON
    mba.[mentor_booking_appt_id] = feedback.[mentor_appt_booking_dtls_id]
WHERE 
    mba.[mentor_session_status] = 'completed' 
    AND mba.[trainee_session_status] = 'completed' 
    AND mba.[mentor_session_booking_date] < CAST(GETDATE() AS DATE);
`;

export const fetchAllMentorInCompletedSessionsQuery = `
SELECT 
    mba.[mentor_booking_appt_id],
    mba.[mentor_dtls_id],
    mba.[mentee_user_dtls_id],
    mba.[mentor_session_booking_date],
    mba.[mentor_session_status],
    mba.[trainee_session_status],
    mba.[mentor_booking_time],
    mba.[mentor_booking_confirmed],
    mba.[practy_team_host_url],
    mentee.[user_email] AS mentee_email,
    mentee.[user_firstname] AS mentee_firstname,
    mentee.[user_lastname] AS mentee_lastname,
    mentee.[user_phone_number] AS mentee_phone_number,
    mentor.[user_email] AS mentor_email,
    mentor.[user_firstname] AS mentor_firstname,
    mentor.[user_lastname] AS mentor_lastname,
    mentor.[user_phone_number] AS mentor_phone_number,
    mentor.[user_dtls_id] AS mentor_dtls_id
FROM 
    [dbo].[mentor_booking_appointments_dtls] mba
JOIN 
    [dbo].[users_dtls] mentee 
ON 
    mba.[mentee_user_dtls_id] = mentee.[user_dtls_id]
JOIN 
    [dbo].[mentor_dtls] md 
ON 
    mba.[mentor_dtls_id] = md.[mentor_dtls_id]
JOIN 
    [dbo].[users_dtls] mentor
ON 
    md.[mentor_user_dtls_id] = mentor.[user_dtls_id]
where 
    mba.[mentor_session_status] = 'upcoming' and mba.[trainee_session_status] = 'upcoming' and mba.[mentor_session_booking_date] < CAST(GETDATE() AS DATE);
`;
