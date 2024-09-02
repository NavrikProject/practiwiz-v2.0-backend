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
