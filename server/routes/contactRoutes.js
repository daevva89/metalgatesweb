const express = require('express');
const router = express.Router();
const contactService = require('../services/contactService');
const auth = require('./middleware/auth');

// POST /api/contact - Submit contact form
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/contact - Contact form submission received');
    console.log('Request body:', req.body);

    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.log('Contact form validation failed - missing required fields');
      return res.status(400).json({
        success: false,
        error: 'All fields (name, email, subject, message) are required'
      });
    }

    // Create contact submission
    const contact = await contactService.createContact({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim()
    });

    console.log('Contact form submitted successfully:', contact._id);

    res.status(201).json({
      success: true,
      data: {
        contact: {
          _id: contact._id,
          name: contact.name,
          email: contact.email,
          subject: contact.subject,
          message: contact.message,
          status: contact.status,
          createdAt: contact.createdAt
        }
      },
      message: "Thank you for your message! We'll get back to you within 24 hours."
    });

  } catch (error) {
    console.error('Error in POST /api/contact:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: validationErrors.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to submit contact form. Please try again.'
    });
  }
});

// GET /api/contact - Get all contact submissions (admin only)
router.get('/', auth, async (req, res) => {
  try {
    console.log('GET /api/contact - Fetching all contact submissions');

    // Check if user is admin
    if (req.user.role !== 'admin') {
      console.log('Access denied - user is not admin:', req.user.email);
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin privileges required.'
      });
    }

    const contacts = await contactService.getAllContacts();

    console.log('Contact submissions retrieved successfully:', contacts.length);

    res.json({
      success: true,
      data: {
        contacts: contacts
      },
      message: 'Contact submissions retrieved successfully'
    });

  } catch (error) {
    console.error('Error in GET /api/contact:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve contact submissions'
    });
  }
});

// GET /api/contact/:id - Get specific contact submission (admin only)
router.get('/:id', auth, async (req, res) => {
  try {
    console.log('GET /api/contact/:id - Fetching contact submission:', req.params.id);

    // Check if user is admin
    if (req.user.role !== 'admin') {
      console.log('Access denied - user is not admin:', req.user.email);
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin privileges required.'
      });
    }

    const contact = await contactService.getContactById(req.params.id);

    if (!contact) {
      console.log('Contact submission not found:', req.params.id);
      return res.status(404).json({
        success: false,
        error: 'Contact submission not found'
      });
    }

    console.log('Contact submission retrieved successfully:', contact._id);

    res.json({
      success: true,
      data: {
        contact: contact
      },
      message: 'Contact submission retrieved successfully'
    });

  } catch (error) {
    console.error('Error in GET /api/contact/:id:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve contact submission'
    });
  }
});

// PUT /api/contact/:id/status - Update contact status (admin only)
router.put('/:id/status', auth, async (req, res) => {
  try {
    console.log('PUT /api/contact/:id/status - Updating contact status:', req.params.id);

    // Check if user is admin
    if (req.user.role !== 'admin') {
      console.log('Access denied - user is not admin:', req.user.email);
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin privileges required.'
      });
    }

    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }

    const contact = await contactService.updateContactStatus(req.params.id, status);

    if (!contact) {
      console.log('Contact submission not found for status update:', req.params.id);
      return res.status(404).json({
        success: false,
        error: 'Contact submission not found'
      });
    }

    console.log('Contact status updated successfully:', contact._id);

    res.json({
      success: true,
      data: {
        contact: contact
      },
      message: 'Contact status updated successfully'
    });

  } catch (error) {
    console.error('Error in PUT /api/contact/:id/status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update contact status'
    });
  }
});

// DELETE /api/contact/:id - Delete contact submission (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('DELETE /api/contact/:id - Deleting contact submission:', req.params.id);

    // Check if user is admin
    if (req.user.role !== 'admin') {
      console.log('Access denied - user is not admin:', req.user.email);
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin privileges required.'
      });
    }

    const contact = await contactService.deleteContact(req.params.id);

    if (!contact) {
      console.log('Contact submission not found for deletion:', req.params.id);
      return res.status(404).json({
        success: false,
        error: 'Contact submission not found'
      });
    }

    console.log('Contact submission deleted successfully:', contact._id);

    res.json({
      success: true,
      data: {
        contact: contact
      },
      message: 'Contact submission deleted successfully'
    });

  } catch (error) {
    console.error('Error in DELETE /api/contact/:id:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete contact submission'
    });
  }
});

module.exports = router;