import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import Tournament from '../models/tournament.js';

const router = express.Router();

// Middleware to update tournament statuses
router.use(async (req, res, next) => {
  try {
    await Tournament.updateAllStatuses();
    next();
  } catch (error) {
    console.error('Error updating tournament statuses:', error);
    next();
  }
});

// Create a new tournament
router.post('/', verifyToken, async (req, res) => {
  try {
    const tournament = new Tournament({
      ...req.body,
      creator: req.user.userId
    });
    await tournament.save();
    console.log('Tournament created:', tournament);
    res.status(201).json(tournament);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all tournaments
router.get('/', async (req, res) => {
  try {
    const tournaments = await Tournament.find();
    const processedTournaments = tournaments.map(tournament => ({
      ...tournament.toObject(),
      registeredUsers: tournament.registrations || []
    }));
    console.log('Fetching all tournaments');
    res.status(200).json(processedTournaments);
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all tournaments for a user
router.get('/user', verifyToken, async (req, res) => {
  try {
    // Find tournaments where the user is the creator and populate registrations
    const tournaments = await Tournament.find({ creator: req.user.userId })
      .populate('registrations.userId', 'name email')
      .exec();
    
    const processedTournaments = tournaments.map(tournament => ({
      ...tournament.toObject(),
      registrations: tournament.registrations.map(reg => ({
        id: reg._id,
        teamName: reg.teamName,
        captainName: reg.captainName,
        captainPhone: reg.captainPhone,
        playerCount: reg.playerCount,
        paymentReference: reg.paymentReference,
        registrationDate: reg.registrationDate,
        userId: reg.userId
      }))
    }));
    
    res.status(200).json(processedTournaments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a tournament
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const tournament = await Tournament.findOneAndUpdate(
      { _id: req.params.id, creator: req.user.userId },
      req.body,
      { new: true }
    );
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found or unauthorized' });
    }
    res.status(200).json(tournament);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a tournament
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const tournament = await Tournament.findOneAndDelete({
      _id: req.params.id,
      creator: req.user.userId
    });

    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found or unauthorized' });
    }

    res.json({ message: 'Tournament deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register for a tournament
router.post('/:id/register', verifyToken, async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    // Check if tournament is available for registration
    if (tournament.status !== 'upcoming' && tournament.status !== 'open') {
      return res.status(400).json({ message: 'Tournament registration is closed' });
    }

    // Check if user is already registered
    const existingRegistration = tournament.registrations.find(
      reg => reg.userId.toString() === req.user.userId
    );
    if (existingRegistration) {
      return res.status(400).json({ message: 'You are already registered for this tournament' });
    }

    if (tournament.registrations.length >= tournament.maxTeams) {
      tournament.status = 'closed';
      await tournament.save();
      return res.status(400).json({ message: 'Tournament is full' });
    }

    // Validate registration data
    const { teamName, captainName, captainPhone, playerCount, paymentReference } = req.body;
    if (!teamName || !captainName || !captainPhone || !playerCount || !paymentReference) {
      return res.status(400).json({ message: 'All registration fields are required' });
    }

    if (playerCount < 5) {
      return res.status(400).json({ message: 'Minimum 5 players required' });
    }

    // Add new registration
    tournament.registrations.push({
      userId: req.user.userId,
      teamName,
      captainName,
      captainPhone,
      playerCount,
      paymentReference
    });

    await tournament.save();

    res.status(200).json({ 
      message: 'Successfully registered for tournament',
      tournament: {
        ...tournament.toObject(),
        registeredUsers: tournament.registrations
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get tournament details by ID
router.get('/:id', async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate('creator', 'name email')
      .populate('registrations.userId', 'name email');
    
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }
    
    res.status(200).json({
      ...tournament.toObject(),
      registeredUsers: tournament.registrations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;