// This is a mock data service to simulate a backend.
import {
  ChurchTenant, TenantStatus,
  User,
  Member, Gender, CivilStatus, MemberStatus, SpiritualStatus,
  Role, Permission,
  AuditLog,
  Group,
  StaffMember, StaffStatus, StaffAssignment,
  PlanningEvent,
  TrainingSession, TrainingParticipant,
  Revenue, TransactionType, PaymentMethod,
  Expense, ExpenseStatus,
  Material, MaterialType, MaterialStatus,
  MaterialRequest, RequestStatus,
  Message, MessageStatus,
  Newcomer, FollowUpStatus,
  Interaction,
  MediaItem, MediaType,
  Volunteer,
  ProjectTeam
} from '../types';

// Using crypto for random IDs
const newId = () => crypto.randomUUID();

// Mock Data Store
let users: User[] = [
  { id: 'u1', tenantId: 't1', prenom: 'Jean', nom: 'Dupont', email: 'jean.dupont@example.com', role: 'Super Admin', actif: true, multi_sites: true },
  { id: 'u2', tenantId: 't1', prenom: 'Marie', nom: 'Martin', email: 'marie.martin@example.com', role: 'Admin système', actif: true, multi_sites: false },
  { id: 'u3', tenantId: 't1', prenom: 'Paul', nom: 'Bernard', email: 'paul.bernard@example.com', role: 'Utilisateur simple', actif: false, multi_sites: false },
];

let tenants: ChurchTenant[] = [
  { id: 't1', name: 'Église Centrale', slug: 'eglise-centrale', domain: 'centrale.erp-eglise.com', status: TenantStatus.Active, plan: 'Premium', admin: users[1], createdAt: '2023-01-15' },
];

let members: Member[] = [
    { id: 'm1', tenantId: 't1', firstName: 'Alice', lastName: 'Dubois', gender: Gender.Female, birthdate: '1990-05-20', email: 'alice.d@email.com', phone: '0612345678', address: '1 rue de la Paix', photoUrl: `https://i.pravatar.cc/150?u=m1`, civilStatus: CivilStatus.Single, status: MemberStatus.Active, spiritualStatus: SpiritualStatus.Baptized, joinedAt: '2018-03-10' },
    { id: 'm2', tenantId: 't1', firstName: 'Bob', lastName: 'Lefebvre', gender: Gender.Male, birthdate: '1985-11-12', email: 'bob.l@email.com', phone: '0687654321', address: '2 avenue de la Liberté', photoUrl: `https://i.pravatar.cc/150?u=m2`, civilStatus: CivilStatus.Married, status: MemberStatus.Active, spiritualStatus: SpiritualStatus.ActiveMember, joinedAt: '2015-07-22' },
];

let permissions: Permission[] = [
    { id: 'p1', module: 'Membres', action: 'Créer' },
    { id: 'p2', module: 'Membres', action: 'Lire' },
    { id: 'p3', module: 'Membres', action: 'Modifier' },
    { id: 'p4', module: 'Membres', action: 'Supprimer' },
    { id: 'p5', module: 'Finances', action: 'Lire' },
    { id: 'p6', module: 'Finances', action: 'Gérer' },
];

let roles: Role[] = [
    { id: 'r1', tenantId: 't1', nom: 'Super Admin', description: 'Accès total à toutes les fonctionnalités', permissions: permissions },
    { id: 'r2', tenantId: 't1', nom: 'Admin système', description: 'Gère les utilisateurs et les paramètres', permissions: permissions },
    { id: 'r3', tenantId: 't1', nom: 'Utilisateur simple', description: 'Accès limité', permissions: [permissions[1]] },
];

let auditLogs: AuditLog[] = [
    { id: 'al1', tenantId: 't1', user_id: 'u1', userName: 'Jean Dupont', action: 'SUPPRESSION_UTILISATEUR', objet: 'Utilisateur', objet_id: 'u4', date: '2023-10-26 10:30:00', ip: '192.168.1.1' },
];

let groups: Group[] = [
    { id: 'g1', tenantId: 't1', name: 'Groupe des Jeunes', description: 'Activités pour les jeunes de 18-25 ans', type: 'Jeunesse', leader: members[0], members: [members[0], members[1]], createdAt: '2022-09-01' },
];

let staff: StaffMember[] = [
    { ...members[1], staffId: 's1', position: 'Pasteur Principal', department: 'Pastoral', hiredAt: '2010-01-01', staffStatus: StaffStatus.Employee, assignments: [] }
];

let events: PlanningEvent[] = [
    { id: 'ev1', tenantId: 't1', title: 'Culte du Dimanche', category: 'Service', start: new Date('2023-10-29T10:00:00'), end: new Date('2023-10-29T12:00:00'), location: 'Salle principale', attendees: [] },
];

let trainingSessions: TrainingSession[] = [
    { id: 'ts1', tenantId: 't1', title: 'Formation des leaders', description: '...', instructor: 'Jean Dupont', startDate: '2023-11-04', endDate: '2023-11-04', location: 'Salle 2', participants: [{ member: members[0], status: 'Inscrit' }] }
];

let revenues: Revenue[] = [
    { id: 'rev1', tenantId: 't1', type: TransactionType.Offering, amount: 50000, paymentDate: '2023-10-22', sourceDescription: 'Offrande du culte', paymentMethod: PaymentMethod.Cash },
];

let expenses: Expense[] = [
    { id: 'exp1', tenantId: 't1', description: 'Achat de microphones', amount: 75000, beneficiary: 'Music Store', expenseDate: '2023-10-20', costCenter: 'Sonorisation', status: ExpenseStatus.Approved, paymentMethod: PaymentMethod.Check },
];

let materials: Material[] = [
    { id: 'mat1', tenantId: 't1', name: 'Micro Shure SM58', type: MaterialType.Sound, totalQuantity: 5, availableQuantity: 3, status: MaterialStatus.Good, location: 'Stock Son' },
];

let materialRequests: MaterialRequest[] = [
    { id: 'mr1', tenantId: 't1', requesterId: 'u3', requesterName: 'Paul Bernard', eventName: 'Concert de Noël', requestDate: '2023-10-25', startDate: '2023-12-24', endDate: '2023-12-25', items: [{ materialId: 'mat1', quantity: 2 }], status: RequestStatus.Pending },
];

let messages: Message[] = [
    { id: 'msg1', tenantId: 't1', channel: 'SMS', content: 'Rappel: Répétition de la chorale ce soir à 19h.', recipients: [members[0]], sentAt: '2023-10-26 14:00:00', status: MessageStatus.Sent },
];

let newcomers: Newcomer[] = [
    { id: 'nc1', tenantId: 't1', firstName: 'Lucie', lastName: 'Moreau', phone: '0712345678', firstVisitDate: '2023-10-22', cameFrom: 'Ami', status: FollowUpStatus.New, assignedTo: users[2] },
];

let interactions: Interaction[] = [
    { id: 'int1', newcomerId: 'nc1', date: '2023-10-24', type: 'Appel', notes: 'Premier contact, très positif.', interactor: users[2] },
];

let mediaItems: MediaItem[] = [
    { id: 'med1', tenantId: 't1', title: 'Prédication du 22/10', type: MediaType.Video, url: '#', tags: ['prédication', 'dimanche'], uploader: users[1], uploadDate: '2023-10-23' },
];

let volunteers: Volunteer[] = [
    { ...members[0], skills: ['Chant', 'Organisation'], availability: 'Weekends' },
];

let projectTeams: ProjectTeam[] = [
    { id: 'pt1', tenantId: 't1', name: 'Équipe d\'accueil', description: 'Accueil des membres et visiteurs', leader: members[0], members: [volunteers[0]], status: 'Active' },
];


// Data Service
export const dataService = {
  // Tenants
  getTenants: () => tenants,
  getTenant: (id: string) => tenants.find(t => t.id === id),
  addTenant: (data: Omit<ChurchTenant, 'id'>) => { tenants.push({ ...data, id: newId() }); },
  updateTenant: (data: ChurchTenant) => { tenants = tenants.map(t => t.id === data.id ? data : t); },
  deleteTenant: (id: string) => { tenants = tenants.filter(t => t.id !== id); },

  // Users
  getUsers: () => users,
  getUser: (id: string) => users.find(u => u.id === id),
  addUser: (data: Omit<User, 'id'>) => { users.push({ ...data, id: newId() }); },
  updateUser: (data: User) => { users = users.map(u => u.id === data.id ? data : u); },
  deleteUser: (id: string) => { users = users.filter(u => u.id !== id); },
  
  // Members
  getMembers: () => members,
  getMember: (id: string) => members.find(m => m.id === id),
  addMember: (data: Omit<Member, 'id'>) => { members.push({ ...data, id: newId() }); },
  updateMember: (data: Member) => { members = members.map(m => m.id === data.id ? data : m); },
  deleteMember: (id: string) => { members = members.filter(m => m.id !== id); },

  // Roles
  getRoles: () => roles,
  getRole: (id: string) => roles.find(r => r.id === id),
  addRole: (data: Omit<Role, 'id'>) => { roles.push({ ...data, id: newId() }); },
  updateRole: (data: Role) => { roles = roles.map(r => r.id === data.id ? data : r); },
  deleteRole: (id: string) => { roles = roles.filter(r => r.id !== id); },
  getPermissions: () => permissions,

  // Audit Logs
  getAuditLogs: () => auditLogs,

  // Groups
  getGroups: () => groups,
  getGroup: (id: string) => groups.find(g => g.id === id),
  addGroup: (data: Omit<Group, 'id'>) => { groups.push({ ...data, id: newId() }); },
  updateGroup: (data: Group) => { groups = groups.map(g => g.id === data.id ? data : g); },
  deleteGroup: (id: string) => { groups = groups.filter(g => g.id !== id); },

  // Staff
  getStaff: () => staff,
  getStaffMember: (id: string) => staff.find(s => s.id === id),
  addStaff: (data: Omit<StaffMember, 'staffId'>) => { staff.push({ ...data, staffId: `s_${newId()}` }); },
  updateStaff: (data: StaffMember) => { staff = staff.map(s => s.staffId === data.staffId ? data : s); },
  deleteStaff: (id: string) => { staff = staff.filter(s => s.id !== id); },
  
  // Events
  getEvents: () => events,
  
  // Training
  getTrainingSessions: () => trainingSessions,
  getTrainingSession: (id: string) => trainingSessions.find(ts => ts.id === id),
  addTrainingSession: (data: Omit<TrainingSession, 'id'>) => { trainingSessions.push({ ...data, id: newId() }); },
  updateTrainingSession: (data: TrainingSession) => { trainingSessions = trainingSessions.map(ts => ts.id === data.id ? data : ts); },
  deleteTrainingSession: (id: string) => { trainingSessions = trainingSessions.filter(ts => ts.id !== id); },

  // Finances
  getRevenues: () => revenues,
  addRevenue: (data: Omit<Revenue, 'id'>) => { revenues.push({ ...data, id: newId() }); },
  updateRevenue: (data: Revenue) => { revenues = revenues.map(r => r.id === data.id ? data : r); },
  deleteRevenue: (id: string) => { revenues = revenues.filter(r => r.id !== id); },
  getExpenses: () => expenses,
  addExpense: (data: Omit<Expense, 'id'>) => { expenses.push({ ...data, id: newId() }); },
  updateExpense: (data: Expense) => { expenses = expenses.map(e => e.id === data.id ? data : e); },
  deleteExpense: (id: string) => { expenses = expenses.filter(e => e.id !== id); },
  
  // Logistics
  getMaterials: () => materials,
  addMaterial: (data: Omit<Material, 'id'>) => { materials.push({ ...data, id: newId() }); },
  updateMaterial: (data: Material) => { materials = materials.map(m => m.id === data.id ? data : m); },
  deleteMaterial: (id: string) => { materials = materials.filter(m => m.id !== id); },
  getMaterialRequests: () => materialRequests,
  addMaterialRequest: (data: Omit<MaterialRequest, 'id'>) => { materialRequests.push({ ...data, id: newId() }); },
  updateMaterialRequest: (data: MaterialRequest) => { materialRequests = materialRequests.map(r => r.id === data.id ? data : r); },
  deleteMaterialRequest: (id: string) => { materialRequests = materialRequests.filter(r => r.id !== id); },
  
  // Communication
  getMessages: () => messages,
  addMessage: (data: Omit<Message, 'id' | 'status' | 'sentAt'>) => { messages.unshift({ ...data, id: newId(), status: MessageStatus.Sent, sentAt: new Date().toLocaleString() }); },

  // CRM
  getNewcomers: () => newcomers,
  addNewcomer: (data: Omit<Newcomer, 'id'>) => { newcomers.push({ ...data, id: newId() }); },
  updateNewcomer: (data: Newcomer) => { newcomers = newcomers.map(n => n.id === data.id ? data : n); },
  deleteNewcomer: (id: string) => { newcomers = newcomers.filter(n => n.id !== id); },
  getInteractionsFor: (newcomerId: string) => interactions.filter(i => i.newcomerId === newcomerId),
  addInteraction: (data: Omit<Interaction, 'id'>) => { interactions.push({ ...data, id: newId() }); },
  
  // Media Library
  getMediaItems: () => mediaItems,
  addMediaItem: (data: Omit<MediaItem, 'id'>) => { mediaItems.push({ ...data, id: newId() }); },
  updateMediaItem: (data: MediaItem) => { mediaItems = mediaItems.map(m => m.id === data.id ? data : m); },
  deleteMediaItem: (id: string) => { mediaItems = mediaItems.filter(m => m.id !== id); },

  // Volunteers
  getVolunteers: () => volunteers,
  // Fix: The 'data' object at runtime includes the member's 'id', but it's omitted
  // from the type to signal an "add" operation. Cast it to the correct Volunteer type.
  addVolunteer: (data: Omit<Volunteer, 'id'>) => { volunteers.push(data as Volunteer); },
  updateVolunteer: (data: Volunteer) => { volunteers = volunteers.map(v => v.id === data.id ? data : v); },
  deleteVolunteer: (id: string) => { volunteers = volunteers.filter(v => v.id !== id); },
  getProjectTeams: () => projectTeams,
  addProjectTeam: (data: Omit<ProjectTeam, 'id'>) => { projectTeams.push({ ...data, id: newId() }); },
  updateProjectTeam: (data: ProjectTeam) => { projectTeams = projectTeams.map(pt => pt.id === data.id ? data : pt); },
  deleteProjectTeam: (id: string) => { projectTeams = projectTeams.filter(pt => pt.id !== id); },

};