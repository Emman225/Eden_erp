
export type Page = 
  | 'Tableau de bord'
  | 'Gestion des Églises'
  | 'Gestion des Membres'
  | 'Gestion des Utilisateurs'
  | 'Gestion des Rôles'
  | 'Journal d\'Audit'
  | 'Gestion des Groupes'
  | 'Gestion du Personnel'
  | 'Planning'
  | 'Suivi des Présences'
  | 'Formations'
  | 'Finances'
  | 'Logistique'
  | 'Communication'
  | 'Suivi des Nouveaux'
  | 'Médiathèque'
  | 'Bénévolat'
  | 'Notifications';

export interface User {
  id: string;
  tenantId: string;
  prenom: string;
  nom: string;
  email: string;
  role: string;
  actif: boolean;
  multi_sites: boolean;
}

export enum TenantStatus {
  Active = 'Actif',
  Suspended = 'Suspendu',
  Deleted = 'Supprimé'
}

export interface ChurchTenant {
  id: string;
  name: string;
  slug: string;
  domain: string;
  status: TenantStatus;
  plan: string;
  admin: User;
  createdAt: string;
}

export enum Gender {
    Male = 'Homme',
    Female = 'Femme',
}

export enum CivilStatus {
    Single = 'Célibataire',
    Married = 'Marié(e)',
    Divorced = 'Divorcé(e)',
    Widowed = 'Veuf(ve)',
}

export enum MemberStatus {
    Active = 'Actif',
    Inactive = 'Inactif',
    Archived = 'Archivé',
    Deceased = 'Décédé',
    Transferred = 'Transféré',
}

export enum SpiritualStatus {
    New = 'Nouveau converti',
    Baptized = 'Baptisé',
    ActiveMember = 'Membre Actif',
}

export interface Member {
  id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  birthdate: string;
  email: string;
  phone: string;
  address: string;
  photoUrl: string;
  civilStatus: CivilStatus;
  status: MemberStatus;
  spiritualStatus: SpiritualStatus;
  baptismDate?: string;
  conversionDate?: string;
  joinedAt: string;
}

export interface Permission {
  id: string;
  module: string;
  action: string;
}

export interface Role {
  id: string;
  tenantId: string;
  nom: string;
  description: string;
  permissions: Permission[];
}

export interface AuditLog {
  id: string;
  tenantId: string;
  user_id: string;
  userName: string;
  action: string;
  objet: string;
  objet_id: string;
  date: string;
  ip: string;
}

export interface Group {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  type: string;
  leader: Member;
  members: Member[];
  createdAt: string;
}

export enum StaffStatus {
    Employee = 'Employé',
    Volunteer = 'Bénévole',
    Contractor = 'Contractuel',
}

export interface StaffAssignment {
    id: string;
    staffId: string;
    title: string;
    description: string;
    startDate: string;
    endDate?: string;
}

export interface StaffMember extends Member {
    staffId: string;
    position: string;
    department: string;
    hiredAt: string;
    staffStatus: StaffStatus;
    assignments: StaffAssignment[];
}

export interface PlanningEvent {
    id: string;
    tenantId: string;
    title: string;
    category: string;
    description?: string;
    start: Date;
    end: Date;
    location?: string;
    attendees: Member[];
}

export interface TrainingParticipant {
    member: Member;
    status: 'Inscrit' | 'Terminé' | 'Annulé';
}
export interface TrainingSession {
    id: string;
    tenantId: string;
    title: string;
    description: string;
    instructor: string;
    startDate: string;
    endDate: string;
    location: string;
    participants: TrainingParticipant[];
}

export enum TransactionType {
    Tithe = 'Dîme',
    Offering = 'Offrande',
    Contribution = 'Contribution',
    Donation = 'Don',
    Other = 'Autre',
}
export enum PaymentMethod {
    Cash = 'Espèces',
    Check = 'Chèque',
    Card = 'Carte bancaire',
    MobileMoney = 'Mobile Money',
    BankTransfer = 'Virement bancaire',
}
export enum ExpenseStatus {
    Pending = 'En attente',
    Approved = 'Approuvée',
    Rejected = 'Rejetée',
}
export interface Revenue {
    id: string;
    tenantId: string;
    type: TransactionType;
    amount: number;
    paymentDate: string;
    sourceMemberId?: string;
    sourceDescription: string;
    paymentMethod: PaymentMethod;
    allocation?: string;
    note?: string;
}
export interface Expense {
    id: string;
    tenantId: string;
    description: string;
    amount: number;
    beneficiary: string;
    expenseDate: string;
    costCenter: string;
    status: ExpenseStatus;
    paymentMethod: PaymentMethod;
    observation?: string;
}

export enum MaterialType {
    Sound = 'Sonorisation',
    Video = 'Vidéo',
    Furniture = 'Mobilier',
    IT = 'Informatique',
    Other = 'Autre',
}
export enum MaterialStatus {
    Good = 'Bon état',
    Used = 'Usé',
    Broken = 'Cassé',
    InMaintenance = 'En maintenance',
}
export interface Material {
    id: string;
    tenantId: string;
    name: string;
    type: MaterialType;
    description?: string;
    totalQuantity: number;
    availableQuantity: number;
    status: MaterialStatus;
    location: string;
    photoUrl?: string;
}
export enum RequestStatus {
    Pending = 'En attente',
    Approved = 'Approuvée',
    Rejected = 'Rejetée',
    InProgress = 'En cours',
    Returned = 'Retourné',
    Cancelled = 'Annulée'
}
export interface MaterialRequestItem {
    materialId: string;
    quantity: number;
}
export interface MaterialRequest {
    id: string;
    tenantId: string;
    requesterId: string;
    requesterName: string;
    eventId?: string;
    eventName: string;
    requestDate: string;
    startDate: string;
    endDate: string;
    items: MaterialRequestItem[];
    status: RequestStatus;
    comment?: string;
}

export enum MessageStatus {
    Sent = 'Envoyé',
    Draft = 'Brouillon',
    Failed = 'Échec',
}
export interface Message {
    id: string;
    tenantId: string;
    channel: 'SMS' | 'Email';
    subject?: string;
    content: string;
    recipients: Member[];
    sentAt: string;
    status: MessageStatus;
}

export enum FollowUpStatus {
    New = 'Nouveau',
    Contacted = 'Contacté',
    VisitPlanned = 'Visite planifiée',
    Integrated = 'Intégré',
    Archived = 'Archivé',
}
export interface Newcomer {
    id: string;
    tenantId: string;
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    firstVisitDate: string;
    cameFrom: string;
    prayerRequest?: string;
    status: FollowUpStatus;
    assignedTo?: User;
}

export interface Interaction {
    id: string;
    newcomerId: string;
    date: string;
    type: 'Appel' | 'Visite' | 'Email' | 'SMS' | 'Rencontre';
    notes: string;
    interactor: User;
}

export enum MediaType {
    Video = 'Vidéo',
    Audio = 'Audio',
    Document = 'Document',
}
export interface MediaItem {
    id: string;
    tenantId: string;
    title: string;
    type: MediaType;
    description?: string;
    url: string;
    thumbnailUrl?: string;
    tags: string[];
    uploader: User;
    uploadDate: string;
}

export interface Volunteer extends Member {
    skills: string[];
    availability: string;
}
export interface ProjectTeam {
    id: string;
    tenantId: string;
    name: string;
    description: string;
    leader: Member;
    members: Volunteer[];
    status: 'Active' | 'Inactive';
}
export interface DashboardStats {
    totalMembers: number;
    totalRevenue: number;
    totalTenants: number;
    newcomersLast30Days: number;
    spiritualStatusCounts: { name: string, value: number }[];
    revenueByType: { name: string, value: number }[];
}