import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertContractorProfileSchema, insertProjectSchema, insertBidSchema, insertMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email) || await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      const user = await storage.createUser(userData);
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(400).json({ message: "Invalid data", error });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(400).json({ message: "Login failed", error });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    const user = await storage.getUser(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ ...user, password: undefined });
  });

  // Contractor profile routes
  app.post("/api/contractor-profiles", async (req, res) => {
    try {
      const profileData = insertContractorProfileSchema.parse(req.body);
      const userId = req.headers['user-id'] as string;
      
      if (!userId) {
        return res.status(401).json({ message: "User ID required" });
      }
      
      const profile = await storage.createContractorProfile({ ...profileData, userId });
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: "Invalid data", error });
    }
  });

  app.get("/api/contractor-profiles/user/:userId", async (req, res) => {
    const profile = await storage.getContractorProfile(req.params.userId);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  });

  app.put("/api/contractor-profiles/:id", async (req, res) => {
    try {
      const profileData = insertContractorProfileSchema.partial().parse(req.body);
      const profile = await storage.updateContractorProfile(req.params.id, profileData);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: "Invalid data", error });
    }
  });

  app.get("/api/contractor-profiles", async (req, res) => {
    const { specialties, location } = req.query;
    const filters: any = {};
    
    if (specialties) {
      filters.specialties = Array.isArray(specialties) ? specialties : [specialties];
    }
    if (location) {
      filters.location = location;
    }
    
    const profiles = await storage.getContractorProfiles(filters);
    res.json(profiles);
  });

  // Project routes
  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const ownerId = req.headers['user-id'] as string;
      
      if (!ownerId) {
        return res.status(401).json({ message: "User ID required" });
      }
      
      const project = await storage.createProject({ ...projectData, ownerId });
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid data", error });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    const project = await storage.getProject(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  });

  app.get("/api/projects", async (req, res) => {
    const { ownerId } = req.query;
    
    if (ownerId) {
      const projects = await storage.getProjectsByOwner(ownerId as string);
      res.json(projects);
    } else {
      const projects = await storage.getAllProjects();
      res.json(projects);
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const projectData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(req.params.id, projectData);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid data", error });
    }
  });

  // Bid routes
  app.post("/api/bids", async (req, res) => {
    try {
      const bidData = insertBidSchema.parse(req.body);
      const contractorId = req.headers['user-id'] as string;
      
      if (!contractorId) {
        return res.status(401).json({ message: "User ID required" });
      }
      
      const bid = await storage.createBid({ ...bidData, contractorId });
      res.json(bid);
    } catch (error) {
      res.status(400).json({ message: "Invalid data", error });
    }
  });

  app.get("/api/bids/project/:projectId", async (req, res) => {
    const bids = await storage.getBidsByProject(req.params.projectId);
    res.json(bids);
  });

  app.get("/api/bids/contractor/:contractorId", async (req, res) => {
    const bids = await storage.getBidsByContractor(req.params.contractorId);
    res.json(bids);
  });

  app.put("/api/bids/:id", async (req, res) => {
    try {
      const { status } = req.body;
      const bid = await storage.updateBid(req.params.id, { status });
      
      if (!bid) {
        return res.status(404).json({ message: "Bid not found" });
      }
      
      // If bid is accepted, update project status
      if (status === "accepted") {
        await storage.updateProject(bid.projectId, { 
          status: "awarded", 
          awardedContractorId: bid.contractorId 
        });
      }
      
      res.json(bid);
    } catch (error) {
      res.status(400).json({ message: "Invalid data", error });
    }
  });

  // Message routes
  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const senderId = req.headers['user-id'] as string;
      
      if (!senderId) {
        return res.status(401).json({ message: "User ID required" });
      }
      
      const message = await storage.createMessage({ ...messageData, senderId });
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid data", error });
    }
  });

  app.get("/api/messages/project/:projectId", async (req, res) => {
    const messages = await storage.getMessagesByProject(req.params.projectId);
    res.json(messages);
  });

  app.get("/api/conversations/:userId", async (req, res) => {
    const conversations = await storage.getConversations(req.params.userId);
    res.json(conversations);
  });

  const httpServer = createServer(app);
  return httpServer;
}
