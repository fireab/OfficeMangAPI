import { Request, Response } from "express";
import ServiceService from "../services/subService.service";
import { Employee } from "../models/Employee.model";
class ServiceController {
  static async getAllServices(req: Request, res: Response) {
    let result = await ServiceService.getAll();
    console.log("resulttttt", result);

    let JsonData = result.map((service) => service.toJSON());
    console.log("hello thre man", JSON.stringify(JsonData, null, 2));

    let formatRes = JsonData.map((service: any) => {
      return {
        id: service.id,
        title: service.title,
        titleEn: service.titleEn,
        icon: service.icon,
        color: service.color,
        subServices: service.subServices.map((subService: any) => {
          return subService.title;
        }),
        employees: service.employees.map((emp: any) => {
          return {
            name: emp.amharic_name,
            position: emp.position.name_am,
            image: `http://localhost:2000/public/${emp.path}`,
          };
        }),
      };
    });

    res.status(200).json(formatRes);
  }

  static async getServiceById(req: Request, res: Response) {
    // Implement logic to get a service by ID
    const { id } = req.params;
    res.json({ message: `Get service with ID: ${id}` });
  }

  static async createService(req: Request, res: Response) {
    // Implement logic to create a new service
    res.json({ message: "Create new service" });
  }

  static async updateService(req: Request, res: Response) {
    // Implement logic to update a service
    const { id } = req.params;
    res.json({ message: `Update service with ID: ${id}` });
  }

  static async deleteService(req: Request, res: Response) {
    // Implement logic to delete a service
    const { id } = req.params;
    res.json({ message: `Delete service with ID: ${id}` });
  }
}
export default ServiceController;
