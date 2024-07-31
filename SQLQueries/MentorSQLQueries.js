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
