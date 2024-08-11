import emailjs from "@emailjs/browser";

export const sentEmail = async (templateParams) => {
  try {
    const res = await emailjs.send(
      "service_8cjbmeq",
      "template_x1u08un",
      templateParams,
      {
        publicKey: "JwiRmytUHEKz1VY29",
      }
    );

    console.log("SUCCESS!", res.status, res.text);
    return {
      status: res.status,
      text: res.text,
    };
  } catch (err) {
    console.log("FAILED...", err);
    throw err;
  }
};
