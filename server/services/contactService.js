const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

class ContactService {
  async createContact(contactData) {
    try {
      const contact = new Contact(contactData);
      const savedContact = await contact.save();

      // Send email notification
      try {
        await this.sendContactEmail(savedContact);
        console.log("Contact form email sent successfully");
      } catch (emailError) {
        console.error("Failed to send contact form email:", emailError);
        // Continue without failing - contact form submission should still work
      }

      return savedContact;
    } catch (error) {
      throw error;
    }
  }

  async sendContactEmail(contactData) {
    // Debug: log environment variables
    console.log("Email config debug:", {
      EMAIL_HOST: process.env.EMAIL_HOST,
      EMAIL_USER: process.env.EMAIL_USER,
      EMAIL_PASS: process.env.EMAIL_PASS ? "SET" : "NOT SET",
      EMAIL_FROM: process.env.EMAIL_FROM,
      CONTACT_FORM_TO_EMAIL: process.env.CONTACT_FORM_TO_EMAIL,
    });

    // Check if email configuration is available
    if (
      !process.env.EMAIL_HOST ||
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_PASS
    ) {
      throw new Error("Email configuration not found - email sending disabled");
    }

    try {
      const emailFrom =
        process.env.EMAIL_FROM || "noreply@metalgatesfestival.com";
      const contactFormToEmail =
        process.env.CONTACT_FORM_TO_EMAIL || "info@metalgatesfestival.com";

      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT || 587,
        secure: process.env.EMAIL_SECURE === "true",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: emailFrom,
        to: contactFormToEmail,
        subject: `Contact Form: ${contactData.subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${contactData.name}</p>
          <p><strong>Email:</strong> ${contactData.email}</p>
          <p><strong>Subject:</strong> ${contactData.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${contactData.message}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  }

  async getAllContacts(query = {}, options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
        status,
      } = options;

      const filter = {};
      if (status) {
        filter.status = status;
      }

      const contacts = await Contact.find(filter)
        .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const total = await Contact.countDocuments(filter);

      return {
        contacts,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalContacts: total,
      };
    } catch (error) {
      throw error;
    }
  }

  async getContactById(contactId) {
    try {
      const contact = await Contact.findById(contactId);
      if (!contact) {
        throw new Error("Contact not found");
      }
      return contact;
    } catch (error) {
      throw error;
    }
  }

  async updateContactStatus(contactId, status) {
    try {
      const contact = await Contact.findByIdAndUpdate(
        contactId,
        { status, updatedAt: new Date() },
        { new: true }
      );

      if (!contact) {
        throw new Error("Contact not found");
      }
      return contact;
    } catch (error) {
      throw error;
    }
  }

  async deleteContact(contactId) {
    try {
      const contact = await Contact.findByIdAndDelete(contactId);
      if (!contact) {
        throw new Error("Contact not found");
      }
      return contact;
    } catch (error) {
      throw error;
    }
  }

  async getContactStats() {
    try {
      const totalContacts = await Contact.countDocuments({});
      const newContacts = await Contact.countDocuments({ status: "new" });
      const inProgressContacts = await Contact.countDocuments({
        status: "in-progress",
      });
      const resolvedContacts = await Contact.countDocuments({
        status: "resolved",
      });

      return {
        total: totalContacts,
        new: newContacts,
        inProgress: inProgressContacts,
        resolved: resolvedContacts,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ContactService();
