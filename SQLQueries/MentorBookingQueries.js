export const MentorApprovedBookingQuery = ` SELECT 
    u.user_dtls_id,
    u.user_firstname,
    u.user_lastname,
    u.user_phone_number,
    u.user_type,
    m.mentor_dtls_id,
    m.mentor_user_dtls_id,
    m.mentor_email,
    m.mentor_profile_photo,
    m.mentor_job_title,
    m.mentor_company_name,
    m.mentor_country,
    m.mentor_approved_status,
    mba.mentor_booking_appt_id,
    mba.mentor_dtls_id AS booking_mentor_dtls_id,
    mba.mentee_user_dtls_id,
    mba.mentor_session_booking_date,
    mba.mentor_booking_time,
    mba.mentor_options,
    mba.mentor_questions,
    mba.mentor_booking_confirmed,
    mba.mentor_host_url,
    mba.trainee_join_url,
    mba.mentor_amount_paid_status,
    mba.mentor_session_status,
    mba.mentor_rescheduled_times,
    mba.trainee_session_status
FROM 
    dbo.users_dtls u
INNER JOIN 
    dbo.mentor_dtls m ON u.user_dtls_id = m.mentor_user_dtls_id
INNER JOIN 
    dbo.mentor_booking_appointments_dtls mba ON m.mentor_dtls_id = mba.mentor_dtls_id
WHERE 
    u.user_dtls_id = @mentorUserDtlsId
    AND (mba.[mentor_booking_confirmed] = 'No' OR mba.[mentor_booking_confirmed] = 'Yes');
`;

export const UpdateMentorBookingAppointmentQuery = `  update mentor_booking_appointments_dtls set mentor_booking_confirmed = 'Yes' where mentor_booking_appt_id = @bookingId`;
