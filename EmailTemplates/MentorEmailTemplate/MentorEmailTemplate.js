// mentor application email needd to pass mentor email and mentorname
export const mentorApplicationEmail = (mentorEmail, mentorname) => {
  return {
    to: `${mentorEmail}`, // Change to your recipient
    from: "no-reply@practiwiz.com", // Change to your verified sender
    subject: "Thank you for your mentor application!",
    html: `
     <section>
      <div
        style="
          font-size: 19px;
          font-family: poppins;
          max-width: 700px;
          margin: auto;
          padding: 50px 20px;
        "
      > 
      <div style="background-color:#0255ca; height:auto;padding:10px 20px; "><h2
        style="
            text-transform: uppercase;
            color: #fff;
            text-align: center;
          "
        >
          Welcome to the Practiwiz Mentorship Programme
        </h2></div>
        <p>Hi <b>${mentorname}</b>,</p>
        <p>
          Thank you for submitting your application for becoming a part of our
          team. In the meantime feel free to check out some information about
          our company on our website blogs and if you have any questions please don't
          hesitate to contact me.
        </p>
        <p>
          We will review the whole application and get back to you as soon as
          possible.
        </p>
        <p>Thank you for your interest,</p>
        <p>We look forward to seeing your progress with our service!</p>
        <p>
          If you have any questions, send an email to wecare@practiwiz.com  and we'll be happy
          to help.
        </p>
        <p>Thanks, Practiwiz</p>
        <img
          width="300px"
          height="100px"
          src="https://res.cloudinary.com/droa7dncb/image/upload/v1665987569/practiwiz-logo3_xifxbc.png"
          alt="Logo"
        />
      </div>
    </section>
    `,
  };
};
