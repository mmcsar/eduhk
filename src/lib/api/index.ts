/**
 * MMC Immo - API Index
 * Export centralisé de toutes les fonctions API
 */

// Propriétés
export {
  getProperties,
  getPropertyById,
  getFeaturedProperties,
  getAgentProperties,
  getSimilarProperties,
  createProperty,
  updateProperty,
  togglePublishProperty,
  toggleFeatureProperty,
  updatePropertyStatus,
  deleteProperty,
  trackPropertyView,
  getPropertyViewStats,
} from './properties';

// Leads
export {
  getAgentLeads,
  getPropertyLeads,
  getLeadById,
  getRecentLeads,
  getLeadsNeedingFollowUp,
  createLead,
  createLeadFromContact,
  updateLead,
  updateLeadStatus,
  scheduleFollowUp,
  assignLeadToAgent,
  markLeadConverted,
  deleteLead,
  getLeadStatsByStatus,
  getLeadStatsBySource,
  getConversionRate,
} from './leads';

// Favoris
export {
  getFavorites,
  isFavorite,
  getFavoriteIds,
  countFavorites,
  addToFavorites,
  removeFromFavorites,
  toggleFavorite,
  clearFavorites,
  syncFavorites,
} from './favorites';

// Visites
export {
  getAgentVisits,
  getPropertyVisits,
  getVisitById,
  getTodayVisits,
  getUpcomingVisits,
  getPendingVisits,
  createVisit,
  scheduleVisit,
  updateVisit,
  confirmVisit,
  cancelVisit,
  completeVisit,
  markNoShow,
  rescheduleVisit,
  markReminderSent,
  deleteVisit,
  getVisitStatsByStatus,
  getMonthlyVisitCount,
  getHighInterestRate,
} from './visits';

// Utilisateurs
export {
  getActiveAgents,
  getAllUsers,
  getUserById,
  getUserByEmail,
  getCurrentUserProfile,
  getAgentStats,
  getAllAgentStats,
  createUser,
  createAgent,
  updateUser,
  updateMyProfile,
  toggleUserActive,
  updateCommissionRate,
  updateUserRole,
  deleteUser,
  searchAgents,
  getTopAgentsBySales,
  getTopAgentsByLeads,
  getTopAgentsByConversion,
} from './users';

// Dashboard
export {
  getAdminDashboardStats,
  getRecentProperties,
  getPropertiesTrend,
  getLeadsTrend,
  getEstimatedRevenue,
  getDistributionByNeighborhood,
  getDistributionByType,
  getDistributionByPriceRange,
  getAgentDashboardStats,
  getAgentRecentActivity,
  getAgentMonthlyPerformance,
  getAgentDashboardSummary,
} from './dashboard';
export type { AgentActivity, MonthlyPerformance, AgentDashboardSummary } from './dashboard';
