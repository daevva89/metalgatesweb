const Contact = require("../models/Contact");
const {
  transporter,
  contactFormToEmail,
  emailFrom,
} = require("../config/emailConfig");

class ContactService {
  // Create a new contact submission
  async createContact(contactData) {
    try {
      console.log("ContactService: Creating new contact submission:", {
        name: contactData.name,
        email: contactData.email,
        subject: contactData.subject,
      });

      const contact = new Contact(contactData);
      const savedContact = await contact.save();
      await this.sendContactEmail(savedContact);

      console.log(
        "ContactService: Contact submission created successfully with ID:",
        savedContact._id
      );
      return savedContact;
    } catch (error) {
      console.error(
        "ContactService: Error creating contact submission:",
        error
      );
      throw error;
    }
  }

  async sendContactEmail(contact) {
    try {
      console.log(`Sending contact form email for ${contact.name}`);
      const mailOptions = {
        from: emailFrom,
        to: contactFormToEmail,
        subject: `New Contact Form Submission: ${contact.subject}`,
        text: `You have a new contact form submission from:\n\nName: ${contact.name}\nEmail: ${contact.email}\nSubject: ${contact.subject}\nMessage: ${contact.message}`,
        html: `<p>You have a new contact form submission from:</p>
               <ul>
                 <li><strong>Name:</strong> ${contact.name}</li>
                 <li><strong>Email:</strong> ${contact.email}</li>
                 <li><strong>Subject:</strong> ${contact.subject}</li>
               </ul>
               <p><strong>Message:</strong></p>
               <p>${contact.message}</p>`,
      };
      await transporter.sendMail(mailOptions);
      console.log("Contact form email sent successfully.");
    } catch (error) {
      console.error("Error sending contact form email:", error);
      // We don't rethrow the error here because the contact form was already successfully submitted.
      // We should probably log this to a more persistent error logging service.
    }
  }

  // Get all contact submissions
  async getAllContacts() {
    try {
      console.log("ContactService: Fetching all contact submissions");

      const contacts = await Contact.find()
        .sort({ createdAt: -1 }) // Newest first
        .lean();

      console.log(
        "ContactService: Retrieved",
        contacts.length,
        "contact submissions"
      );
      return contacts;
    } catch (error) {
      console.error(
        "ContactService: Error fetching contact submissions:",
        error
      );
      throw error;
    }
  }

  // Get contact submission by ID
  async getContactById(contactId) {
    try {
      console.log(
        "ContactService: Fetching contact submission by ID:",
        contactId
      );

      const contact = await Contact.findById(contactId).lean();

      if (!contact) {
        console.log(
          "ContactService: Contact submission not found with ID:",
          contactId
        );
        return null;
      }

      console.log("ContactService: Contact submission found:", contact._id);
      return contact;
    } catch (error) {
      console.error(
        "ContactService: Error fetching contact submission by ID:",
        error
      );
      throw error;
    }
  }

  // Update contact status
  async updateContactStatus(contactId, status) {
    try {
      console.log(
        "ContactService: Updating contact status:",
        contactId,
        "to",
        status
      );

      const contact = await Contact.findByIdAndUpdate(
        contactId,
        { status, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!contact) {
        console.log(
          "ContactService: Contact submission not found for status update:",
          contactId
        );
        return null;
      }

      console.log("ContactService: Contact status updated successfully");
      return contact;
    } catch (error) {
      console.error("ContactService: Error updating contact status:", error);
      throw error;
    }
  }

  // Delete contact submission
  async deleteContact(contactId) {
    try {
      console.log("ContactService: Deleting contact submission:", contactId);

      const contact = await Contact.findByIdAndDelete(contactId);

      if (!contact) {
        console.log(
          "ContactService: Contact submission not found for deletion:",
          contactId
        );
        return null;
      }

      console.log("ContactService: Contact submission deleted successfully");
      return contact;
    } catch (error) {
      console.error(
        "ContactService: Error deleting contact submission:",
        error
      );
      throw error;
    }
  }
}

module.exports = new ContactService();
