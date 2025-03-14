import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teamName: { type: String, required: true },
  captainName: { type: String, required: true },
  captainPhone: { type: String, required: true },
  playerCount: { type: Number, required: true, min: 5 },
  paymentReference: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now }
});

const tournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  maxTeams: { type: Number, required: true },
  prizePool: { type: Number, required: true },
  registrationFee: { type: Number, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  registrations: [registrationSchema],
  status: { 
    type: String, 
    enum: ['upcoming', 'open', 'closed', 'in_progress', 'completed'],
    default: 'upcoming'
  }
}, { timestamps: true });

// Add a pre-save hook to automatically update status based on dates
tournamentSchema.pre('save', function(next) {
  const currentDate = new Date();
  const startDate = new Date(this.startDate);
  const endDate = new Date(this.endDate);

  // If tournament date is before current date, mark it as closed
  if (startDate < currentDate) {
    this.status = 'closed';
  } 
  // If tournament is between start and end date, mark it as in_progress
  else if (currentDate >= startDate && currentDate <= endDate) {
    this.status = 'in_progress';
  }
  // If tournament hasn't started yet, mark it as upcoming
  else if (currentDate < startDate) {
    this.status = 'upcoming';
  }
  // If tournament has ended, mark it as completed
  else if (currentDate > endDate) {
    this.status = 'completed';
  }

  // If tournament is full, mark it as closed regardless of dates
  if (this.registrations.length >= this.maxTeams) {
    this.status = 'closed';
  }

  next();
});

// Add a static method to update all tournament statuses
tournamentSchema.statics.updateAllStatuses = async function() {
  const tournaments = await this.find();
  const currentDate = new Date();

  for (const tournament of tournaments) {
    const startDate = new Date(tournament.startDate);
    const endDate = new Date(tournament.endDate);
    let statusChanged = false;

    // Update status based on dates
    if (startDate < currentDate && tournament.status === 'upcoming') {
      tournament.status = 'closed';
      statusChanged = true;
    } else if (currentDate >= startDate && currentDate <= endDate && tournament.status !== 'in_progress') {
      tournament.status = 'in_progress';
      statusChanged = true;
    } else if (currentDate > endDate && tournament.status !== 'completed') {
      tournament.status = 'completed';
      statusChanged = true;
    }

    // Save if status changed
    if (statusChanged) {
      await tournament.save();
    }
  }
};

export default mongoose.model('Tournament', tournamentSchema);
