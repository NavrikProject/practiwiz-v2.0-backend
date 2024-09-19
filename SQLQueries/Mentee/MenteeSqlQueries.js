export const MenteeRegisterQuery = `
          INSERT INTO [dbo].[mentee_dtls] (
            [mentee_user_dtls_id],
            [mentee_about],
            [mentee_skills],
            [mentee_gender],
            [mentee_type],
            [mentee_profile],
            [mentee_institute],
            [mentee_dtls_cr_date],
            [mentee_dtls_update_date]
        ) OUTPUT INSERTED.mentee_dtls_id VALUES (
            @menteeUserDtlsId,
            @menteeAbout,
            @menteeSkills,
            @menteeGender,
            @menteeType,
            @menteeProfilePic,
            @menteeInstitute,
            @menteeCrDate,
            @menteeUpDate
        );
`;
