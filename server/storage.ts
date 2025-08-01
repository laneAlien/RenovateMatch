import { 
  type User, 
  type InsertUser, 
  type ContractorProfile, 
  type InsertContractorProfile,
  type Project,
  type InsertProject,
  type Bid,
  type InsertBid,
  type Message,
  type InsertMessage
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Contractor profile operations
  getContractorProfile(userId: string): Promise<ContractorProfile | undefined>;
  getContractorProfileById(id: string): Promise<ContractorProfile | undefined>;
  createContractorProfile(profile: InsertContractorProfile & { userId: string }): Promise<ContractorProfile>;
  updateContractorProfile(id: string, profile: Partial<InsertContractorProfile>): Promise<ContractorProfile | undefined>;
  getContractorProfiles(filters?: { specialties?: string[]; location?: string }): Promise<ContractorProfile[]>;
  
  // Project operations
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject & { ownerId: string }): Promise<Project>;
  updateProject(id: string, project: Partial<Project>): Promise<Project | undefined>;
  getProjectsByOwner(ownerId: string): Promise<Project[]>;
  getAllProjects(): Promise<Project[]>;
  
  // Bid operations
  getBid(id: string): Promise<Bid | undefined>;
  createBid(bid: InsertBid & { contractorId: string }): Promise<Bid>;
  updateBid(id: string, bid: Partial<Bid>): Promise<Bid | undefined>;
  getBidsByProject(projectId: string): Promise<Bid[]>;
  getBidsByContractor(contractorId: string): Promise<Bid[]>;
  
  // Message operations
  getMessage(id: string): Promise<Message | undefined>;
  createMessage(message: InsertMessage & { senderId: string }): Promise<Message>;
  getMessagesByProject(projectId: string): Promise<Message[]>;
  getConversations(userId: string): Promise<{ projectId: string; otherUserId: string; lastMessage: Message }[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contractorProfiles: Map<string, ContractorProfile>;
  private projects: Map<string, Project>;
  private bids: Map<string, Bid>;
  private messages: Map<string, Message>;

  constructor() {
    this.users = new Map();
    this.contractorProfiles = new Map();
    this.projects = new Map();
    this.bids = new Map();
    this.messages = new Map();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      phone: insertUser.phone ?? null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Contractor profile operations
  async getContractorProfile(userId: string): Promise<ContractorProfile | undefined> {
    return Array.from(this.contractorProfiles.values()).find(profile => profile.userId === userId);
  }

  async getContractorProfileById(id: string): Promise<ContractorProfile | undefined> {
    return this.contractorProfiles.get(id);
  }

  async createContractorProfile(profile: InsertContractorProfile & { userId: string }): Promise<ContractorProfile> {
    const id = randomUUID();
    const contractorProfile: ContractorProfile = {
      ...profile,
      id,
      description: profile.description ?? null,
      specialties: profile.specialties ?? null,
      yearsExperience: profile.yearsExperience ?? null,
      serviceRadius: profile.serviceRadius ?? null,
      profileImage: profile.profileImage ?? null,
      portfolioImages: profile.portfolioImages ?? null,
      rating: 0,
      reviewCount: 0,
      isVerified: false,
      createdAt: new Date()
    };
    this.contractorProfiles.set(id, contractorProfile);
    return contractorProfile;
  }

  async updateContractorProfile(id: string, profile: Partial<InsertContractorProfile>): Promise<ContractorProfile | undefined> {
    const existing = this.contractorProfiles.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...profile };
    this.contractorProfiles.set(id, updated);
    return updated;
  }

  async getContractorProfiles(filters?: { specialties?: string[]; location?: string }): Promise<ContractorProfile[]> {
    let profiles = Array.from(this.contractorProfiles.values());
    
    if (filters?.specialties && filters.specialties.length > 0) {
      profiles = profiles.filter(profile => 
        profile.specialties?.some(specialty => filters.specialties!.includes(specialty))
      );
    }
    
    return profiles;
  }

  // Project operations
  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(project: InsertProject & { ownerId: string }): Promise<Project> {
    const id = randomUUID();
    const newProject: Project = {
      ...project,
      id,
      location: project.location ?? null,
      images: project.images ?? null,
      status: "posted",
      awardedContractorId: null,
      createdAt: new Date()
    };
    this.projects.set(id, newProject);
    return newProject;
  }

  async updateProject(id: string, project: Partial<Project>): Promise<Project | undefined> {
    const existing = this.projects.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...project };
    this.projects.set(id, updated);
    return updated;
  }

  async getProjectsByOwner(ownerId: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(project => project.ownerId === ownerId);
  }

  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  // Bid operations
  async getBid(id: string): Promise<Bid | undefined> {
    return this.bids.get(id);
  }

  async createBid(bid: InsertBid & { contractorId: string }): Promise<Bid> {
    const id = randomUUID();
    const newBid: Bid = {
      ...bid,
      id,
      status: "pending",
      createdAt: new Date()
    };
    this.bids.set(id, newBid);
    return newBid;
  }

  async updateBid(id: string, bid: Partial<Bid>): Promise<Bid | undefined> {
    const existing = this.bids.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...bid };
    this.bids.set(id, updated);
    return updated;
  }

  async getBidsByProject(projectId: string): Promise<Bid[]> {
    return Array.from(this.bids.values()).filter(bid => bid.projectId === projectId);
  }

  async getBidsByContractor(contractorId: string): Promise<Bid[]> {
    return Array.from(this.bids.values()).filter(bid => bid.contractorId === contractorId);
  }

  // Message operations
  async getMessage(id: string): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async createMessage(message: InsertMessage & { senderId: string }): Promise<Message> {
    const id = randomUUID();
    const newMessage: Message = {
      ...message,
      id,
      createdAt: new Date()
    };
    this.messages.set(id, newMessage);
    return newMessage;
  }

  async getMessagesByProject(projectId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.projectId === projectId)
      .sort((a, b) => a.createdAt!.getTime() - b.createdAt!.getTime());
  }

  async getConversations(userId: string): Promise<{ projectId: string; otherUserId: string; lastMessage: Message }[]> {
    const userMessages = Array.from(this.messages.values())
      .filter(message => message.senderId === userId || message.receiverId === userId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());

    const conversationMap = new Map<string, { otherUserId: string; lastMessage: Message }>();

    for (const message of userMessages) {
      const key = `${message.projectId}`;
      if (!conversationMap.has(key)) {
        const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
        conversationMap.set(key, { otherUserId, lastMessage: message });
      }
    }

    return Array.from(conversationMap.entries()).map(([projectId, data]) => ({
      projectId,
      ...data
    }));
  }
}

export const storage = new MemStorage();
