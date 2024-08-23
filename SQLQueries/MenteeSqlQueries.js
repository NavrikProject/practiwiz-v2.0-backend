export const MenteeRegisterQuery = `
          INSERT INTO [dbo].[mentee_dtls] (
            [mentee_user_dtls_id],
            [mentee_about],
            [mentee_skills],
            [mentee_gender],
            [mentee_type],
            [mentee_profile],
            [mentor_dtls_cr_date],
            [mentor_dtls_update_date]
        ) OUTPUT INSERTED.mentee_dtls_id VALUES (
            @menteeUserDtlsId,
            @menteeAbout,
            @menteeSkills,
            @menteeGender,
            @menteeType,
            @menteeProfilePic,
            @menteeCrDate,
            @menteeUpDate
        );
`;
export const MenteeApprovedBookingQueryTest = `SELECT  [mentor_booking_appt_id]
      ,[mentor_dtls_id]
      ,[mentee_user_dtls_id]
      ,[mentor_session_booking_date]
      ,[mentor_booking_time]
      ,[mentor_booking_confirmed]
      ,[mentor_host_url]
      ,[trainee_join_url]
      ,[mentor_amount_paid_status]
      ,[mentor_session_status]
      ,[mentor_rescheduled_times]
      ,[trainee_session_status]
      ,[trainee_modification_changed_times]
      ,[trainee_rescheduled_times]
      ,[trainee_and_mentor_reward_points]
  FROM [dbo].[mentor_booking_appointments_dtls] 
  where 
  mentee_user_dtls_id = @menteeUserDtlsId 
and mentor_booking_confirmed = 'No' or mentor_booking_confirmed = 'Yes'`;

export const MenteeApprovedBookingQuery = `SELECT 
    mba.[mentor_booking_appt_id],
    mba.[mentor_dtls_id],
    mba.[mentee_user_dtls_id],
    mba.[mentor_session_booking_date],
    mba.[mentor_booking_time],
    mba.[mentor_booking_confirmed],
    mba.[mentor_host_url],
    mba.[trainee_join_url],
    mba.[mentor_amount_paid_status],
    mba.[mentor_session_status],
    mba.[mentor_rescheduled_times],
    mba.[trainee_session_status],
    mba.[trainee_modification_changed_times],
    mba.[trainee_rescheduled_times],
    mba.[trainee_and_mentor_reward_points],
    md.[mentor_dtls_id],
    md.[mentor_profile_photo],
    md.[mentor_user_dtls_id], 
    md.[mentor_job_title],   
    ud.[user_firstname],
    ud.[user_lastname] 
FROM 
    [dbo].[mentor_booking_appointments_dtls] mba
INNER JOIN 
    [dbo].[mentor_dtls] md
ON 
    mba.[mentor_dtls_id] = md.[mentor_dtls_id]
INNER JOIN 
    [dbo].[users_dtls] ud
ON 
    md.[mentor_user_dtls_id] = ud.[user_dtls_id]  -- Assuming user_dtls_id is the primary key in users_dtls
WHERE 
    mba.[mentee_user_dtls_id] = @menteeUserDtlsId 
    AND (mba.[mentor_booking_confirmed] = 'No' OR mba.[mentor_booking_confirmed] = 'Yes');

`;
