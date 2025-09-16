// src/services/service.service.ts
import { Service } from "../models/Services.model";
import { Sequelize } from "sequelize";
import EmployeeService from "./Employee.service";

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
      const services = await Service.findAll({ include: ["subServices"] });
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

  // create Service with SubServices
  static async createWithSubServices(body: any): Promise<Service> {
    // const t = await ServiceService.sequelize.transaction();
    try {
      const service = await Service.create(body, {
        include: ["subServices"],
        // transaction: t,
      });
      // await t.commit();
      return service;
    } catch (error) {
      // await t.rollback();
      throw new Error(
        `Error creating service with subservices: ${error.message}`
      );
    }
  }

  // create multi Service with SubServices
  static async createMultiWithSubServices(body: any[]): Promise<Service[]> {
    // const t = await ServiceService.sequelize.transaction();
    // console.log("transaction started", t);

    try {
      const services = await Service.bulkCreate(body, {
        include: ["subServices"],
        // transaction: t,
      });
      // await t.commit();
      return services;
    } catch (error) {
      // await t.rollback();
      throw new Error(
        `Error creating multiple services with subservices: ${error.message}`
      );
    }
  }

  static async createManyWithSubAndAssignEmployee(
    body: any[]
  ): Promise<{ message: string }> {
    try {
      for (const item of body) {
        const { employeeIds, ...serviceData } = item;

        console.log("emp iddd", employeeIds);
        console.log("service dataaa", serviceData);

        // 1. Create service with subservices
        const data = await this.createWithSubServices(serviceData);
        console.log("pass service creation");

        const id = data.toJSON().id;

        console.log(22222222222222222222222222222222);

        // 2. Update employees one by one
        for (const empId of employeeIds) {
          console.log("assign", empId, id);

          await EmployeeService.simpleUpdate({ id: empId }, { service_id: id });
          console.log("assign pass");
        }
      }

      // If everything succeeds
      return {
        message:
          "All services and employee assignments were created successfully.",
      };
    } catch (error) {
      // Handle errors
      console.error("Error creating services or assigning employees:", error);
      throw new Error("Failed to create services or assign employees.");
    }
  }
}

export default ServiceService;
