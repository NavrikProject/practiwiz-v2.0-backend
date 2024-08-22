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
        ) OUTPUT INSERTED.user_dtls_id VALUES (
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
