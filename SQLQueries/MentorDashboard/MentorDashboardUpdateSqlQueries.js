export const mentorProfilePictureDashboardUpdateQuery = `
INSERT INTO [dbo].[mentor_dtls] (
    [mentor_user_dtls_id],
    [mentor_phone_number],
    [mentor_email],
    [mentor_profile_photo],
    [mentor_company_name],
    [mentor_years_of_experience],
    [mentor_academic_qualification],
    [mentor_currency_type]
) OUTPUT INSERTED.mentor_dtls_id VALUES (
    @mentorUserDtlsId1,
    @mentorPhoneNumber,
    @mentorEmail,
    @mentorProfilePhoto,
    @mentor_company_name,
    @mentor_years_of_experience,
    @mentor_academic_qualification,
    @mentor_currency
);
`;
