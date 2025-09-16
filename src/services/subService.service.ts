// src/services/service.service.ts
import { SubService } from "../models/SubService.model";
import { Service } from "../models/Services.model";
import { Sequelize } from "sequelize";
import { Employee } from "../models/Employee.model";

class ServiceService {
  private static sequelize: Sequelize;

  static setSequelize(sequelize: Sequelize) {
    ServiceService.sequelize = sequelize;
  }

  // Create a new service
  static async create(body: any): Promise<Service> {
    try {
      const service = await Service.create(body);
      return service;
    } catch (error) {
      throw new Error(`Error creating service: ${error.message}`);
    }
  }

  // Get all services
  static async getAll(): Promise<Service[]> {
    try {
      const services = await Service.findAll({
        // include: ["subServices", "employees", "employees.postion"],
        include: [
          {
            model: SubService,
            as: "subServices",
          },
          {
            model: Employee,
            as: "employees",
            include: ["position"],
          },
        ],
      });

      return services;
    } catch (error) {
      throw new Error(`Error getting services: ${error.message}`);
    }
  }

  // Get a service by ID
  static async getById(id: number): Promise<Service | null> {
    try {
      const service = await Service.findByPk(id);
      return service;
    } catch (error) {
      throw new Error(`Error getting service by ID: ${error.message}`);
    }
  }

  // Update a service
  static async update(id: number, body: any): Promise<Service> {
    try {
      const service = await Service.findByPk(id);
      if (!service) {
        throw new Error(`Service not found`);
      }
      await service.update(body);
      return service;
    } catch (error) {
      throw new Error(`Error updating service: ${error.message}`);
    }
  }

  // Delete a service
  static async delete(id: number): Promise<void> {
    try {
      const service = await Service.findByPk(id);
      if (!service) {
        throw new Error(`Service not found`);
      }
      await service.destroy();
    } catch (error) {
      throw new Error(`Error deleting service: ${error.message}`);
    }
  }
}

export default ServiceService;
