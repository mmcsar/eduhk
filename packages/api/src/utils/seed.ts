import Coach from '../models/Coach';
import Student from '../models/Student';
import CoachingSession from '../models/CoachingSession';
import Goal from '../models/Goal';
import Feedback from '../models/Feedback';

export async function seedDatabase() {
  const coachCount = await Coach.countDocuments();
  if (coachCount > 0) {
    console.log('Database already seeded, skipping...');
    return;
  }

  console.log('Seeding database with sample data...');

  // Create coaches
  const coaches = await Coach.insertMany([
    {
      firstName: 'Marie',
      lastName: 'Kabila',
      email: 'marie.kabila@eduhk.cd',
      specialty: 'Mathématiques',
      bio: 'Enseignante de mathématiques avec 10 ans d\'expérience en coaching scolaire.',
    },
    {
      firstName: 'Jean',
      lastName: 'Mutombo',
      email: 'jean.mutombo@eduhk.cd',
      specialty: 'Sciences',
      bio: 'Spécialiste en sciences naturelles et coaching académique.',
    },
    {
      firstName: 'Sophie',
      lastName: 'Lukaku',
      email: 'sophie.lukaku@eduhk.cd',
      specialty: 'Français',
      bio: 'Coach en langue française et communication.',
    },
  ]);

  // Create students
  const students = await Student.insertMany([
    {
      firstName: 'Patrick',
      lastName: 'Kasa',
      email: 'patrick.kasa@student.eduhk.cd',
      grade: '6ème',
      section: 'A',
      parentPhone: '+243 812 345 678',
    },
    {
      firstName: 'Grace',
      lastName: 'Mbaya',
      email: 'grace.mbaya@student.eduhk.cd',
      grade: '5ème',
      section: 'B',
      parentPhone: '+243 823 456 789',
    },
    {
      firstName: 'David',
      lastName: 'Tshombe',
      email: 'david.tshombe@student.eduhk.cd',
      grade: '6ème',
      section: 'A',
      parentPhone: '+243 834 567 890',
    },
    {
      firstName: 'Claire',
      lastName: 'Mbuyi',
      email: 'claire.mbuyi@student.eduhk.cd',
      grade: '4ème',
      section: 'C',
      parentPhone: '+243 845 678 901',
    },
    {
      firstName: 'Emmanuel',
      lastName: 'Ngoy',
      email: 'emmanuel.ngoy@student.eduhk.cd',
      grade: '5ème',
      section: 'A',
      parentPhone: '+243 856 789 012',
    },
  ]);

  // Create coaching sessions
  const now = new Date();
  const sessions = await CoachingSession.insertMany([
    {
      coach: coaches[0]._id,
      students: [students[0]._id, students[2]._id],
      title: 'Révision algèbre - Équations du premier degré',
      description: 'Session de révision pour préparer l\'examen trimestriel.',
      type: 'group',
      status: 'completed',
      subject: 'Mathématiques',
      scheduledAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      duration: 60,
      location: 'Salle 201',
      objectives: ['Résoudre des équations simples', 'Comprendre les inéquations'],
      completedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
      notes: 'Les deux élèves ont bien progressé. Patrick maîtrise les équations, David a besoin de plus de pratique.',
    },
    {
      coach: coaches[1]._id,
      students: [students[1]._id],
      title: 'Introduction à la chimie organique',
      type: 'one_on_one',
      status: 'completed',
      subject: 'Sciences',
      scheduledAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      duration: 45,
      location: 'Laboratoire',
      objectives: ['Comprendre les liaisons carbone', 'Nommer les alcanes simples'],
      completedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000),
    },
    {
      coach: coaches[2]._id,
      students: [students[3]._id, students[4]._id],
      title: 'Atelier d\'écriture créative',
      type: 'workshop',
      status: 'scheduled',
      subject: 'Français',
      scheduledAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      duration: 90,
      location: 'Bibliothèque',
      objectives: ['Écrire un paragraphe descriptif', 'Utiliser des figures de style'],
    },
    {
      coach: coaches[0]._id,
      students: [students[4]._id],
      title: 'Coaching individuel - Géométrie',
      type: 'one_on_one',
      status: 'scheduled',
      subject: 'Mathématiques',
      scheduledAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      duration: 60,
      location: 'Salle 105',
      objectives: ['Théorème de Pythagore', 'Calcul d\'aires'],
    },
  ]);

  // Create goals
  await Goal.insertMany([
    {
      student: students[0]._id,
      coach: coaches[0]._id,
      title: 'Maîtriser les équations du second degré',
      description: 'Patrick doit pouvoir résoudre des équations du second degré sans aide.',
      subject: 'Mathématiques',
      status: 'in_progress',
      priority: 'high',
      targetDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      progress: 40,
      milestones: [
        { title: 'Comprendre la factorisation', completed: true, completedAt: new Date() },
        { title: 'Utiliser la formule discriminante', completed: true, completedAt: new Date() },
        { title: 'Résoudre des problèmes contextuels', completed: false },
        { title: 'Examen de validation', completed: false },
      ],
    },
    {
      student: students[1]._id,
      coach: coaches[1]._id,
      title: 'Réussir le contrôle de chimie',
      subject: 'Sciences',
      status: 'in_progress',
      priority: 'medium',
      targetDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
      progress: 25,
      milestones: [
        { title: 'Réviser le tableau périodique', completed: true, completedAt: new Date() },
        { title: 'Comprendre les réactions chimiques', completed: false },
        { title: 'Exercices de stœchiométrie', completed: false },
        { title: 'Test blanc', completed: false },
      ],
    },
    {
      student: students[3]._id,
      coach: coaches[2]._id,
      title: 'Améliorer la rédaction en français',
      subject: 'Français',
      status: 'not_started',
      priority: 'medium',
      targetDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
      progress: 0,
      milestones: [
        { title: 'Maîtriser la structure d\'un essai', completed: false },
        { title: 'Enrichir le vocabulaire', completed: false },
        { title: 'Écrire 3 essais complets', completed: false },
      ],
    },
  ]);

  // Create feedback
  await Feedback.insertMany([
    {
      session: sessions[0]._id,
      coach: coaches[0]._id,
      student: students[0]._id,
      rating: 4,
      strengths: ['Logique mathématique', 'Participation active', 'Bonne compréhension'],
      areasForImprovement: ['Vérification des calculs', 'Présentation du travail'],
      comment: 'Patrick montre une excellente progression en algèbre. Il doit continuer à pratiquer la vérification systématique de ses résultats.',
    },
    {
      session: sessions[0]._id,
      coach: coaches[0]._id,
      student: students[2]._id,
      rating: 3,
      strengths: ['Motivation', 'Persévérance'],
      areasForImprovement: ['Bases en calcul', 'Concentration', 'Prise de notes'],
      comment: 'David a besoin de renforcer ses bases. Des sessions supplémentaires sont recommandées.',
    },
    {
      session: sessions[1]._id,
      coach: coaches[1]._id,
      student: students[1]._id,
      rating: 5,
      strengths: ['Curiosité scientifique', 'Questions pertinentes', 'Travail de laboratoire'],
      areasForImprovement: ['Nomenclature chimique'],
      comment: 'Grace excelle en chimie. Elle a un vrai talent pour les sciences expérimentales.',
    },
  ]);

  console.log('Database seeded successfully!');
}
