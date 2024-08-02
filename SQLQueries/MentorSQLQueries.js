export const userDtlsQuery = `
          INSERT INTO [dbo].[users_dtls] (
            [user_email],
            [user_pwd],
            [user_firstname],
            [user_lastname],
            [user_phone_number],
            [user_status],
            [user_modified_by],
            [user_type],
            [user_is_superadmin],
            [user_logindate],
            [user_logintime],
            [user_token]
          ) OUTPUT INSERTED.user_dtls_id VALUES (
            @user_email,
            @user_pwd,
            @user_firstname,
            @user_lastname,
            @user_phone_number,
            @user_status,
            @user_modified_by,
            @user_type,
            @user_is_superadmin,
            @user_logindate,
            @user_logintime,
            @user_token
          );
          `;

export const mentorDtlsQuery = `
  INSERT INTO [dbo].[mentor_dtls] (
    [mentor_user_dtls_id],
    [mentor_phone_number],
    [mentor_email],
    [mentor_profile_photo],
    [mentor_social_media_profile],
    [mentor_job_title],
    [mentor_company_name],
    [mentor_years_of_experience],
    [mentor_academic_qualification],
    [mentor_recommended_area_of_mentorship],
    [mentor_guest_lectures_interest],
    [mentor_curating_case_studies_interest],
    [mentor_sessions_free_of_charge],
    [mentor_language],
    [mentor_timezone],
    [mentor_country],
    [mentor_dtls_cr_date],
    [mentor_dtls_update_date],
    [mentor_headline]
  ) OUTPUT INSERTED.mentor_dtls_id VALUES (
    @mentor_user_dtls_id,
    @mentor_phone_number,
    @mentor_email,
    @mentor_profile_photo,
    @mentor_social_media_profile,
    @mentor_job_title,
    @mentor_company_name,
    @mentor_years_of_experience,
    @mentor_academic_qualification,
    @mentor_recommended_area_of_mentorship,
    @mentor_guest_lectures_interest,
    @mentor_curating_case_studies_interest,
    @mentor_sessions_free_of_charge,
    @mentor_language,
    @mentor_timezone,
    @mentor_country,
    @mentor_dtls_cr_date,
    @mentor_dtls_update_date,
    @mentor_headline
  );
`;

export const mentorExpertiseQuery = `
        INSERT INTO mentor_expertise_dtls 
        (mentor_dtls_id, mentor_expertise, mentor_exp_cr_date, mentor_exp_update_date)
        VALUES (@mentor_dtls_id, @mentor_expertise, @mentor_exp_cr_date, @mentor_exp_update_date)
      `;
// fetch single mentor working
export const fetchSingleMentorQuery = `SELECT 
    u.[user_dtls_id],
    u.[user_email],
    u.[user_firstname],
    u.[user_lastname],
    u.[user_phone_number],
    u.[user_status],
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
    m.[mentor_headline],
    m.[mentor_approved_status],
    MAX(e.[mentor_expertise_id]) AS mentor_expertise_id,
    MAX(e.[mentor_expertise]) AS mentor_expertise,
    MAX(p.[mentor_passion_id]) AS mentor_passion_id,
    MAX(p.[mentor_passion]) AS mentor_passion,
    MAX(t.[mentor_timeslot_id]) AS mentor_timeslot_id,
    MAX(t.[mentor_timeslot_day]) AS mentor_timeslot_day,
    MAX(t.[mentor_timeslot_from]) AS mentor_timeslot_from,
    MAX(t.[mentor_timeslot_to]) AS mentor_timeslot_to,
    MAX(t.[mentor_timeslot_rec_indicator]) AS mentor_timeslot_rec_indicator,
    MAX(t.[mentor_timeslot_rec_end_timeframe]) AS mentor_timeslot_rec_end_timeframe,
    MAX(t.[mentor_timeslot_booking_status]) AS mentor_timeslot_booking_status
FROM 
    [dbo].[users_dtls] u
JOIN 
    [dbo].[mentor_dtls] m ON u.[user_dtls_id] = m.[mentor_user_dtls_id]
LEFT JOIN 
    [dbo].[mentor_expertise_dtls] e ON m.[mentor_dtls_id] = e.[mentor_dtls_id]
LEFT JOIN 
    [dbo].[mentor_passion_dtls] p ON m.[mentor_dtls_id] = p.[mentor_dtls_id]
LEFT JOIN 
    [dbo].[mentor_timeslots_dtls] t ON m.[mentor_dtls_id] = t.[mentor_dtls_id]
WHERE 
    u.[user_dtls_id] = @desired_mentor_dtls_id
GROUP BY
    u.[user_dtls_id],
    u.[user_email],
    u.[user_firstname],
    u.[user_lastname],
    u.[user_phone_number],
    u.[user_status],
    u.[user_modified_by],
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
    m.[mentor_headline],
    m.[mentor_approved_status];
`;
// fetch all mentor queries
export const fetchAllMentorQuery = `SELECT 
    u.[user_dtls_id],
    u.[user_email],
    u.[user_firstname],
    u.[user_lastname],
    u.[user_phone_number],
    u.[user_status],
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
    m.[mentor_headline],
    m.[mentor_approved_status],
    MAX(e.[mentor_expertise_id]) AS mentor_expertise_id,
    MAX(e.[mentor_expertise]) AS mentor_expertise,
    MAX(p.[mentor_passion_id]) AS mentor_passion_id,
    MAX(p.[mentor_passion]) AS mentor_passion,
    MAX(t.[mentor_timeslot_id]) AS mentor_timeslot_id,
    MAX(t.[mentor_timeslot_day]) AS mentor_timeslot_day,
    MAX(t.[mentor_timeslot_from]) AS mentor_timeslot_from,
    MAX(t.[mentor_timeslot_to]) AS mentor_timeslot_to,
    MAX(t.[mentor_timeslot_rec_indicator]) AS mentor_timeslot_rec_indicator,
    MAX(t.[mentor_timeslot_rec_end_timeframe]) AS mentor_timeslot_rec_end_timeframe,
    MAX(t.[mentor_timeslot_booking_status]) AS mentor_timeslot_booking_status
FROM 
    [dbo].[users_dtls] u
JOIN 
    [dbo].[mentor_dtls] m ON u.[user_dtls_id] = m.[mentor_user_dtls_id]
LEFT JOIN 
    [dbo].[mentor_expertise_dtls] e ON m.[mentor_dtls_id] = e.[mentor_dtls_id]
LEFT JOIN 
    [dbo].[mentor_passion_dtls] p ON m.[mentor_dtls_id] = p.[mentor_dtls_id]
LEFT JOIN 
    [dbo].[mentor_timeslots_dtls] t ON m.[mentor_dtls_id] = t.[mentor_dtls_id]
WHERE 
    m.[mentor_approved_status] = 'Yes'
GROUP BY
    u.[user_dtls_id],
    u.[user_email],
    u.[user_firstname],
    u.[user_lastname],
    u.[user_phone_number],
    u.[user_status],
    u.[user_modified_by],
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
    m.[mentor_headline],
    m.[mentor_approved_status];
`;

// end

//
export const mentorSelectSQLQuery = `
SELECT 
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
    m.[mentor_headline],
    m.[mentor_approved_status],
    u.[user_dtls_id],
    u.[user_email],
    u.[user_pwd],
    u.[user_firstname],
    u.[user_lastname],
    u.[user_phone_number],
    u.[user_type],
    u.[user_is_superadmin]
FROM 
    [dbo].[mentor_dtls] m
INNER JOIN 
    [dbo].[users_dtls] u
ON 
    m.[mentor_user_dtls_id] = u.[user_dtls_id]
WHERE 
    m.[mentor_approved_status] = 'Yes';

`;

export const newQuery = `SELECT 
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
    m.[mentor_headline],
    m.[mentor_approved_status],
    STRING_AGG(p.[mentor_passion], ', ') AS mentor_passions,
    STRING_AGG(e.[mentor_expertise], ', ') AS mentor_expertise,
    STRING_AGG(
        t.[mentor_timeslot_day] + ' ' +
        t.[mentor_timeslot_from] + '-' +
        t.[mentor_timeslot_to] + ' (' +
        t.[mentor_timeslot_rec_indicator] + ', ' +
        t.[mentor_timeslot_rec_end_timeframe] + ', ' +
        t.[mentor_timeslot_booking_status] + ')', '; '
    ) AS mentor_timeslots
FROM 
    [dbo].[mentor_dtls] m
LEFT JOIN 
    [dbo].[mentor_passion_dtls] p ON m.[mentor_dtls_id] = p.[mentor_dtls_id]
LEFT JOIN 
    [dbo].[mentor_expertise_dtls] e ON m.[mentor_dtls_id] = e.[mentor_dtls_id]
LEFT JOIN 
    [dbo].[mentor_timeslots_dtls] t ON m.[mentor_dtls_id] = t.[mentor_dtls_id]
WHERE 
    m.[mentor_approved_status] = 'Yes'
GROUP BY
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
    m.[mentor_headline],
    m.[mentor_approved_status];
`;

export const createQuery = `SELECT 
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
    m.[mentor_headline],
    m.[mentor_approved_status],
    e.[mentor_expertise_id],
    e.[mentor_expertise],
    p.[mentor_passion_id],
    p.[mentor_passion],
    t.[mentor_timeslot_id],
    t.[mentor_timeslot_day],
    t.[mentor_timeslot_from],
    t.[mentor_timeslot_to],
    t.[mentor_timeslot_rec_indicator],
    t.[mentor_timeslot_rec_end_timeframe],
    t.[mentor_timeslot_booking_status]
FROM 
    [dbo].[mentor_dtls] m
LEFT JOIN 
    [dbo].[mentor_expertise_dtls] e ON m.[mentor_dtls_id] = e.[mentor_dtls_id]
LEFT JOIN 
    [dbo].[mentor_passion_dtls] p ON m.[mentor_dtls_id] = p.[mentor_dtls_id]
LEFT JOIN 
    [dbo].[mentor_timeslots_dtls] t ON m.[mentor_dtls_id] = t.[mentor_dtls_id];
`;
