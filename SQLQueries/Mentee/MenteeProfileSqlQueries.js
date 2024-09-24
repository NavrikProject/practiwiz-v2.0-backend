export const MenteeProfileUpdateQuery = `update mentee_dtls set mentee_language = @menteeLanguage, mentee_linkedin_url = @linkedinUrl, mentee_twitter_url = @twitterUrl, mentee_instagram_url = @instagramUrl where mentee_user_dtls_id = @menteeUserDtlsId`;

export const MenteeEduWorkUpdateQuery = `
update mentee_dtls set mentee_skills = @menteeSkills, mentee_type = @menteeType, mentee_institute_details = @instituteDetails, mentee_certificate_details = @certificateDetails,mentee_experience_details = @experienceDetails where mentee_user_dtls_id = @menteeUserDtlsId`;
