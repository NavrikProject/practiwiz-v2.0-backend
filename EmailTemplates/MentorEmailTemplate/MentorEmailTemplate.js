// mentor application email needd to pass mentor email and mentorname
export const mentorApplicationEmail = (mentorEmail, mentorname) => {
  return {
    to: `${mentorEmail}`, // Change to your recipient
    from: "no-reply@practiwiz.com", // Change to your verified sender
    subject: "Thank you for your mentor application!",
    html: `
<section
  style="
    font-family: 'Poppins', sans-serif;
    background-color: #f4f8fb;
    padding: 50px 0;
  "
>
  <div
    style="
      max-width: 600px;
      margin: auto;
      padding: 40px;
      background-color: #ffffff;
      border-radius: 15px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    "
  >
    <div style="text-align: center; margin-bottom: 30px;">
      <img
        src="https://res.cloudinary.com/droa7dncb/image/upload/v1665987569/practiwiz-logo3_xifxbc.png"
        alt="Practiwiz Logo"
        style="max-width: 160px; margin-bottom: 20px;"
      />
      <h2
        style="
          font-size: 24px;
          text-transform: uppercase;
          color: #2c3e50;
          margin: 0;
        "
      >
        Welcome to Practiwiz
      </h2>
      <hr style="width: 80px; border: 1px solid #1abc9c; margin: 20px auto;" />
    </div>

    <div style="text-align: center; margin-bottom: 30px;">
      <img
        src="https://via.placeholder.com/600x200?text=Mentor+Application+Received"
        alt="Mentor Application Received"
        style="max-width: 100%; border-radius: 10px;"
      />
    </div>

    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      Hi <b>${mentorname}</b>,
    </p>

    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      Thank you for submitting your mentor application to join the <b>Practiwiz</b> team. We’re excited about the possibility of working together to empower and guide our learners.
    </p>

    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      While we review your application, we encourage you to explore our blog, where we share insights and experiences from our current mentors. It’s a great way to get familiar with our community and the impact we’re making.
    </p>

    <div
      style="
        text-align: center;
        margin: 30px 0;
      "
    >
      <a
        href="https://practiwiz.com/blog"
        style="
          text-decoration: none;
          padding: 15px 40px;
          background-color: #1abc9c;
          color: #ffffff;
          border-radius: 50px;
          font-size: 16px;
          display: inline-block;
          box-shadow: 0 5px 15px rgba(26, 188, 156, 0.3);
        "
        >Explore Our Blog</a
      >
    </div>

    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      We will be in touch shortly with the next steps. Your expertise and passion for mentoring are highly valued, and we’re eager to see how you can contribute to the growth of our community.
    </p>

    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      If you have any questions or need further information, feel free to contact us at 
      <a href="mailto:wecare@practiwiz.com" style="color: #1abc9c; text-decoration: none;">
        wecare@practiwiz.com
      </a>. We're here to assist you!
    </p>

    <p style="font-size: 16px; line-height: 1.8; color: #555; margin-top: 40px;">
      Best Regards,<br />The Practiwiz Team
    </p>

    <div style="text-align: center; margin-top: 40px;">
      <img
        src="https://via.placeholder.com/150x50?text=Practiwiz+Footer+Logo"
        alt="Practiwiz Footer Logo"
        style="max-width: 120px;"
      />
    </div>
  </div>
</section>

    `,
  };
};
