const express = require('express');
const router = express.Router();
const archiveService = require('../services/archiveService');
const auth = require('./middleware/auth');

// GET /api/archives - Get all archives
router.get('/', async (req, res) => {
  console.log('GET /api/archives - Fetching all archives');
  try {
    const archives = await archiveService.getAllArchives();
    console.log(`GET /api/archives - Successfully fetched ${archives.length} archives`);
    res.json({
      success: true,
      data: { archives },
      message: 'Archives fetched successfully'
    });
  } catch (error) {
    console.error('GET /api/archives - Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/archives/:id - Get single archive
router.get('/:id', async (req, res) => {
  console.log('GET /api/archives/:id - Fetching archive with ID:', req.params.id);
  try {
    const archive = await archiveService.getArchiveById(req.params.id);
    console.log('GET /api/archives/:id - Successfully fetched archive for year:', archive.year);
    res.json({
      success: true,
      data: { archive },
      message: 'Archive fetched successfully'
    });
  } catch (error) {
    console.error('GET /api/archives/:id - Error:', error.message);
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/archives - Create new archive (admin only)
router.post('/', auth, async (req, res) => {
  console.log('POST /api/archives - Creating new archive by user:', req.user.email);
  console.log('POST /api/archives - Request body received:', JSON.stringify(req.body, null, 2));
  console.log('POST /api/archives - Request body type:', typeof req.body);
  console.log('POST /api/archives - Request body keys:', Object.keys(req.body || {}));
  
  try {
    const { year, poster, lineup, description } = req.body;

    console.log('POST /api/archives - Extracted fields:', {
      year: year,
      poster: poster ? 'present' : 'missing',
      lineup: lineup,
      description: description
    });

    if (!year || !lineup || !description) {
      console.log('POST /api/archives - Missing required fields');
      return res.status(400).json({
        success: false,
        error: 'Year, lineup, and description are required'
      });
    }

    const archiveData = {
      year,
      poster: poster || '',
      lineup,
      description
    };

    console.log('POST /api/archives - Archive data to save:', JSON.stringify(archiveData, null, 2));

    const archive = await archiveService.createArchive(archiveData);
    console.log('POST /api/archives - Archive created successfully for year:', archive.year);
    res.status(201).json({
      success: true,
      data: { archive },
      message: 'Archive created successfully'
    });
  } catch (error) {
    console.error('POST /api/archives - Error:', error.message);
    console.error('POST /api/archives - Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/archives/:id - Update archive (admin only)
router.put('/:id', auth, async (req, res) => {
  console.log('PUT /api/archives/:id - Updating archive with ID:', req.params.id);
  console.log('PUT /api/archives/:id - Request body received:', JSON.stringify(req.body, null, 2));
  
  try {
    const { year, poster, lineup, description } = req.body;

    const updateData = {
      year,
      poster: poster || '',
      lineup,
      description
    };

    console.log('PUT /api/archives/:id - Update data:', JSON.stringify(updateData, null, 2));

    const archive = await archiveService.updateArchive(req.params.id, updateData);
    console.log('PUT /api/archives/:id - Archive updated successfully for year:', archive.year);
    res.json({
      success: true,
      data: { archive },
      message: 'Archive updated successfully'
    });
  } catch (error) {
    console.error('PUT /api/archives/:id - Error:', error.message);
    console.error('PUT /api/archives/:id - Error stack:', error.stack);
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/archives/:id - Delete archive (admin only)
router.delete('/:id', auth, async (req, res) => {
  console.log('DELETE /api/archives/:id - Deleting archive with ID:', req.params.id);
  try {
    const archive = await archiveService.deleteArchive(req.params.id);
    console.log('DELETE /api/archives/:id - Archive deleted successfully for year:', archive.year);
    res.json({
      success: true,
      data: { archive },
      message: 'Archive deleted successfully'
    });
  } catch (error) {
    console.error('DELETE /api/archives/:id - Error:', error.message);
    console.error('DELETE /api/archives/:id - Error stack:', error.stack);
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;