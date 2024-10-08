export const GetAllMentorCaseStudiesInputQuery = `SELECT [case_study_dtls_id]
      ,[case_study_dtls_user_id]
      ,[case_study_dtls_mentor_id]
      ,[case_study_dtls_topic_category]
      ,[case_study_dtls_title]
      ,[case_study_dtls_lesson]
      ,[case_study_dtls_people_after_read]
      ,[case_study_dtls_no_characters]
      ,[case_study_dtls_roles]
      ,[case_study_dtls_main_role]
      ,[case_study_dtls_main_challenge]
      ,[case_study_cr_date]
      ,[case_study_update_date]
  FROM [dbo].[case_studies_dtls]`;
